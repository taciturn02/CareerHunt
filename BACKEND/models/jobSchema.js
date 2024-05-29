import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, " Enter the title."],
  },
  description: {
    type: String,
    required: [true, "Enter decription."],
  },
  category: {
    type: String,
    required: [true, "Enter category."],
  },
  jobId:{
    type:Number,
    required : true
  },
  country: {
    type: String,
    required: [true, "Enter  country name."],
  },
  city: {
    type: String,
    required: [true, "Enter city name."],
  },
  location: {
    type: String,
    required: [true, "Enter location."],
    
  },
  fixedSalary: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
  },
  salaryFrom: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [10, "Salary cannot exceed 9 digits"],
  },
  salaryTo: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [10, "Salary cannot exceed 9 digits"],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);