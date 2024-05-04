import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

// Define the schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your username"],
    unique: true
  },
  img: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Your password must be longer than 6 characters"],
    select: false
  }
}, {
    timestamps: true
});

// Encrypting password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  this.password = await bcrypt.hash(this.password, 10)
})

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

//Return jwt token
userSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this.id }, process.env.JWT_KEY, 
    {
      expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

// Create the model
const User = mongoose.model('User', userSchema);

// Export the model
export default User;
//dfgdfg