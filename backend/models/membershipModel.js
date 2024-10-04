import mongoose from "mongoose";

const membershipSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String, // e.g. "1 month", "1 year"
      required: true,
    },
    features: {
      type: String, // List of features included in the membership plan
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Membership = mongoose.model("Membership", membershipSchema);
