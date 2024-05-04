import User from "../models/userModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const userr = await User.findById(req.params.id);

  if (req.user.id !== userr._id.toString()) {
    return next(new ErrorHandler("u can delete only ur account", 403));
  }

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
})

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "account deleted",
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.params?.id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  res.status(200).json({
    user,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("+password")

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

  if ( !isPasswordMatched ) {
    return next( new ErrorHandler("old password is incorrect", 400) )
  }

  user.password = req.body.password
  user.save()

  res.status(200).json({
    success: true,
    message: "password changed successfully"
  });
});

export const updateUser = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
    username: req.body.username,
    email: req.body.email,
    img: req.body.img
  }

  const user = await User.findByIdAndUpdate(req?.user?._id, newUserData ,{
    new: true
  })

  res.status(200).json({
    user,
    message: "profile updated successfully"
  });
});