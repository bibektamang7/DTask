import { ApiError } from "../utils/ApiError";
import { createChatSchema, sendMessageSchema } from "../helpers/validation";
import { ChatModel } from "../models/chats/chat.model";
import { ChatMessageModel } from "../models/chats/message.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose, { startSession } from "mongoose";
import { AttachmentModel } from "../models/attachment.model";
import { uploadOnCloudinary } from "../helpers/fileUpload.cloudinary";

import { createClient } from "redis";

const isMemberInWorkspace = async (memberId: string) => {
	const db = mongoose.connection.db; // Get the database connection
	const collection = db?.collection("workspacemembers"); // Get the collection

	const member = await collection?.findOne({
		_id: new mongoose.Types.ObjectId(memberId),
	});
	if (!member?.isJoined) return false;
	return !!member;
};

// const chatClient = createClient({ url: "redis://localhost:6379" });
// chatClient.connect().then(() => console.log("Chat client connected"));

const createChat = asyncHandler(async (req, res) => {
	if (req.workspaceMember.role === "Member") {
		throw new ApiError(401, "Unauthorized to edit");
	}
	const parsedData = createChatSchema.safeParse(req.body);
	const { workspaceId } = req.params;

	if (!parsedData.success) {
		throw new ApiError(400, "Validation Error");
	}

	await Promise.all(
		parsedData.data.members.map(async (memberId) => {
			const isValid = await isMemberInWorkspace(memberId);
			if (!isValid) {
				throw new ApiError(400, `Invalid workspace members`);
			}
		})
	);

	const chat = await ChatModel.create({
		creator: req.workspaceMember._id,
		workspaceId: workspaceId,
		members: parsedData.data.members,
	});
	if (!chat) {
		throw new ApiError(500, "Internal server error");
	}
	console.log("yeta paxi aako ho");
	console.log(chat._id);

	const createdChat = await ChatModel.aggregate([
		{
			$match: {
				_id: chat._id,
			},
		},
		{
			$lookup: {
				from: "WorkspaceMember",
				localField: "creator",
				foreignField: "_id",
				as: "creator",
				pipeline: [
					{
						$lookup: {
							from: "User",
							localField: "userId",
							foreignField: "_id",
							as: "userId",
							pipeline: [
								{
									$project: {
										avatar: 1,
										username: 1,
									},
								},
							],
						},
					},
				],
			},
		},
		{
			$lookup: {
				from: "WorkspaceMember",
				localField: "members",
				foreignField: "_id",
				as: "members",
				pipeline: [
					{
						$lookup: {
							from: "User",
							localField: "userId",
							foreignField: "_id",
							as: "userId",
							pipeline: [
								{
									$project: {
										avatar: 1,
										email: 1,
										username: 1,
									},
								},
							],
						},
					},
				],
			},
		},
	]);

	// chatClient.publish(
	// 	`chatCreated:${createdChat[0]._id}`,
	// 	JSON.stringify({
	// 		chatId: createdChat,
	// 	})
	// );

	res
		.status(200)
		.json(new ApiResponse(200, createdChat[0], "Chat created successfully"));
});

const deleteChat = asyncHandler(async (req, res) => {
	if (req.workspaceMember.role === "Member") {
		throw new ApiError(401, "Unauthorized to access");
	}
	const { chatId } = req.query;

	if (!chatId) {
		throw new ApiError(400, "Chat id required");
	}
	const createdChat = await ChatModel.findById(chatId);
	if (!createdChat) {
		throw new ApiError(400, "Chat not found");
	}

	const session = await startSession();
	session.startTransaction();

	try {
		const deletedAttachments = await AttachmentModel.deleteMany(
			{
				chatId: { $in: createdChat._id },
			},
			{ session }
		);
		if (!deletedAttachments.acknowledged) {
			throw new ApiError(500, "failed to delete attachments of chat");
		}
		const deletedMessages = await ChatMessageModel.deleteMany(
			{
				_id: { $in: createdChat.messages },
			},
			{ session }
		);
		if (!deletedMessages.acknowledged) {
			throw new ApiError(500, "Failed to delete messages of chat");
		}
		const deletedChat = await ChatModel.findByIdAndDelete(createdChat._id, {
			session: session,
		});
		if (!deletedChat) {
			throw new ApiError(500, "Unable to delete chat");
		}
		await session.commitTransaction();
		// chatClient.publish(
		// 	`deletedChat:${deletedChat._id}`,
		// 	JSON.stringify({
		// 		chatId: deletedChat._id,
		// 	})
		// );
		res.status(200).json(new ApiResponse(200, {}, "Chat deleted successfully"));
	} catch (error: any) {
		await session.abortTransaction();
		console.log(error.message);

		throw new ApiError(500, "Failed to delete chat");
	} finally {
		session.endSession();
	}
});

