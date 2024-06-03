import express from 'express';
const router = express.Router();

import { login,logout,signup,getUser,sendotp,forgotPassword } from "../controllers/userController.js";
import { isAuthenticated } from '../middlewares/auth.js';

router.post("/sendotp", sendotp)
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.get("/logout",isAuthenticated,logout);
router.get("/getuser",isAuthenticated, getUser);

export default router;