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
    getUserIncentives
} from '../controllers/user.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = Router();

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/logout').post(verifyJWT, logoutUser)

router.route('/refresh-token').post(refreshAccessToken)

router.route('/current').get(verifyJWT, getCurrentUser)

router.route('/recordings').get(verifyJWT, getUserRecordings)

router.route('/change-password').post(verifyJWT, changeCurrentPassword)

router.route('/update-account').put(verifyJWT, updateAccountDetails)

router.route('/contribution-stats').get(verifyJWT, getUserContributionStats)

router.route('/incentives').get(verifyJWT, getUserIncentives)

export default router;