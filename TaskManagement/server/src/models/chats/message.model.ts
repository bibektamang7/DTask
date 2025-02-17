import mongoose, { Schema } from "mongoose";
import { TimeSeriesBucketTimestamp } from "redis";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "WorkspaceMember",
        required: true,
    },
    content: {
        type: String,
        required: true,
        sparse: true,
    },
    attachments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Attachment",
        }
    ],

}, { timestamps: true }); 

export const ChatMessageModel = mongoose.model("ChatMessage", messageSchema);