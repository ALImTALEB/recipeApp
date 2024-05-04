import express from "express"
import { isAuthenticated } from "../middlewares/auth.js"
import { deleteUser, getUserDetails, updatePassword, updateUser } from "../controllers/userController.js"

const userRoute = express.Router()

userRoute.delete("/delete/:id", isAuthenticated, deleteUser)
userRoute.get("/:id", getUserDetails)
userRoute.put("/password/update", isAuthenticated ,updatePassword)
userRoute.put("/me/update", isAuthenticated ,updateUser)

export default userRoute