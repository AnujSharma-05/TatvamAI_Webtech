import { Router }  from 'express';
import {
    uploadRecording,
    evaluateRecording,
    getAllRecordings,
    getRecordingById,
    deleteRecordingById,
    getPendingRecordingsForEvaluation,
    generateParagraph
} from '../controllers/recording.controller.js';
import { verifyJWT, authorizeRoles } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/')
    .post(verifyJWT, upload.single('audio'), uploadRecording) // Upload recording

router.route('/pending-evaluation')
    .get(verifyJWT, getPendingRecordingsForEvaluation); // Get recordings pending evaluation

router.route('/admin')
    .get(verifyJWT, authorizeRoles("admin"), getAllRecordings); // Get all recordings (admin only)

router.route('/admin/:id')
    .get(verifyJWT, authorizeRoles("admin"), getRecordingById) // Get recording by ID (admin only)
    .delete(verifyJWT, authorizeRoles("admin"), deleteRecordingById); // Delete recording by ID (admin only)

router.route('/admin/:id/evaluate')
    .post(verifyJWT, authorizeRoles("admin"), evaluateRecording); // Evaluate recording by ID (admin only)

router.route('/generate-paragraph')
    .post(verifyJWT, generateParagraph); // Generate paragraph based on language and domain

export default router;