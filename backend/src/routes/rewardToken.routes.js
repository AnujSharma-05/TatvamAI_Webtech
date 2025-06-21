import { Router }  from 'express';
import {
    getAllUserRewards,
    getAllTokensAdmin,
    getTokenStats
} from '../controllers/rewardToken.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/')
    .get(verifyJWT, getAllUserRewards); // Get all user rewards

router.route('/admin')
    .get(verifyJWT, getAllTokensAdmin); // Get all tokens for admin

router.route('/stats')
    .get(verifyJWT, getTokenStats); // Get token stats

export default router;