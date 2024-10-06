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
        status: { type: String, default: "unsolved" },
        replies: [
            {
                message: String,
                date: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Ticket = mongoose.model("Tickets", ticketSchema);
