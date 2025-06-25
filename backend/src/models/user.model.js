import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // this will not return the password field when fetching user data
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // default role is user
    },
    gender: {
      type: String,
      enum: Male | Female | Other,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    motherTongue: {
      type: String,
      required: true,
    },
    knownLanguages: [
      {
        type: String,
      },
    ],
    refreshToken: {
      type: String,
      select: false, // this will not return the refreshToken field when fetching user data
    },
    recordings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recording", // reference to the Recording model
      },
    ],
    rewardTokens: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RewardToken", // reference to the RewardToken model
      },
    ],
    emailVerified: {
      type: Boolean,
      default: false, // email verification status
    },
    emailVerificationToken: {
      type: String,
      select: false, // this will not return the emailVerificationToken field when fetching user data
    },
    phoneNoVerified: {
      type: Boolean,
      default: false, // phone number verification status
    },
    phoneOtp: {
      type: String,
    },
    phoneOtpExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // if password is not changed, skip hashing
  
  // if (this.password.length < 6) {
  //     return next(new Error("Password must be at least 6 characters long"));
  // }

  this.password = await bcrypt.hash(this.password, 10); // hashing
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) { // custom method to check password
    return await bcrypt.compare(password, this.password); // returns true or false (this.password is that which is in db)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign( // create a JWT token
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
