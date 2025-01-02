import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purpose: {
      type: String,
      enum: ["MENTION", "TASK_ASSIGEND", "INVITE"],
    },
    reference: {
      type: Schema.Types.ObjectId,
      refPath: "referenceModel",
      required: true,
    },
    referenceModel: {
      type: String,
      required: true,
      enum: ["Task", "User", "Comment"],
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    scheduledFor: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true }
);

export const NotificationSchema = mongoose.model(
  "Notification",
  notificationSchema
);
