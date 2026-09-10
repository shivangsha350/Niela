import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/mailer.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "niela_default_secret_key", {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/send-otp
// @desc    Generate and send OTP
// @access  Public
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Generate a 6-digit numeric OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB, overwrite if exists
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Conspicuous logging for local testing
    console.log("\n==================================================");
    console.log(`[OTP Verification] Generated OTP for ${email}: ${otp}`);
    console.log("==================================================\n");

    // Attempt to send email
    try {
      await sendEmail({
        to: email,
        subject: "Niela - Email Verification OTP",
        text: `Your verification OTP is: ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">Verify Your Email</h2>
              <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Thank you for registering with Niela. Use the code below to complete your sign up.</p>
            </div>
            <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: 800; tracking-widest: 6px; color: #db2777; letter-spacing: 6px; font-family: monospace;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">This OTP is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error(`[nodemailer] Error sending mail: ${emailErr.message}. Fallback: OTP logged to console.`);
    }

    res.status(200).json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password, otp } = req.body;
  
  if (!name || !email || !password || !otp) {
    return res.status(400).json({ message: "Please fill in all fields and provide the OTP." });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Verify OTP from database
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP code." });
    }

    // Delete OTP record after successful validation
    await Otp.deleteOne({ email });

    // Set role to admin if the email is admin@nielacare.com or admin@niela.com
    const role = (email.toLowerCase() === "admin@nielacare.com" || email.toLowerCase() === "admin@niela.com") ? "admin" : "user";

    const user = await User.create({ name, email, password, role });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data provided" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/google-login
// @desc    Register or login user with Google credentials
// @access  Public
router.post("/google-login", async (req, res) => {
  const { name, email, googleId, token } = req.body;

  let gId, gEmail, gName, gPicture;

  if (process.env.GOOGLE_CLIENT_ID) {
    if (!token) {
      return res.status(400).json({ message: "Google ID token is required." });
    }
    try {
      const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      if (!payload || !payload.email_verified) {
        return res.status(400).json({ message: "Google email is not verified." });
      }

      gId = payload.sub;
      gEmail = payload.email;
      gName = payload.name;
      gPicture = payload.picture;
    } catch (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ message: "Invalid or expired Google token." });
    }
  } else {
    // Fallback for development without GOOGLE_CLIENT_ID configured
    if (!googleId || !email || !name) {
      return res.status(400).json({ message: "Invalid Google user data." });
    }
    gId = googleId;
    gEmail = email;
    gName = name;
    gPicture = "";
  }

  try {
    // 1. Search for user by googleId
    let user = await User.findOne({ googleId: gId });

    if (!user) {
      // 2. If not found by googleId, check by email (Account Linking)
      user = await User.findOne({ email: gEmail.toLowerCase() });

      if (user) {
        // Link googleId to existing user account
        user.googleId = gId;
        user.authProvider = "google";
        if (gPicture && !user.profilePicture) {
          user.profilePicture = gPicture;
        }
        await user.save();
      } else {
        // 3. Create a new user if they don't exist
        const role = (gEmail.toLowerCase() === "admin@nielacare.com" || gEmail.toLowerCase() === "admin@niela.com") ? "admin" : "user";
        user = new User({
          name: gName,
          email: gEmail.toLowerCase(),
          googleId: gId,
          authProvider: "google",
          profilePicture: gPicture,
          role,
        });
        await user.save();
      }
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User profile not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/update-password
// @desc    Update user password
// @access  Private
router.put("/update-password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Please provide current and new passwords." });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.authProvider !== "local") {
      return res.status(400).json({ message: "Cannot change password for external accounts." });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP to email
// @access  Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required." });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email address." });
    }

    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        message: "This account was registered using Google Sign-In. Please sign in using Google.",
      });
    }

    // Generate a 6-digit numeric OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB with 10 min TTL
    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    console.log("\n==================================================");
    console.log(`[Forgot Password] Generated OTP for ${cleanEmail}: ${otp}`);
    console.log("==================================================\n");

    // Send email using Microsoft 365 / SMTP
    try {
      await sendEmail({
        to: cleanEmail,
        subject: "Niela - Password Reset Verification OTP",
        text: `Your password reset OTP is: ${otp}. It will expire in 10 minutes. If you did not request this, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #fce7f3; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
              <h2 style="font-family: Georgia, serif; font-size: 30px; color: #0f172a; margin: 0; font-weight: bold;">niela<span style="font-size: 13px; color: #db2777;">®</span></h2>
              <div style="font-size: 9px; letter-spacing: 2px; color: #db2777; font-weight: 800; text-transform: uppercase; margin-top: 2px;">— CARE YOU CAN FEEL —</div>
            </div>

            <div style="text-align: center; margin: 24px 0 16px;">
              <span style="background-color: #fdf2f4; color: #db2777; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 4px 14px; border-radius: 9999px;">Password Reset Request</span>
              <h1 style="color: #0f172a; margin: 14px 0 6px 0; font-size: 22px; font-weight: 800;">Reset Your Password</h1>
              <p style="color: #64748b; font-size: 13.5px; margin: 0 auto; max-width: 440px; line-height: 1.5;">
                Hi ${user.name || "there"}, we received a request to reset your password. Use the verification code below to set a new password:
              </p>
            </div>

            <div style="background-color: #fdf2f8; border: 2px dashed #f472b6; border-radius: 14px; padding: 22px; text-align: center; margin: 20px 0;">
              <div style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #db2777; font-family: monospace;">${otp}</div>
              <p style="margin: 6px 0 0 0; font-size: 11px; color: #9d174d; font-weight: 600;">Valid for 10 minutes</p>
            </div>

            <div style="background-color: #f8fafc; border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 12px; color: #64748b; line-height: 1.5;">
              🔒 <strong>Security Tip:</strong> Never share this code with anyone. Niela support will never ask you for your OTP. If you did not request this, you can safely ignore this email.
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0;">Need help? Write to us at <a href="mailto:support@nielacare.com" style="color: #db2777; text-decoration: none; font-weight: 600;">support@nielacare.com</a></p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error(`[Mailer] Error sending reset OTP email: ${emailErr.message}. Fallback: OTP logged to console.`);
    }

    res.status(200).json({ message: "Password reset OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Verify OTP and update user password
// @access  Public
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP code, and new password are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify OTP from database
    const otpRecord = await Otp.findOne({ email: cleanEmail });
    if (!otpRecord || otpRecord.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid or expired OTP code." });
    }

    // Delete OTP record after successful validation
    await Otp.deleteOne({ email: cleanEmail });

    // Update password (triggers userSchema pre('save') bcrypt hashing)
    user.password = newPassword;
    await user.save();

    console.log(`[Password Reset] Password updated successfully for: ${cleanEmail}`);

    res.status(200).json({
      success: true,
      message: "Password updated successfully! You can now login with your new password.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
