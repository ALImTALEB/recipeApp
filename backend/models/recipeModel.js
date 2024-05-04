import mongoose from "mongoose";

// Define the schema
const recipeSchema = new mongoose.Schema(
  {
    recipeName: {
      type: String,
      required: [true, "please enter a recipe name"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    cat: {
      type: String,
      required: [true, "please enter a category"],
      enum: {
        values: ["spicy", "tunisian", "fastfood"],
        message: "please select correct category",
      },
    },
    coverImg: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    ingredients: {
      type: [String],
      required: [true, "please put ur ing"],
    },
    cookingInstructions: {
      type: [String],
      required: true,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the model
const Recipe = mongoose.model("Recipe", recipeSchema);

// Export the model
export default Recipe;
