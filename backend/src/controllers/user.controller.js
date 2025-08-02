import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Recording } from "../models/recording.model.js";
import { RewardToken } from "../models/rewardToken.model.js";
import { Verification } from "../models/verification.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail, {
  generateEmailVerificationCode,
} from "../utils/sendEmail.js";
import sendSms from "../utils/sendOtpSms.js";
import { log } from "console";
import axios from "axios";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // find user in the db by ID
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // save the refresh token into the db
    user.refreshToken = refreshToken;

    // save into the db (save() is the method of mongoose)
    await user.save({ validateBeforeSave: false });
    // validateBeforeSave: false means it will not validate the user schema before saving, as we are only updating the refresh token (not the password or other fields that require validation)
    // this is useful when you want to update a field that does not require validation, like refresh token

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating the tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    gender,
    dob,
    phoneNo,
    city,
    motherTongue,
    knownLanguages,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !dob ||
    !gender ||
    !phoneNo ||
    !city ||
    !motherTongue
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!email.includes("@") || !email.includes(".")) {
    throw new ApiError(400, "Invalid email format");
  }

  if (phoneNo.length !== 10 || isNaN(phoneNo)) {
    throw new ApiError(400, "Phone number must be a 10-digit number");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ email }, { name }, { phoneNo }],
  });

  if (existedUser) {
    throw new ApiError(
      400,
      "User already exists with this email, username, or phone number"
    );
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
    gender,
    dob,
    phoneNo,
    city,
    motherTongue,
    knownLanguages: knownLanguages
      ? knownLanguages.split(",").map((lang) => lang.trim())
      : [],
    emailVerified: true, // Assume email is verified
    phoneNoVerified: true, // Assume phone is verified
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// otp for verification
const sendPhoneOtpRegister = asyncHandler(async (req, res) => {
  const { phoneNo } = req.body;

  // Check if phone is already registered
  const existingUser = await User.findOne({ phoneNo });
  if (existingUser) throw new ApiError(400, "Phone number already registered");

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store OTP in verification collection for later verification
  await Verification.findOneAndUpdate(
    { type: "phone", value: phoneNo },
    { code: otp, expires },
    { upsert: true, new: true }
  );

  // Send OTP using Renflair SMS
  const apiKey = process.env.RENFLAIR_API_KEY;

  if (!apiKey) {
    throw new ApiError(500, "Renflair API key not configured");
  }

  console.log("Sending OTP via Renflair:", { phoneNo, otp });

  try {
    // Renflair API uses GET request with query parameters
    const otpUrl = `https://sms.renflair.in/V1.php?API=${apiKey}&PHONE=${phoneNo}&OTP=${otp}`;

    const response = await axios.get(otpUrl);

    console.log("Renflair Response:", response.data);

    // Check if Renflair returned success (adjust based on their response format)
    if (response.data && response.status === 200) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            message: "OTP sent successfully",
          },
          "OTP sent successfully"
        )
      );
    } else {
      throw new ApiError(500, "Failed to send OTP via Renflair");
    }
  } catch (err) {
    console.error("Renflair OTP Error Details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });

    if (err.response?.status === 400) {
      const errorMsg =
        err.response?.data?.message || "Invalid request parameters";
      throw new ApiError(400, `Renflair Error: ${errorMsg}`);
    }

    throw new ApiError(500, "OTP service failed");
  }
});

// verify during phone OTP verification (register)
const verifyPhoneOtp = asyncHandler(async (req, res) => {
  const { phoneNo, otp } = req.body;

  if (!phoneNo || !otp) {
    throw new ApiError(400, "Phone number and OTP are required");
  }

  // Verify OTP from database
  const record = await Verification.findOne({ type: "phone", value: phoneNo });

  if (!record || record.code !== otp || record.expires < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Delete the verification record after successful verification
  await Verification.deleteOne({ _id: record._id });

  // OTP verified successfully
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Phone number verified successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ emailVerificationToken: req.params.token });

  if (!user) {
    throw new ApiError(404, "Invalid or expired email verification token");
  }

  user.emailVerified = true; // set emailVerified to true
  // user.emailVerificationToken = undefined; // remove the emailVerificationToken

  await user.save({ validateBeforeSave: false }); // save the user without validation

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const sendEmailVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, "Email already registered");

  const code = generateEmailVerificationCode();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  await Verification.findOneAndUpdate(
    { type: "email", value: email },
    { code, expires },
    { upsert: true, new: true }
  );

  await sendEmail(
    email,
    "Tatvam_AI Email Verification Code",
    `Your Tatvam_AI email verification code is: ${code}`
  );

  res
    .status(200)
    .json(new ApiResponse(200, { code }, "Verification code sent to email"));
});

