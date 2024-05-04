import express from "express"
import { createRecipe, createRecipeReview, deleteRecipe, deleteReview, getRecipeDetails, getRecipeReviews, getRecipes, updateRecipe } from "../controllers/recipeController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const recipeRoute = express.Router()

recipeRoute.post("/add", isAuthenticated ,createRecipe)
recipeRoute.get("/", getRecipes)
recipeRoute.get("/:id", getRecipeDetails)
recipeRoute.put("/update/:id", isAuthenticated, updateRecipe)
recipeRoute.delete("/:id", isAuthenticated, deleteRecipe)

recipeRoute.post("/reviews", isAuthenticated, createRecipeReview)
recipeRoute.get("/reviews/:id", getRecipeReviews)
recipeRoute.delete("/reviews/:id", isAuthenticated ,deleteReview)

export default recipeRoute