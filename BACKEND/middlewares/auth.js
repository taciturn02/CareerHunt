import { User } from "../models/user.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  // console.log("hello");
  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  }
  // console.log(token);
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  console.log(decoded);
  console.log("hello");
  req.user = await User.findById(decoded.id);
  next();
});

