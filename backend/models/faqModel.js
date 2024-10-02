import mongoose from "mongoose";

const faqSchema = mongoose.Schema(
    {
        topic: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const faQuestions = mongoose.model("FAQ", faqSchema);