const getChat = asyncHandler(async (req, res) => {
	const { chatId } = req.params;
	if (!chatId) {
		throw new ApiError(400, "Chat Id is required");
	}
	const createdChat = await ChatModel.aggregate([
		{
			$match: {
				_id: chatId,
			},
		},
		{
			$lookup: {
				from: "WorkspaceMember",
				localField: "members",
				foreignField: "_id",
				as: "members",
				pipeline: [
					{
						$lookup: {
							from: "User",
							localField: "userId",
							foreignField: "_id",
							as: "userId",
							pipeline: [
								{
									$project: {
										username: 1,
										avatar: 1,
										email: 1,
									},
								},
							],
						},
					},
					{
						$project: {
							userId: 1,
							role: 1,
						},
					},
				],
			},
		},
		{
			$lookup: {
				from: "ChatMessage",
				localField: "Messages",
				foreignField: "_id",
				as: "messages",
				pipeline: [
					{
						$lookup: {
							from: "Attachment",
							localField: "attachments",
							foreignField: "_id",
							as: "attachments",
							pipeline: [
								{
									$project: {
										fileName: 1,
										fileType: 1,
										fileUrl: 1,
									},
								},
							],
						},
					},
				],
			},
		},
	]);

	if (createdChat.length < 1) {
		throw new ApiError(500, "Chat not found");
	}

	res
		.status(200)
		.json(new ApiResponse(200, createdChat[0], "Chat created successfully"));
});

const getChats = asyncHandler(async (req, res) => {
	const chats = await ChatModel.aggregate([
		{
			$match: {
				creator: req.workspaceMember._id,
			},
		},
		{
			$lookup: {
				from: "WorkspaceMember",
				localField: "creator",
				foreignField: "_id",
				as: "creator",
				pipeline: [
					{
						$lookup: {
							from: "User",
							localField: "userId",
							foreignField: "_id",
							as: "userId",
							pipeline: [
								{
									$project: {
										avatar: 1,
										username: 1,
									},
								},
							],
						},
						$project: {
							role: 1,
							userId: 1,
						},
					},
				],
			},
		},
	]);

	if (chats.length < 1) {
		throw new ApiError(400, "Failed to load chats");
	}

	res
		.status(200)
		.json(new ApiResponse(200, chats, "Chats fetched successfully"));
});

const updateChatName = asyncHandler(async (req, res) => {});

//TODO:THIS FEATURE WILL BE ADDED IN UPCOMING DAYS

// const updateChatSetting = asyncHandler(async (req, res) => {});

const sendMessage = asyncHandler(async (req, res) => {
	const { chatId, workspaceId } = req.params;
	console.log(chatId, "This is chat Id in send ");
	if (!chatId || !workspaceId) {
		throw new ApiError(400, "Id is required");
	}
	const parsedData = sendMessageSchema.safeParse(req.body);
	if (!parsedData.success) {
		throw new ApiError(400, "Validation Error");
	}

	//TODO:NOT SURE ABOUT THIS LOGIC
	const files = req.files as Express.Multer.File[];
	if ((!files || files.length === 0) && !parsedData.data.content) {
		throw new ApiError(400, "Either files or message required");
	}
	const chat = await ChatModel.findById(chatId);
	if (!chat) {
		throw new ApiError(400, "Chat not found");
	}
	if (
		req.workspaceMember.role !== "Admin" &&
		chat.creator.toString() !== req.workspaceMember._id.toString() &&
		!chat.members.includes(req.workspaceMember._id)
	) {
		throw new ApiError(400, "You are not in the chat");
	}
	const session = await startSession();
	session.startTransaction();
	try {
		let attachments: any = [];
		if (files && files.length > 0) {
			attachments = await Promise.all(
				files.map(async (file) => {
					const uploadResponse = await uploadOnCloudinary(
						file.path,
						`/chats/${chat._id}`
					);

					return await AttachmentModel.create(
						[
							{
								filename: uploadResponse?.filename,
								publicId: uploadResponse?.publicId,
								fileUrl: uploadResponse?.url,
								fileType: uploadResponse?.format,
								chatId: chat._id,
							},
						],
						{ session: session }
					);
				})
			);
		}
		console.log();

		const chatMessage = await ChatMessageModel.create(
			[
				{
					sender: req.workspaceMember._id,
					content: parsedData.data.content || "",
					attachments: attachments,
				},
			],
			{ session }
		);
		if (!chatMessage) {
			throw new ApiError(500, "Failed to create chat message");
		}

		const updatedChat = await ChatModel.findByIdAndUpdate(
			chat._id,
			{
				$push: {
					messages: chatMessage[0]._id,
				},
			},
			{ session }
		);
		if (!updatedChat) {
			throw new ApiError(500, "Failed to add message in the chat");
		}

		await session.commitTransaction();
		// chatClient.publish(
		// 	"sendMessage",
		// 	JSON.stringify({
		// 		chatId: updatedChat._id,
		// 		message: chatMessage,
		// 	})
		// );
		res
			.status(200)
			.json(new ApiResponse(200, chatMessage[0], "Message send successfully"));
	} catch (error: any) {
		console.log(error);

		await session.abortTransaction();
		throw new ApiError(500, "Internal server error");
	} finally {
		session.endSession();
	}
});

