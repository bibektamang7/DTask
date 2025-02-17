import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
	{
		workspaceId: {
			type: String,
			required: true,
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: "WorkspaceMember",
			required: true,
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
	},
	{ timestamps: true }
);

export const ChatModel = mongoose.model("Chat", chatSchema);
