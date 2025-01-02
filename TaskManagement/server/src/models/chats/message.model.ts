import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: String,
    attachments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Attachment",
        }
    ],

}, { timestamps: true }); 

export const MessageSchema = mongoose.model("Message", messageSchema);