// email login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [
      { email: email }, // check by email
    ],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // here 'user' is the instance we have fetched from the db in the above line this is not the mongoose schema 'User'
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid or wrong password");
  }

  if (!user.emailVerified || !user.phoneNoVerified) {
    throw new ApiError(
      403,
      "Please verify your email and phone number before logging in"
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // No cookie options needed for localStorage auth

  return res.status(200).json(
    new ApiResponse(
      201,
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged in successfully"
    )
  );
});

const sendPhoneOtpLogin = asyncHandler(async (req, res) => {
  const { phoneNo } = req.body;

  // Check if phone is already registered
  const existingUser = await User.findOne({ phoneNo });
  if (!existingUser)
    throw new ApiError(400, "User does not exist with this phone number");

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store OTP in verification collection for later verification
  await Verification.findOneAndUpdate(
    { type: "phone", value: phoneNo },
    { code: otp, expires },
    { upsert: true, new: true }
  );

  // Send OTP using Renflair SMS
  const apiKey = process.env.RENFLAIR_API_KEY;

  // Debug: Check if API key exists
  if (!apiKey) {
    throw new ApiError(500, "Renflair API key not configured");
  }

  console.log("Sending OTP via Renflair:", { phoneNo, otp });
  console.log("API Key (first 10 chars):", apiKey.substring(0, 10) + "...");

  try {
    // Renflair API uses GET request with query parameters
    const otpUrl = `https://sms.renflair.in/V1.php?API=${apiKey}&PHONE=${phoneNo}&OTP=${otp}`;

    const response = await axios.get(otpUrl);

    console.log("Renflair Response:", response.data);

    // Check if Renflair returned success (adjust based on their response format)
    if (response.data && response.status === 200) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            message: "OTP sent successfully",
          },
          "OTP sent successfully"
        )
      );
    } else {
      throw new ApiError(500, "Failed to send OTP via Renflair");
    }
  } catch (err) {
    console.error("Renflair OTP Error Details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });

    if (err.response?.status === 400) {
      const errorMsg =
        err.response?.data?.message || "Invalid request parameters";
      throw new ApiError(400, `Renflair Error: ${errorMsg}`);
    } else if (err.response?.status === 401) {
      throw new ApiError(401, "Invalid Renflair API key");
    } else if (err.response?.status === 403) {
      throw new ApiError(403, "Renflair API access forbidden");
    }

    throw new ApiError(500, "OTP service failed");
  }
});

// for verifying phone OTP and logging in
const loginWithPhoneOtp = asyncHandler(async (req, res) => {
  const { phoneNo, otp } = req.body;

  if (!phoneNo || !otp) {
    throw new ApiError(400, "Phone number and OTP are required");
  }

  // Check if the user exists
  const user = await User.findOne({ phoneNo });
  if (!user) {
    throw new ApiError(404, "User does not exist with this phone number");
  }

  // Verify OTP from database
  const record = await Verification.findOne({ type: "phone", value: phoneNo });

  if (!record || record.code !== otp || record.expires < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Delete the verification record after successful verification
  await Verification.deleteOne({ _id: record._id });

  // OTP verified successfully, generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged in with phone number successfully"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id, // this is what we have created object (.user) in the verifyJWT in auth middleware

    // what to update
    {
      $set: {
        refreshToken: undefined, // reset/delete the refreshToken after logging the out
      },
    },
    {
      new: true,
      // By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
    }
  );

  // No cookie options needed for localStorage auth

  const loggedInUser = await User.findById(user._id).select("username -_id");

  return res
    .status(200)
    .json(new ApiResponse(200, { loggedInUser }, "User logged out"));
});

// const logoutUser = asyncHandler(async (req, res) => {
//   try {
//     // Check if user is authenticated
//     if (!req.user || !req.user._id) {
//       return res.status(401).json(new ApiResponse(401, null, "User not authenticated"));
//     }

//     // Update user in database - remove refresh token
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         $unset: {
//           refreshToken: 1 // This removes the field from the document
//         }
//       },
//       {
//         new: true
//       }
//     );

//     if (!user) {
//       return res.status(404).json(new ApiResponse(404, null, "User not found"));
//     }

//     // Cookie options - make sure these match your login cookies
//     const options = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production', // Only secure in production
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Adjust based on environment
//       path: '/' // Make sure path matches the cookies you set during login
//     };

//     // Log successful logout
//     // console.log(`User ${user.username || user.email} logged out successfully`);

//     // Clear cookies and send response
//     return res
//       .status(200)
//       .clearCookie("accessToken", options)
//       .clearCookie("refreshToken", options)
//       .json(new ApiResponse(200, {}, "User logged out"));

//   } catch (error) {
//     console.error("Logout error:", error);
//     return res.status(500).json(new ApiResponse(500, null, "Internal server error during logout"));
//   }
// });

const deleteUserAccount = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // Delete user and associated recordings
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }
  // await Recording.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
  // await RewardToken.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
  // await Verification.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User account deleted successfully"));
});

