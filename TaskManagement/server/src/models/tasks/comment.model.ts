import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    message: {
      type: String,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "WorkspaceMember",
      required: true,
    },
    attachments: {
      type: Schema.Types.ObjectId,
      ref: "Attachment",
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model("Comment", commentSchema);
