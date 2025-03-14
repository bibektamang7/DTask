import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		tags: [
			{
				type: String,
			},
		],
		description: {
			type: String,
		},
		status: {
			type: String,
			enum: ["Completed", "In-Progress", "Todo"],
			required: true,
		},
		priority: {
			type: String,
			enum: ["Low", "Medium", "High", "Urgent"],
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		dueDate: {
			type: Date,
			required: true,
		},
		workspaceId: {
			type: Schema.Types.ObjectId,
			ref: "Workspace",
			required: true,
		},
		assignees: [
			{
				type: Schema.Types.ObjectId,
				ref: "WorkspaceMember",
			},
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "WorkspaceMember",
			required: true,
		},
		attachments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Attachment",
			},
		],
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		taskEditorData: {
			type: String,
		},
		taskActivities: [
			{
				type: Schema.Types.ObjectId,
				ref: "Notification",
			},
		],
	},
	{ timestamps: true }
);

export const TaskModel = mongoose.model("Task", taskSchema);
