import express from "express";
import sendEmail from "../utils/mailer.js";

const router = express.Router();

// @route   POST /api/test-email
// @desc    Send a test email to verify SMTP OAuth 2.0 configuration
// @access  Public (for verification, does not expose secrets)
router.post("/test-email", async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ message: "Recipient 'to' email address is required." });
  }

  try {
    const info = await sendEmail({
      to,
      subject: "Niela - SMTP OAuth 2.0 Test Email",
      text: "Hello! This email confirms that Microsoft 365 SMTP OAuth 2.0 Client Credentials flow is working correctly.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Microsoft 365 SMTP OAuth 2.0 Connection Successful</h2>
          <p style="color: #334155; font-size: 14px;">This is a test email sent from the Niela backend server verifying that the SMTP configuration is working correctly.</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <span style="color: #166534; font-weight: bold; font-size: 14px;">Status: Success</span>
            <p style="color: #1e293b; font-size: 13px; margin: 5px 0 0 0;">SMTP authentication using Azure AD app registration completed successfully.</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Test email sent successfully.",
      messageId: info.messageId || null,
    });
  } catch (error) {
    console.error("Test email route error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send test email.",
      error: error.message,
    });
  }
});

export default router;
