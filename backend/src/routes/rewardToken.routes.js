import { Router }  from 'express';
import {
    getAllUserRewards,
    getAllTokensAdmin,
    getTokenStats,
    getTokenByRecordingId
} from '../controllers/rewardToken.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/')
    .get(verifyJWT, getAllUserRewards); // Get all user rewards

router.route('/admin')
    .get(verifyJWT, getAllTokensAdmin); // Get all tokens for admin

router.route('/stats')
    .get(verifyJWT, getTokenStats); // Get token stats

router.route('/api/tokens/recording/:id')
    .get(verifyJWT, getTokenByRecordingId);

export default router;