import mongoose from "mongoose";

const ticketSchema = mongoose.Schema(
    {
        topic: {
            type: String,
        },
        description: {
            type: String,
        },
        name: {
            type: String,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Ticket = mongoose.model("Tickets", ticketSchema);
