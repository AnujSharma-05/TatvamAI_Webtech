import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Recording } from "../models/recording.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";

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



export { registerUser, loginUser, logoutUser, getUserRecordings };
