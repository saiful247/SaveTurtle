import mongoose from "mongoose";

// Mongoose schema for SaveMe report
const saveMeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    photo: {
      type: String, // Will hold the filename or URL of the uploaded image
      required: false,
    },
    emergencyLevel: {
      type: String,
      enum: ["regular", "critical"], // Allows only these values
      default: "regular",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

export const SaveMe = mongoose.model("SaveMe", saveMeSchema);
