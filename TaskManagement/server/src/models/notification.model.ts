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
			enum: [
				"MENTION",
				"TASK_ASSIGEND",
				"INVITE",
				"JOINED",
				"REJECTED",
				"STATUS",
				"PRIORITY",
				"DUE_DATE",
				"COMMENT",
				"TASK_EDITOR",
				"TAGS",
			],
		},
		reference: {
			type: Schema.Types.ObjectId,
			refPath: "referenceModel",
			required: true,
		},
		referenceModel: {
			type: String,
			required: true,
			enum: ["Task", "Workspace", "Comment"],
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

export const NotificationModel= mongoose.model(
	"Notification",
	notificationSchema
);
