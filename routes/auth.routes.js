import express from "express";
import { registerUser,loginUser , logoutUser} from "../controllers/auth.controller.js";
const router = express.Router();

//register
router.post("/register", registerUser);


//login
router.post('/login',loginUser)



//logout
router.get('/logout', logoutUser);
export default router;
