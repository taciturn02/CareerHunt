import app from "./app.js"
import dotenv from "dotenv"
import cloudinary from "cloudinary"
dotenv.config();

cloudinary.v2.config({

        cloud_name : process.env.CLOUDINARY_CLIENT_NAME,
        api_key :process.env.CLOUDINARY_CLIENT_API ,
        api_secret : process.env.CLOUDINARY_CLIENT_SECRET,
});


const PORT = process.env.PORT;
console.log(PORT);
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT} successfuly`);
})