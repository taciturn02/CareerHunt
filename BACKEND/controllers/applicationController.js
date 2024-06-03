import { Types } from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

async function uploadFileToCloudinary(file,folder){
    const options = {folder};
    options.resource_type = "auto";
   
    console.log("temppath",file.tempFilePath);
   return await cloudinary.uploader.upload(file.tempFilePath,options);
}

export const postApplication = catchAsyncErrors(async (req, res, next) => {

  const { role } = req.user;

  if (role === "Recruiter") {
    return next(
      new ErrorHandler("Protected Route for Applicant.", 400)
    );
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;

  const allowedFormats = ["png", "jpeg","jpg"];
  const type  = resume.name.split('.')[1].toLowerCase();

  if (!allowedFormats.includes(type)) {
    return next(
      new ErrorHandler("Invalid file type.Upload jpg,jpeg or png image", 400)
    );
  }


  const response = await uploadFileToCloudinary(resume,"");

  console.log(response);
  if (!response) {
    console.error( "Cloudinary Error:");
    return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
  }
  

  const { name, email, phone, address, jobId } = req.body;

  const applicantID = {
    user: req.user._id,
    role: "Applicant",
  };
  
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  const jobDetails = await Job.findOne({jobId});

  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  console.log(jobDetails);
  // console.log(jobDetails.title);
  // console.log(jobDetails.postedBy.populate('postedBy'));

  const employerID = {
    user: jobDetails.postedBy,
    role: "Recruiter",
  };

  if (
    !name ||
    !email ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  const application = await Application.create({
    name,
    email,
    phone,
    address,
    applicantID,
    employerID,
    jobId,
    resume: {
      public_id: response.public_id,
      url: response.secure_url,
    },
  });

  

  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
  
});


export const employerGetAllApplications = catchAsyncErrors( async (req, res, next) => {
    const { role } = req.user;
    if (role === "Applicant") {
      return next(
        new ErrorHandler("Protected Route for Recruiter.", 400)
      );
    }

    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });

    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const applicantGetAllApplications = catchAsyncErrors( async (req, res, next) => {
    const { role } = req.user;
    if (role === "Recruiter") {
      return next(
        new ErrorHandler("Protected Route for Applicant.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);


export const applicantDeleteApplication = catchAsyncErrors(async (req, res, next) => {

    const { role } = req.user;

    if (role === "Recruiter") {
      return next(
        new ErrorHandler("Protected Route for Applicant.", 400)
      );
    }

    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });

  }
);