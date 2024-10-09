import mongoose from "mongoose";

const refundSchema = mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,

      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    
 },
 {
   timestamps: true,
 } );

export const Refund = mongoose.model("Refund", refundSchema);
