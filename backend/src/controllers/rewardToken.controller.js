import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { RewardToken } from "../models/rewardToken.model.js";

const getAllUserRewards = asyncHandler(async (req, res) => {
  const { method, status } = req.query;

  const query = { userId: req.user._id };
  if (method) query.method = method;
  if (status) query.status = status;

  const rewards = await RewardToken.find(query).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, rewards, "User reward tokens fetched"));
});

const getAllTokensAdmin = asyncHandler(async (req, res) => {
  const tokens = await RewardToken.find()
    .populate("userId", "displayName email")
    .populate("recordingId", "domain language quality")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tokens, "All tokens fetched for admin"));
});

const getTokenStats = asyncHandler(async (req, res) => {
  const stats = await RewardToken.aggregate([
    {
      $lookup: {
        from: "recordings",
        localField: "recordingId",
        foreignField: "_id",
        as: "recordingData"
      }
    },
    { $unwind: "$recordingData" },
    {
      $group: {
        _id: {
          domain: "$recordingData.domain",
          quality: "$recordingData.quality",
          method: "$method"
        },
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "totalAmount": -1 }
    }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Token stats aggregated"));
});


export {
    getAllUserRewards,
    getAllTokensAdmin,
    getTokenStats
}