import express from 'express';
import cors from "cors"; // USED FOR CONNECTING BACKEND TO FRONTEND
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import applicationRouter from './routes/applicationRouter.js';
import jobRouter from './routes/jobRouter.js';
import {dbConnect} from './database/dbConnection.js';
import {errorMiddleware} from './middlewares/error.js'
import {cloudinaryConnect} from "./cloudinary/cloudinary.js"

const app = express();
dotenv.config();

//DATABASE CONNECTION
dbConnect();
cloudinaryConnect();



app.use(
    cors({
        origin :"http://localhost:3000",
        methods : ["GET","POST","PUT","DELETE"],
        credentials : true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : "/tmp/",
    })
);

app.use('/api/v1/user',userRouter);
app.use('/api/v1/application',applicationRouter);
app.use('/api/v1/job',jobRouter);

app.use(errorMiddleware);

export default app;