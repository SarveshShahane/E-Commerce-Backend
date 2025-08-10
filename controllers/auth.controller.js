import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import { generateToken } from "../middlewares/auth.js";
import { verificationCode, verificationMail } from "../utils/mails.utils.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = "buyer" } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }
  
  const code = verificationCode();
  const codeExpiration = new Date(Date.now() + 15 * 60 * 1000);
  
  try {
    await verificationMail(email, code);
  } catch (e) {
    res.status(500);
    throw new Error("Failed to send verification email");
  }
  
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    verificationCode: code,
    verificationCodeExpiration: codeExpiration,
    verificationStatus: false,
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User with such email address does not exists.");
  }

  if (user.verificationStatus) {
    res.status(400);
    throw new Error("User already verified");
  }

  if (user.verificationCodeExpiration <= Date.now()) {
    res.status(400);
    throw new Error("OTP has expired. Please request a new one.");
  }

  if (code != user.verificationCode) {
    res.status(400);
    throw new Error("Invalid OTP.");
  }

  user.verificationStatus = true;
  user.verificationCode = null;
  user.verificationCodeExpiration = null;
  await user.save();

  const token = generateToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Email verified successfully.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  if(!user.verificationStatus){
    res.status(401);
    throw new Error('Please verify your email before logging in')
  }

  const isPassMatch = await bcrypt.compare(password, user.password);
  if (!isPassMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export { registerUser, loginUser, logoutUser, getProfile, verifyOtp };