const deleteMessage = asyncHandler(async (req, res) => {
	const { chatId } = req.params;
	const { messageId } = req.query;
	if (!chatId || !messageId) {
		throw new ApiError(400, "Id is required");
	}
	const chat = await ChatModel.findById(chatId);

	if (!chat) {
		throw new ApiError(400, "Chat not found");
	}
	const isAdmin = req.workspaceMember.role === "Admin";
	const isChatCreator =
		chat.creator.toString() === req.workspaceMember._id.toString();
	if (
		!isAdmin &&
		!isChatCreator &&
		!chat.members.includes(req.workspaceMember._id)
	) {
		throw new ApiError(400, "You are not in the chat");
	}
	const createdChatMessage = await ChatMessageModel.findById(messageId);
	console.log(createdChatMessage?._id, "this is schat message");
	
	if (!createdChatMessage) {
		throw new ApiError(400, "Chat message not found");
	}

	if (
		req.workspaceMember._id.toString() !==
			createdChatMessage.sender.toString() &&
		!isAdmin
	) {
		throw new ApiError(401, "You are not authorized.");
	}
	const session = await startSession();
	session.startTransaction();

	try {
		const deletedAttachments = await AttachmentModel.deleteMany(
			{
				_id: { $in: createdChatMessage.attachments },
			},
			{ session: session }
		);
		if (!deletedAttachments.acknowledged) {
			throw new ApiError(500, "Failed to delete chat's messsages");
		}

		const deletedMessage = await ChatMessageModel.findByIdAndDelete(
			createdChatMessage._id,
			{ session }
		);

		if (!deletedMessage) {
			throw new ApiError(500, "Failed to delete chat");
		}

		await session.commitTransaction();
		// chatClient.publish(
		// 	"deleteMessage",
		// 	JSON.stringify({
		// 		chatId: chat._id,
		// 		messageId: deletedMessage._id,
		// 	})
		// );
		res.status(200).json(new ApiResponse(200, {}, "Chat deleted successfully"));
	} catch (error: any) {
		console.log(error, "This is error in deleteing chat message");
		await session.abortTransaction();
		throw new ApiError(500, "Internal server error");
	} finally {
		session.endSession();
	}
});

const addMemberInChat = asyncHandler(async (req, res) => {
	if (req.workspaceMember.role === "Member") {
		throw new ApiError(401, "Unauthorized to add member");
	}
	const { memberId, chatId } = req.params;
	if (!memberId || !chatId) {
		throw new ApiError(400, "Id required");
	}

	if (!isMemberInWorkspace(memberId)) {
		throw new ApiError(400, "Member not found in the workspace");
	}
	const chat = await ChatModel.findById(chatId);
	if (!chat) {
		throw new ApiError(400, "Chat not found");
	}
	const updatedChat = await ChatModel.findByIdAndUpdate(chat._id, {
		$push: {
			members: memberId,
		},
	});

	if (!updatedChat) {
		throw new ApiError(500, "Failed to add member in the chat");
	}
	// chatClient.publish(
	// 	"AddMember",
	// 	JSON.stringify({
	// 		chatId: updatedChat._id,
	// 		memberId: memberId,
	// 	})
	// );
	res.status(200).json(new ApiResponse(200, {}, "Member added in the chat"));
});

const removeMemberFromChat = asyncHandler(async (req, res) => {
	const { chatId, memberId } = req.params;

	if (!chatId || !memberId) {
		throw new ApiError(400, "Id is required");
	}

	const chat = await ChatModel.findById(chatId);
	if (!chat) {
		throw new ApiError(400, "Chat not found");
	}

	const updatedChat = await ChatModel.findByIdAndUpdate(chat._id, {
		$pull: {
			members: memberId,
		},
	});
	if (!updatedChat) {
		throw new ApiError(500, "Failed to remove member");
	}
	// chatClient.publish(
	// 	"removeMember",
	// 	JSON.stringify({
	// 		chatId: chat._id,
	// 		memberId: memberId,
	// 	})
	// );
	res.status(200).json(new ApiResponse(200, {}, "Member removed"));
});

export {
	updateChatName,
	// updateChatSetting,
	addMemberInChat,
	removeMemberFromChat,
	createChat,
	deleteChat,
	sendMessage,
	deleteMessage,
	getChat,
	getChats,
};
