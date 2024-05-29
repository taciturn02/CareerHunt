import express from "express";
import {employerGetAllApplications,applicantGetAllApplications,applicantDeleteApplication,postApplication,} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, postApplication);
router.get("/recruiter/getall", isAuthenticated, employerGetAllApplications);
router.get("/applicant/getall", isAuthenticated, applicantGetAllApplications);
router.delete("/delete/:id", isAuthenticated, applicantDeleteApplication);

export default router;