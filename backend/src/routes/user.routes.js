import { Router }  from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserRecordings, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails,
    getUserContributionStats,
    getUserIncentives,
    sendPhoneOtpLogin,
    sendPhoneOtpRegister,
    verifyPhoneOtp,
    loginWithPhoneOtp,
    sendEmailVerificationCode,
    verifyEmailCode,
    deleteUserAccount,
    checkUserExistence
} from '../controllers/user.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = Router();

// Auth
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)

// User
router.route('/current').get(verifyJWT, getCurrentUser)
router.route('/recordings').get(verifyJWT, getUserRecordings)
router.route('/change-password').post(verifyJWT, changeCurrentPassword)
router.route('/update-account').put(verifyJWT, updateAccountDetails)
router.route('/contribution-stats').get(verifyJWT, getUserContributionStats)
router.route('/incentives').get(verifyJWT, getUserIncentives)
router.route('/delete-account').delete(verifyJWT, deleteUserAccount); 

// Email/Phone OTP verification routes
// router.route('/verify-email/:token').get(verifyEmail); // e.g., /verify-email/abc123

router.route('/send-phone-otp-register').post(sendPhoneOtpRegister);
router.route('/verify-phone-otp').post(verifyPhoneOtp);


router.route('/send-phone-otp-login').post(sendPhoneOtpLogin);
router.route('/login-phone-otp').post(loginWithPhoneOtp);


router.route('/send-verification-code').post(sendEmailVerificationCode); 
router.route('/verify-email-code').post(verifyEmailCode);


router.route('/check-user-existence').post(checkUserExistence); // Check if user exists by email or phone


export default router;