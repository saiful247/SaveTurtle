import mongoose from "mongoose";

const eventParticipantSchema = mongoose.Schema(
  {
    participantName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      set: (date) => new Date(date).toString(), // Converts the date to desired string format
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    paymentImageUrl: {
      type: String, // Store the local path of the image
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const EventParticipant = mongoose.model(
  "EventParticipant",
  eventParticipantSchema
);
