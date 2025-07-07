import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["phone", "email"], required: true },
    value: { type: String, required: true }, // phoneNo or email
    code: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Verification = mongoose.model("Verification", verificationSchema);
