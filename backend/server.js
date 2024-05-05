import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import errorMiddleware from "./middlewares/errors.js";
import cookieParser from "cookie-parser";
import cors from "cors"

import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import recipeRoute from "./routes/recipeRoute.js";

// Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('**Shutting down due to uncaught exception');
    process.exit(1)
})


const app = express();
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // If your requests include credentials (e.g., cookies)
  }));
app.use(cookieParser())

dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
    mongoose.connect(process.env.MONGO).then(con => {
        console.log(`**MongoDB Database connected with HOST: ${con.connection.host}`)
    })
  };

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/recipes", recipeRoute)


app.use(errorMiddleware)
const server = app.listen(9000, () => {
  connect();
  console.log(`**backend server isRunning on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});


// Handle Unhandled Promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('**Shutting down the server due to Unhandled Promise rejection');
    server.close(() => {
        process.exit(1)
    })
})