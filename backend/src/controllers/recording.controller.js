import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Recording } from "../models/recording.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { RewardToken } from "../models/rewardToken.model.js";

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

  console.log("S3 Upload Result:", s3Result);
  console.log("S3 URL will be:", s3Result.Location);

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

function calculateRandomizedReward(overall_score) {
  let score = 0;
  let final_quality = "";
  const rand = Math.random(); // Generates a random number between 0 and 1

  if (overall_score >= 90) {
    final_quality = "excellent";
    if (rand < 0.6) {
      // 60% probability
      score = 15;
    } else if (rand < 0.9) {
      // 30% probability
      score = 20;
    } else {
      // 10% probability
      score = 25;
    }
  } else if (overall_score >= 70) {
    final_quality = "good";
    if (rand < 0.7) {
      // 70% probability
      score = 8;
    } else if (rand < 0.95) {
      // 25% probability
      score = 10;
    } else {
      // 5% probability
      score = 12;
    }
  } else if (overall_score >= 50) {
    final_quality = "average";
    if (rand < 0.5) {
      // 50% probability
      score = 4;
    } else if (rand < 0.9) {
      // 40% probability
      score = 5;
    } else {
      // 10% probability
      score = 6;
    }
  } else if (overall_score >= 30) {
    final_quality = "below_average";
    if (rand < 0.8) {
      // 80% probability
      score = 1;
    } else {
      // 20% probability
      score = 2;
    }
  } else {
    final_quality = "poor";
    score = 0; // No reward for poor quality
  }

  return { score, final_quality };
}

// api request to send the recording to the python model for evaluation
const evaluateRecording = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recording = await Recording.findById(id);
  if (!recording) {
    throw new ApiError(404, "Recording not found");
  }

  // Extract the S3 key from the URL
  let s3Key;
  try {
    console.log("Recording URL:", recording.recordingUrl);

    // Check if URL is valid before parsing
    if (!recording.recordingUrl || typeof recording.recordingUrl !== "string") {
      throw new Error("Recording URL is missing or invalid");
    }

    // Handle different S3 URL formats
    let urlToParse = recording.recordingUrl;

    // If it's already just an S3 key (not a full URL), use it directly
    if (!recording.recordingUrl.startsWith("http")) {
      s3Key = recording.recordingUrl;
      console.log("Using direct S3 key:", s3Key);
    } else {
      // Parse as full URL
      const s3Url = new URL(urlToParse);
      s3Key = decodeURIComponent(s3Url.pathname.slice(1)); // Remove leading slash
      console.log("Extracted S3 key from URL:", s3Key);
    }

    // Alternative: If URL parsing fails, try to extract key from common S3 URL patterns
    if (!s3Key && recording.recordingUrl.includes(".amazonaws.com/")) {
      const parts = recording.recordingUrl.split(".amazonaws.com/");
      if (parts.length > 1) {
        s3Key = parts[1];
        console.log("Extracted S3 key using string split:", s3Key);
      }
    }

    // Validate that we have a proper S3 key
    if (!s3Key || s3Key.length === 0) {
      throw new Error("Could not extract S3 key from URL");
    }
  } catch (err) {
    console.error("S3 URL Error:", err);
    console.error("Recording URL that failed:", recording.recordingUrl);
    throw new ApiError(400, `Invalid recording URL: ${err.message}`);
  }
  console.log("SR key:", s3Key);

  // Send s3Key to Python API
  let response;
  try {
    response = await axios.post(
      `${process.env.PYTHON_SERVER_URL}/analyze`,
      {
        s3Key,
        domain: 50,
        language: 50,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 120000, // 2 mins
      }
    );
  } catch (err) {
    console.error("ERRROR:", err);
    throw new ApiError(
      500,
      "Failed to evaluate audio: " + (err.response?.data?.error || err.message)
    );
  }

  const { overall_score } = response.data;

  if (!overall_score) {
    throw new ApiError(500, "Invalid response from audio analysis server");
  }

  const { score, final_quality } = calculateRandomizedReward(overall_score);

  console.log(
    "Quality to be saved:",
    final_quality,
    "Type:",
    typeof final_quality
  );

  // Update the recording with better error handling
  try {
    recording.quality = final_quality;
    await recording.save();
    console.log("Recording quality saved successfully");
  } catch (saveError) {
    console.error("Error saving recording quality:", saveError);
    throw new ApiError(
      500,
      `Failed to save recording quality: ${saveError.message}`
    );
  }
  console.log("Overall Score: ", overall_score);

  // Issue reward token
  const rewardToken = await RewardToken.create({
    userId: recording.userId,
    recordingId: recording._id,
    final_quality,
    amount: score,
    reason: "evaluated_contribution",
    method: "token",
    status: "approved",
  });

  const user = await User.findById(recording.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.rewardTokens = (user.rewardTokens || 0) + score;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, rewardToken, "Recording evaluated and rewarded")
    );
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

  const prompt = `Write a 250-word paragraph in fluent ${language} on the topic of ${domain}. Use conversational tone and include 1-2 local or code-mixed (${language}-English) words.`;

  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        key: process.env.GEMINI_API_KEY,
      },
    }
  );

  const generatedText =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText) {
    throw new ApiError(500, "Failed to generate paragraph");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, generatedText, "Paragraph generated successfully")
    );
});

export {
  uploadRecording,
  evaluateRecording,
  getAllRecordings,
  getRecordingById,
  deleteRecordingById,
  getPendingRecordingsForEvaluation,
  generateParagraph,
};
