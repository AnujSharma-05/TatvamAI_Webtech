import axios from 'axios';

export default async function sendOtpSms(phone) {
    try {
        const response = await axios.get(
            `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${phone}/AUTOGEN`
        );

        const sessionId = response.data.Details;
        console.log('OTP sent successfully. Session ID:', sessionId);

        return sessionId; // Save this in DB temporarily (tied to user)
    } catch (error) {
        console.error('Error sending OTP:', error.response?.data || error.message);
        throw new Error('Failed to send OTP via 2Factor');
    }
}
