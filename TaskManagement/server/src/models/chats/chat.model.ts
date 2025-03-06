import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		workspace: {
			type: Schema.Types.ObjectId,
			ref: "Workspace",
			required: true,
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: "WorkspaceMember",
			required: true,
		},
		lastMessage: {
			type: Schema.Types.ObjectId,
			ref: "ChatMessage",
		},
		messages: [
			{
				type: Schema.Types.ObjectId,
				ref: "ChatMessage",
				required: true,
			},
		],
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: "WorkspaceMember",
			},
		],
		unreadCounts: {
			type: Map,
			of: Number,
			default: {},
		},
	},
	{ timestamps: true }
);

export const ChatModel = mongoose.model("Chat", chatSchema);
