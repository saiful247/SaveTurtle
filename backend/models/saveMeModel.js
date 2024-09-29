import mongoose from "mongoose";

const saveMeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    photo: {
        type: Buffer,
        required: true,
    },
    emergency: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

//export const SaveMe = mongoose.model("Cat", saveMeSchema);
export const SaveMe = mongoose.model("Save", saveMeSchema);