const getUserRecordings = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const recordings = await Recording.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "rewardtokens",
        localField: "_id",
        foreignField: "recordingId",
        as: "tokens",
      },
    },
    {
      $addFields: {
        totalTokens: { $sum: "$tokens.amount" },
      },
    },
    {
      $project: {
        recordingUrl: 1,
        language: 1,
        dialect: 1,
        domain: 1,
        duration: 1,
        recordedVia: 1,
        createdAt: 1,
        totalTokens: 1,
        userName: "$user.name",
        userEmail: "$user.email",
      },
    },
    {
      $sort: { createdAt: -1 }, // Most recent recordings first
    },
  ]);

  res
    .status(201)
    .json(
      new ApiResponse(201, recordings, "User recordings fetched successfully")
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  // for safety purposes (try-catch) because maybe while decoding token it may throw some error (not neccessary)
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    // No cookie options needed for localStorage auth

    // generate new tokens
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken: newRefreshToken,
        },
        "Access Token refreshed"
      )
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    throw new ApiError(401, "New and Confirm password should be same");
  }

  const user = await User.findById(req.user?._id);

  const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false }); // save the new password in the db

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, email, knownLanguages, city } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required");
  }

  const languagesToAdd = knownLanguages
    ? knownLanguages.split(",").map((lang) => lang.trim())
    : [];

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $addToSet: {
        knownLanguages: { $each: languagesToAdd },
      },
      $set: {
        name: name,
        email: email,
        city: city,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

// to get user total tokens (TODO: to be done) return the final token amount from all the user documents
const getUserIncentives = asyncHandler(async (req, res) => {
  const tokens = await RewardToken.find({ userId: req.user?._id }).sort({
    createdAt: -1,
  });

  const totalTokens = tokens.reduce(
    (sum, token) => sum + (token.amount || 0),
    0
  );

  // const user = await User.findById(req.user?._id);

  // if (!user) {
  //   throw new ApiError(400, "User not found");
  // }

  // // Add to the existing rewardTokens value
  // user.rewardTokens = (user.rewardTokens || 0) + totalTokens;
  // await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tokens,
        totalTokens,
      },
      "Incentive history fetched"
    )
  );
});

const getUserContributionStats = asyncHandler(async (req, res) => {
  const stats = await Recording.aggregate([
    {
      $match: {
        userId: req.user._id,
      },
    },
    {
      $group: {
        _id: {
          domain: "$domain",
          recordedVia: "$recordedVia",
        },
        total: { $sum: 1 },
        avgQuality: {
          $avg: {
            $switch: {
              branches: [
                { case: { $eq: ["$quality", "bad"] }, then: 1 },
                { case: { $eq: ["$quality", "average"] }, then: 2 },
                { case: { $eq: ["$quality", "good"] }, then: 3 },
                { case: { $eq: ["$quality", "excellent"] }, then: 4 },
              ],
              default: 0,
            },
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRecordings: { $sum: "$total" },
        domainWise: {
          $push: {
            domain: "$_id.domain",
            source: "$_id.recordedVia",
            count: "$total",
            avgQuality: "$avgQuality",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalRecordings: 1,
        domainWise: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats[0] || { totalRecordings: 0, domainWise: [] },
        "User contribution stats fetched"
      )
    );
});

const verifyEmailCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const record = await Verification.findOne({ type: "email", value: email });

  if (!record || record.code !== code || record.expires < Date.now()) {
    throw new ApiError(400, "Invalid or expired verification code");
  }

  // await Verification.deleteOne({ _id: record._id });

  res.status(200).json(new ApiResponse(200, {}, "Email verified successfully"));
});

const checkUserExistence = asyncHandler(async (req, res) => {
  const { email, phoneNo } = req.body;

  if (!email && !phoneNo) {
    throw new ApiError(400, "Email or phone number is required");
  }

  const query = {};
  if (email) query.email = email;
  if (phoneNo) query.phoneNo = phoneNo;

  const user = await User.findOne(query).select("-password -refreshToken");

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  return res.status(200).json(new ApiResponse(200, user, "User exists"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserRecordings,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  getUserContributionStats,
  getUserIncentives,
  verifyEmail,
  verifyPhoneOtp,
  sendPhoneOtpLogin,
  sendPhoneOtpRegister,
  loginWithPhoneOtp,
  sendEmailVerificationCode,
  verifyEmailCode,
  deleteUserAccount,
  checkUserExistence,
};
