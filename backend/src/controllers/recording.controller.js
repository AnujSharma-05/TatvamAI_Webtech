import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Recording } from "../models/recording.model.js";
import mongoose, { isValidObjectId } from "mongoose";
// import { RewardToken } from "../models/rewardToken.model.js";

import axios from "axios";
import uploadFileToS3 from "../utils/aws_s3.js";

const uploadRecording = asyncHandler(async (req, res) => {
  const { language, dialect, domain, recordedVia, duration } = req.body;

  if (!req.file) {
    throw new ApiError(400, "Audio file is required");
  }

  // Generate a unique S3 key
  const s3Key = `audio/${Date.now()}-${req.file.originalname}`;

  // Upload to S3 (assuming your uploadFileToS3 expects (file, key))
  const s3Result = await uploadFileToS3(req.file, s3Key);

  const newRecording = await Recording.create({
    userId: req.user._id,
    recordingUrl: s3Result.Location, // S3 URL
    language,
    dialect,
    domain,
    recordedVia,
    duration,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newRecording, "Recording uploaded successfully")
    );
});

// api request to send the recording to the python model for evaluation
const evaluateRecording = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recording = await Recording.findById(id);
  if (!recording) {
    throw new ApiError(404, "Recording not found");
  }

  // Send to Python model via HTTP API
  const response = await axios.post(
    process.env.PYTHON_SERVER_URL + "/evaluate",
    { audioUrl: recording.url }
  );

  const { quality, duration, score } = response.data;

  recording.quality = quality;
  recording.duration = duration;
  await recording.save();

  // Reward user
  await Token.create({
    userId: recording.userId,
    recordingId: recording._id,
    amount: score,
    reason: "evaluated_contribution",
    method: "token",
    status: "approved",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, recording, "Recording evaluated and rewarded"));
});

// for admin only
const getAllRecordings = asyncHandler(async (req, res) => {
  const recordings = await Recording.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, recordings, "All recordings fetched"));
});

// for admin only
const getRecordingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid recording ID");
  }

  const recording = await Recording.findById(id).populate(
    "userId",
    "name email phoneNo"
  );

  if (!recording) {
    throw new ApiError(404, "Recording not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, recording, "Recording fetched successfully"));
});

// for admin only
const deleteRecordingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recording = await Recording.findByIdAndDelete(id);

  if (!recording) {
    throw new ApiError(404, "Recording not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, recording, "Recording deleted successfully"));
});

// for admin only
const getPendingRecordingsForEvaluation = asyncHandler(async (req, res) => {
  const recordings = await Recording.find({
    quality: { $exists: false },
  }).sort({ createdAt: 1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, recordings, "Pending recordings for evaluation")
    );
});

const generateParagraph = asyncHandler(async (req, res) => {
  const { language, domain } = req.body;

  if (!language || !domain) {
    throw new ApiError(400, "Language and domain are required");
  }

  const prompt = `Write a 100-word paragraph in fluent ${language} on the topic of ${domain}. Use conversational tone and include 1-2 local or code-mixed (${language}-English) words.`

  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        key: process.env.GEMINI_API_KEY,
      },
    }
  );
  
  const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText) {
    throw new ApiError(500, "Failed to generate paragraph");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, generatedText, "Paragraph generated successfully"));
});

export {
  uploadRecording,
  evaluateRecording,
  getAllRecordings,
  getRecordingById,
  deleteRecordingById,
  getPendingRecordingsForEvaluation,
  generateParagraph
};
