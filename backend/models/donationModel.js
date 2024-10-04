import mongoose from "mongoose";

const donationSchema = mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contactNo: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dateOfPayment: {
      type: Date,
      required: true,
    },
    paymentImageUrl: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//export const Donation = mongoose.model("Cat", donationSchema);
export const Donation = mongoose.model("donation", donationSchema);
