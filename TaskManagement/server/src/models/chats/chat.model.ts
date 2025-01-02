import mongoose, { Schema } from "mongoose"

const chatSchema = new Schema({
    workspaceId: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messages: {
        type: Schema.Types.ObjectId,
        ref: "Message",
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
}, { timestamps: true });

export const ChatSchema = mongoose.model("Chat", chatSchema);