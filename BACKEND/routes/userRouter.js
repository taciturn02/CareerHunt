import express from 'express';
const router = express.Router();

import { login,logout,signup,getUser } from "../controllers/userController.js";
import { isAuthenticated } from '../middlewares/auth.js';

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout",isAuthenticated,logout);
router.get("/getuser",isAuthenticated, getUser);

export default router;