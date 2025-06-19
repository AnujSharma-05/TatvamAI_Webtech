import mongoose from "mongoose";
import { Recording } from "./recordings.model";

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
        enum: ['bank_transfer', 'upi'],
        required: true,
    }
    
}, {timestamps: true});

export const RewardToken = mongoose.model('RewardToken', rewardTokenSchema);