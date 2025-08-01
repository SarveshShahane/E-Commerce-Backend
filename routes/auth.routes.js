import express from "express";
import { registerUser,loginUser , logoutUser, verifyOtp} from "../controllers/auth.controller.js";
const router = express.Router();

//register
router.post("/register", registerUser);

//verify otp
router.post("/register/verify", verifyOtp);

//login
router.post('/login',loginUser)



//logout
router.get('/logout', logoutUser);
export default router;
