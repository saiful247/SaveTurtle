import mongoose from "mongoose";

const returnsSchema = mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    refundAmount: {
      type: Number,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      
  },
  },
  {
    timestamps: true,
  }
);

// Corrected to use the returnsSchema instead of returnSchema
export const Return = mongoose.model("Return", returnsSchema);
