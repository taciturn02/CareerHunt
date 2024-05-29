import mongoose from 'mongoose'

import dotenv from "dotenv";
dotenv.config();

export const dbConnect = ()=>{
    mongoose.connect(process.env.MONGODB_URL,{
      
    })
    .then(()=>{console.log("DB connection is successfull")})
    .catch((error)=>{
        console.log(error);
        console.log("DB Connection Failed");
    })
}

