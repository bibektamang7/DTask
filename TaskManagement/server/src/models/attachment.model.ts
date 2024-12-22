import mongoose, { Schema } from "mongoose";

const attachmentSchema = new Schema({
    filename: {
        type: String,
        required: true,
    },
    fileType: String,
    fileUrl: {
        type: String, 
        required: true,
    },
    taskId: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    }
});

export const AttachmentModel = mongoose.model("Attachment", attachmentSchema);