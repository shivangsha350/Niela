import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  // Configure nodemailer transporter using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "", // email address
      pass: (process.env.SMTP_PASS || "").replace(/\s/g, ""), // app password (strip spaces)
    },
  });

  // Send mail only if SMTP_USER is set
  if (process.env.SMTP_USER && process.env.SMTP_USER.trim() !== "") {
    const mailOptions = {
      from: `"Niela Care" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
  } else {
    // If SMTP credentials aren't configured, we simulate success
    console.log(`\n--------------------------------------------------`);
    console.log(`[SMTP Simulator] Mail would be sent to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${text}`);
    console.log(`--------------------------------------------------\n`);
  }
};

export default sendEmail;
