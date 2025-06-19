import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Recording } from "../models/recording.model.js";
import { RewardToken } from "../models/rewardToken.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { RewardToken } from "../models/rewardToken.model.js";

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
    throw new ApiError(400, "Phone number must be a 10 digit number");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    // Check if user exists by email or username (returns false if not found)
    $or: [{ email }, { name }], // or operator to check both fields
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists with this email or username");
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
      : [], // split the languages by comma and trim spaces
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

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // if(!username && !email){
    //     throw new ApiError(400, "Username or email is required")
    // }

    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // here 'user' is the instance we have fetched from the db in the above line this is not the mongoose schema 'User'
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid or wrong password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        // secured cookie: by this cookie could be accessed by the backend server only, not the frontend
        httpOnly: true,
        secure: true,
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
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

  const options = {
    // by this cookie could be accessed by the backend server only, not the frontend
    httpOnly: true,
    secure: true,
  };

  const loggedInUser = await User.findById(user._id).select("username -_id");

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, { loggedInUser }, "User logged out"));
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
    .json(new ApiResponse(201, recordings, "User recordings fetched successfully"));
});

const refreshAccessToken = asyncHandler(async(req, res) => {
    
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    // for safety purposes (try-catch) because maybe while decoding token it may throw some error (not neccessary)
    try { 
        const decodedToken = jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        // generate new tokens
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
        
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Access Token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    
    const {oldPassword, newPassword, confirmPassword} = req.body

    if(newPassword !== confirmPassword) {
        throw new ApiError(401, "New and Confirm password should be same")
    }

    const user = await User.findById(req.user?._id)

    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isOldPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false}) // save the new password in the db

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "current user fetched successfully")
    )
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {name, email, knownLanguages, city} = req.body

    if (!name || !email) {
        throw new ApiError(400, "Name and email are required")
    }

    const languagesToAdd = knownLanguages ? knownLanguages.split(",").map(lang => lang.trim()) : [];

    const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $addToSet: {
        knownLanguages: { $each: languagesToAdd }
        },
        $set: {
        name: name,
        email: email,
        city: city
        }
    },
    { new: true }
    ).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const getUserIncentives = asyncHandler(async (req, res) => {
  const tokens = await RewardToken.find({ userId: req.user?._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tokens, "Incentive history fetched"));
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
    getUserIncentives 
};
