import express from "express";
import { registerUser,loginUser } from "../controllers/auth.controller";
const router = express.Router();

//register
router.post("/register", registerUser);


//login
router.post('/login',loginUser)

export default router;
