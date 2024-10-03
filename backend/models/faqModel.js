import mongoose from "mongoose";

const faqSchema = mongoose.Schema(
    {
        question: {
            type: String,
        },
        answer: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const faQuestions = mongoose.model("FAQ", faqSchema);
