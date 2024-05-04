import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncErrors from "./catchAsyncErrors.js"
import jwt from "jsonwebtoken";

//checks if user authenticated or not
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies

    if(!token) {
        return next(new ErrorHandler("login first to access this resource", 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.user = await User.findById(decoded.id)

    next()
})