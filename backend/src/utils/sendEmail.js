import nodemailer from "nodemailer";

// Generate a random 6-digit code
export function generateEmailVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter configuration error:", error);
  } else {
    console.log("Email server is ready to take our messages");
  }
});

const nodemailerTemplate = (code) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1A3A40;">
    <center style="width: 100%; table-layout: fixed; background-color: #1A3A40; padding-bottom: 60px;">
        <table style="border-spacing: 0; width: 100%; max-width: 600px; margin: 0 auto; background-color: #1A3A40; color: #F0F4F2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <tr>
                <td style="padding: 20px 0 10px 0; text-align: center;">
                    <h1 style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: bold; color: #F0F4F2; margin: 0;">TatvamAI</h1>
                </td>
            </tr>

            <tr>
                <td style="padding: 30px; background-color: #25424a; border-radius: 12px;">
                    <table style="border-spacing: 0; width: 100%;">
                        <tr>
                            <td style="padding: 0; text-align: center;">
                                <h2 style="font-family: Georgia, 'Times New Roman', Times, serif; font-size: 32px; line-height: 40px; font-weight: bold; color: #F0F4F2; padding: 15px 0 5px 0; margin: 0;">Confirm Your Email</h2>
                                <p style="font-size: 16px; line-height: 24px; color: #d8e0dd; padding: 10px 0 20px 0; margin: 0;">Hello,<br>Thank you for joining our platform. Please use the verification code below to complete your registration.</p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 20px 0; text-align: center;">
                                <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #C2D4AB; padding: 10px; background-color: #2c4a52; border-radius: 8px; display: inline-block;">${code}</span>
                            </td>
                        </tr>

                        <tr>
                           <td style="padding: 0; text-align: center;">
                                <p style="font-size: 14px; line-height: 24px; color: #d8e0dd; margin: 0;">If you did not request this, you can safely ignore this email.</p>
                                <p style="font-size: 14px; line-height: 24px; color: #d8e0dd; margin-top: 15px;">Best regards,<br><strong style="color: #F0F4F2;">Team TatvamAI</strong></p>
                           </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td style="padding: 30px 0 0 0; text-align: center;">
                    <p style="font-size: 12px; color: #a9b4b0; margin: 0;">&copy; ${new Date().getFullYear()} TatvamAI. All rights reserved.</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;

export default async function sendEmail(to, subject, code) {
  // Validate inputs
  if (!to || !code) {
    throw new Error("Email address and verification code are required");
  }

  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(
      "Email configuration missing: EMAIL_USER or EMAIL_PASS not set"
    );
    throw new Error("Email configuration missing");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // List of recipients
    subject: subject || "Tatvam_AI Email Verification", // Subject line
    html: nodemailerTemplate(code), // Send as HTML body
    text: `Your TatvamAI verification code is: ${code}`, // Plain text fallback
  };

  try {
    console.log(`Attempting to send email to: ${to}`);
    const result = await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Detailed error sending email:", {
      error: error.message,
      code: error.code,
      command: error.command,
      to: to,
      subject: subject,
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
