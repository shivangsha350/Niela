import nodemailer from "nodemailer";

// In-memory caching for OAuth token to avoid requesting a token on every email send
let cachedToken = null;
let tokenExpiry = 0; // Timestamp in milliseconds

/**
 * Request Microsoft 365 OAuth 2.0 Access Token using Client Credentials Flow.
 * The endpoint is: https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token
 * Uses the SMTP.SendAsApp permission scope: https://outlook.office365.com/.default
 */
const getAccessToken = async () => {
  const tenantId = process.env.SMTP_TENANT_ID;
  const clientId = process.env.SMTP_CLIENT_ID;
  const clientSecret = process.env.SMTP_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing Microsoft 365 OAuth credentials in environment (SMTP_TENANT_ID, SMTP_CLIENT_ID, or SMTP_CLIENT_SECRET).");
  }

  // If token is cached and valid for more than 5 minutes, reuse it
  if (cachedToken && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  try {
    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("scope", "https://outlook.office365.com/.default");
    params.append("grant_type", "client_credentials");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      throw new Error(`Azure token response status ${response.status}: ${errorData.error_description || errorData.error || errorText}`);
    }

    const data = await response.json();
    if (!data.access_token) {
      throw new Error("No access_token returned from Microsoft login service.");
    }

    cachedToken = data.access_token;
    // data.expires_in is in seconds; convert to milliseconds
    tokenExpiry = Date.now() + (data.expires_in * 1000);
    return cachedToken;
  } catch (error) {
    // Log a safe error, do not expose credentials
    console.error("Failed to acquire Microsoft 365 SMTP OAuth token:", error.message);
    throw new Error(`OAuth Token Acquisition Failed: ${error.message}`);
  }
};

/**
 * Sends email using Nodemailer.
 * Automatically selects between Microsoft 365 OAuth 2.0 or SMTP Password fallback.
 */
const sendEmail = async ({ to, subject, text, html, attachments }) => {
  const useOAuth = !!(process.env.SMTP_CLIENT_ID && process.env.SMTP_CLIENT_SECRET && process.env.SMTP_TENANT_ID);

  let transporter;

  if (useOAuth) {
    try {
      const accessToken = await getAccessToken();
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.office365.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // Must be false for Port 587 (STARTTLS)
        auth: {
          type: "OAuth2",
          user: process.env.SMTP_USER || "Niela@nielacare.com",
          accessToken: accessToken,
        },
      });
    } catch (error) {
      console.error("SMTP OAuth Transporter setup failed:", error.message);
      throw error;
    }
  } else {
    // Fallback to basic SMTP password authentication (Gmail or Microsoft SMTP basic auth)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || "",
        pass: (process.env.SMTP_PASS || "").replace(/\s/g, ""),
      },
    });
  }

  const smtpUser = process.env.SMTP_USER;
  if (smtpUser && smtpUser.trim() !== "") {
    const mailOptions = {
      from: `"Niela Care" <${smtpUser}>`,
      to,
      subject,
      text,
      html,
      ...(attachments && attachments.length > 0 ? { attachments } : {}),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error("SMTP SendMail failed:", error.message);
      throw new Error(`Email delivery failed: ${error.message}`);
    }
  } else {
    // If SMTP credentials aren't configured, we simulate success
    console.log(`\n--------------------------------------------------`);
    console.log(`[SMTP Simulator] Mail would be sent to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Attachments: ${attachments?.length || 0} file(s)`);
    console.log(`Content: ${text}`);
    console.log(`--------------------------------------------------\n`);
    return { messageId: "simulated-id" };
  }
};

export default sendEmail;
