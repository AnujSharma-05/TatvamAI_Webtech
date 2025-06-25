import mongoose from 'mongoose';

const recordingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recordingUrl: {
        type: String, // cloud storage URL
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    dialect: {
        type: String,
    },
    domain: {
        type: String,
        enum: ['healthcare', 'education', 'fmcg', 'telecom', 'retail', 'technology'],
    },
    duration: {
        type: Number, // from cloud storage url metadata
        required: true,
    },
    recordedVia: {
        type: String,
        enum: ['device', 'web'],
        required: true,
    },
    quality: { // will be set after the model processes the recording
        type: String,
        enum: ['bad', 'average', 'good', 'excellent'],
    },
    transcription: {
        type: String, // will store the transcription text after processing
    },
}, {timestamps: true});


export const Recording = mongoose.model('Recording', recordingSchema);