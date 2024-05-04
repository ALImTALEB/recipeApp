import mongoose from "mongoose";

// Define the schema
const likeSchema = new mongoose.Schema({
    recipeId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    like: {
        type: Number,
        required: true,
        enum: [-1, 1]
    }
}, {
    timestamps: true
});

// Create the model
const Like = mongoose.model('Like', likeSchema);

// Export the model
module.exports = Like;
