import express from "express";
import { registerUser, loginUser, logoutUser, verifyOtp, getProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validation.js";
import { registerSchema, loginSchema, verifyOtpSchema } from "../validation/auth.validation.js";
const router = express.Router();

//register
router.post("/register", validate(registerSchema), registerUser);

//verify otp
router.post("/register/verify", validate(verifyOtpSchema), verifyOtp);

//login
router.post('/login', validate(loginSchema), loginUser);

//logout
router.post('/logout', logoutUser);

//get profile
router.get('/profile', authMiddleware, getProfile);

export default router;
