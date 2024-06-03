import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { OTP } from "../models/OTP.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import {sendToken} from "../utils/jwtToken.js"
import otpGenerator from "otp-generator"
import {sendmail} from "../utils/mailSender.js"
import bcrypt from "bcrypt";



export const sendotp = async (req, res) => {

	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		// if (checkUserPresent) {
		// 	// Return 401 Unauthorized status code with error message
		// 	return res.status(401).json({
		// 		success: false,
		// 		message: `User is Already Registered`,
		// 	});
		// }

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

		const result = await OTP.findOne({ otp: otp });

		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);

		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}

		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);

       const body = `Your OTP is <h1>${otp} </h1>
                      <br>
                       From CareerHunt`;
	   //console.log(body);
		try {
            const emailResponse = await sendmail(
                email,
				"Verification Email For OTP",
                body
            )
            // console.log("Email sent successfully:", emailResponse.response)
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            })
        }

		
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});



	} catch (error) {
		console.log("error while sending otp");
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};

export const forgotPassword =async(req,res) =>{

  try {
    // get email from req body
    const email = req.body.email;
    const password = req.body.password;
    const otp = req.body.otp;
    // check user for this email, email validation
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.json({
            success: false,
            message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
        });
    }
    
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    console.log(response);
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
			{ email: email },
			{ password: encryptedPassword },
			{ new: true }
		);


    res.json({
			success: true,
			message: `Password Reset Successful`,
		});

} catch (error) {
return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
}
}

export const signup = catchAsyncErrors(async(req,res,next)=>{

        const {name , email ,phone,role,password,otp} = req.body;
        if(!name || !email || !phone || !role || !password){
            return next(new ErrorHandler("Please Fill SignUp Form"));
        }

        const isemail = await User.findOne({email});

        if(isemail){
            return next(new ErrorHandler("Email Already Exists"));
        }

        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (response.length === 0) {
          // OTP not found for the email
          return res.status(400).json({
            success: false,
            message: "The OTP is not valid",
          });
        } else if (otp !== response[0].otp) {
          // Invalid OTP
          return res.status(400).json({
            success: false,
            message: "The OTP is not valid",
          });
        }

        const user = await User.create({
            name,
            email,
            phone,
            role,
            password,
        });
      
        sendToken(user, 201, res, "User Registered!");
})

export const login = catchAsyncErrors(async (req, res, next) => {

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return next(new ErrorHandler("Please provide email ,password and role."));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email Or Password.", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email Or Password.", 400));
    }
    if (user.role !== role) {
      return next(
        new ErrorHandler(`User with provided email and ${role} not found!`, 404)
      );
    }
    sendToken(user, 201, res, "User Logged In!");
  });


export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(201)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "User Logged Out Successfully.",
      });
  });
  
  
  export const getUser = catchAsyncErrors((req, res, next) => {
    const user = req.user;
    console.log(user+" User");
    res.status(200).json({
      success: true,
      user,
    });
  });