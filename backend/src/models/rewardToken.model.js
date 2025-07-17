import mongoose from "mongoose";

const rewardTokenSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   recordingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recording',
      required: true,
   },
   final_quality: {
        type: String,
    },
   amount: {
      type: Number,
      required: true,
    },
    reason: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    method: {
        type: String,
        enum: ['bank_transfer', 'upi', 'token'],
        required: true,
    }
    
}, {timestamps: true});

export const RewardToken = mongoose.model('RewardToken', rewardTokenSchema);