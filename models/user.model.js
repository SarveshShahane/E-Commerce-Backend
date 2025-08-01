import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["buyer", "seller", "admin"],
    default: "user",
  },
  verificationCode: {
    type: String,
    required: true,
  },
  verificationStatus: {
    type: Boolean,
    default: false,
  },
  verificationCodeExpiration: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
