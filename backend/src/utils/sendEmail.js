import nodemailer from 'nodemailer';

// Generate a random 6-digit code
export function generateEmailVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

export default async function sendEmail(to, subject, code) {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to, // List of recipients
        subject: subject || "Tatvam_AI Email Verification", // Subject line
        text: `Your Tatvam_AI email verification code is: ${code}`, // Plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}