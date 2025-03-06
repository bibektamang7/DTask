import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
        index: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "WorkspaceMember",
        required: true,
    },
    content: {
        type: String,
    },
    attachments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Attachment",
        }
    ],

}, { timestamps: true }); 

export const ChatMessageModel = mongoose.model("ChatMessage", messageSchema);