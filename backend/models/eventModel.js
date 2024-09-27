import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true,
        },
        vanue: {
            type: String,
            required: true,
        },
        // date: {
        //   type: Date,
        //   required: true,
        // },
        date: {
            type: String,
            set: (date) => new Date(date).toString(), // Converts the date to desired string format
        },
        time: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

//export const Book = mongoose.model("Cat", bookSchema);
export const EventProgram = mongoose.model("eventAdding", eventSchema);
