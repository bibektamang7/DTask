"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChats = exports.getChat = exports.deleteMessage = exports.sendMessage = exports.deleteChat = exports.createChat = exports.removeMemberFromChat = exports.addMemberInChat = exports.updateChatName = void 0;
const ApiError_1 = require("../utils/ApiError");
const validation_1 = require("../helpers/validation");
const chat_model_1 = require("../models/chats/chat.model");
const message_model_1 = require("../models/chats/message.model");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const mongoose_1 = __importStar(require("mongoose"));
const attachment_model_1 = require("../models/attachment.model");
const fileUpload_cloudinary_1 = require("../helpers/fileUpload.cloudinary");
const isMemberInWorkspace = (memberId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = mongoose_1.default.connection.db; // Get the database connection
    const collection = db === null || db === void 0 ? void 0 : db.collection("workspacemembers"); // Get the collection
    const member = yield (collection === null || collection === void 0 ? void 0 : collection.findOne({
        _id: new mongoose_1.default.Types.ObjectId(memberId),
    }));
    if (!(member === null || member === void 0 ? void 0 : member.isJoined))
        return false;
    return !!member;
});
// const chatClient = createClient({ url: "redis://localhost:6379" });
// chatClient.connect().then(() => console.log("Chat client connected"));
const createChat = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.workspaceMember.role === "Member") {
        throw new ApiError_1.ApiError(401, "Unauthorized to edit");
    }
    const parsedData = validation_1.createChatSchema.safeParse(req.body);
    const { workspaceId } = req.params;
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Validation Error");
    }
    yield Promise.all(parsedData.data.members.map((memberId) => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield isMemberInWorkspace(memberId);
        if (!isValid) {
            throw new ApiError_1.ApiError(400, `Invalid workspace members`);
        }
    })));
    const chat = yield chat_model_1.ChatModel.create({
        creator: req.workspaceMember._id,
        workspaceId: workspaceId,
        members: parsedData.data.members,
    });
    if (!chat) {
        throw new ApiError_1.ApiError(500, "Internal server error");
    }
    console.log("yeta paxi aako ho");
    console.log(chat._id);
    const createdChat = yield chat_model_1.ChatModel.aggregate([
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
        .json(new ApiResponse_1.ApiResponse(200, createdChat[0], "Chat created successfully"));
}));
exports.createChat = createChat;
const deleteChat = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.workspaceMember.role === "Member") {
        throw new ApiError_1.ApiError(401, "Unauthorized to access");
    }
    const { chatId } = req.query;
    if (!chatId) {
        throw new ApiError_1.ApiError(400, "Chat id required");
    }
    const createdChat = yield chat_model_1.ChatModel.findById(chatId);
    if (!createdChat) {
        throw new ApiError_1.ApiError(400, "Chat not found");
    }
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const deletedAttachments = yield attachment_model_1.AttachmentModel.deleteMany({
            chatId: { $in: createdChat._id },
        }, { session });
        if (!deletedAttachments.acknowledged) {
            throw new ApiError_1.ApiError(500, "failed to delete attachments of chat");
        }
        const deletedMessages = yield message_model_1.ChatMessageModel.deleteMany({
            _id: { $in: createdChat.messages },
        }, { session });
        if (!deletedMessages.acknowledged) {
            throw new ApiError_1.ApiError(500, "Failed to delete messages of chat");
        }
        const deletedChat = yield chat_model_1.ChatModel.findByIdAndDelete(createdChat._id, {
            session: session,
        });
        if (!deletedChat) {
            throw new ApiError_1.ApiError(500, "Unable to delete chat");
        }
        yield session.commitTransaction();
        // chatClient.publish(
        // 	`deletedChat:${deletedChat._id}`,
        // 	JSON.stringify({
        // 		chatId: deletedChat._id,
        // 	})
        // );
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Chat deleted successfully"));
    }
    catch (error) {
        yield session.abortTransaction();
        console.log(error.message);
        throw new ApiError_1.ApiError(500, "Failed to delete chat");
    }
    finally {
        session.endSession();
    }
}));
exports.deleteChat = deleteChat;
const getChat = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    if (!chatId) {
        throw new ApiError_1.ApiError(400, "Chat Id is required");
    }
    const createdChat = yield chat_model_1.ChatModel.aggregate([
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
        throw new ApiError_1.ApiError(500, "Chat not found");
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, createdChat[0], "Chat created successfully"));
}));
exports.getChat = getChat;
const getChats = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield chat_model_1.ChatModel.aggregate([
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
        throw new ApiError_1.ApiError(400, "Failed to load chats");
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, chats, "Chats fetched successfully"));
}));
exports.getChats = getChats;
const updateChatName = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.updateChatName = updateChatName;
//TODO:THIS FEATURE WILL BE ADDED IN UPCOMING DAYS
// const updateChatSetting = asyncHandler(async (req, res) => {});
const sendMessage = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, workspaceId } = req.params;
    console.log(chatId, "This is chat Id in send ");
    if (!chatId || !workspaceId) {
        throw new ApiError_1.ApiError(400, "Id is required");
    }
    const parsedData = validation_1.sendMessageSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Validation Error");
    }
    //TODO:NOT SURE ABOUT THIS LOGIC
    const files = req.files;
    if ((!files || files.length === 0) && !parsedData.data.content) {
        throw new ApiError_1.ApiError(400, "Either files or message required");
    }
    const chat = yield chat_model_1.ChatModel.findById(chatId);
    if (!chat) {
        throw new ApiError_1.ApiError(400, "Chat not found");
    }
    if (req.workspaceMember.role !== "Admin" &&
        chat.creator.toString() !== req.workspaceMember._id.toString() &&
        !chat.members.includes(req.workspaceMember._id)) {
        throw new ApiError_1.ApiError(400, "You are not in the chat");
    }
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        let attachments = [];
        if (files && files.length > 0) {
            attachments = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const uploadResponse = yield (0, fileUpload_cloudinary_1.uploadOnCloudinary)(file.path, `/chats/${chat._id}`);
                return yield attachment_model_1.AttachmentModel.create([
                    {
                        filename: uploadResponse === null || uploadResponse === void 0 ? void 0 : uploadResponse.filename,
                        publicId: uploadResponse === null || uploadResponse === void 0 ? void 0 : uploadResponse.publicId,
                        fileUrl: uploadResponse === null || uploadResponse === void 0 ? void 0 : uploadResponse.url,
                        fileType: uploadResponse === null || uploadResponse === void 0 ? void 0 : uploadResponse.format,
                        chatId: chat._id,
                    },
                ], { session: session });
            })));
        }
        console.log();
        const chatMessage = yield message_model_1.ChatMessageModel.create([
            {
                sender: req.workspaceMember._id,
                content: parsedData.data.content || "",
                attachments: attachments,
            },
        ], { session });
        if (!chatMessage) {
            throw new ApiError_1.ApiError(500, "Failed to create chat message");
        }
        const updatedChat = yield chat_model_1.ChatModel.findByIdAndUpdate(chat._id, {
            $push: {
                messages: chatMessage[0]._id,
            },
        }, { session });
        if (!updatedChat) {
            throw new ApiError_1.ApiError(500, "Failed to add message in the chat");
        }
        yield session.commitTransaction();
        // chatClient.publish(
        // 	"sendMessage",
        // 	JSON.stringify({
        // 		chatId: updatedChat._id,
        // 		message: chatMessage,
        // 	})
        // );
        res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, chatMessage[0], "Message send successfully"));
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        throw new ApiError_1.ApiError(500, "Internal server error");
    }
    finally {
        session.endSession();
    }
}));
exports.sendMessage = sendMessage;
const deleteMessage = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    const { messageId } = req.query;
    if (!chatId || !messageId) {
        throw new ApiError_1.ApiError(400, "Id is required");
    }
    const chat = yield chat_model_1.ChatModel.findById(chatId);
    if (!chat) {
        throw new ApiError_1.ApiError(400, "Chat not found");
    }
    const isAdmin = req.workspaceMember.role === "Admin";
    const isChatCreator = chat.creator.toString() === req.workspaceMember._id.toString();
    if (!isAdmin &&
        !isChatCreator &&
        !chat.members.includes(req.workspaceMember._id)) {
        throw new ApiError_1.ApiError(400, "You are not in the chat");
    }
    const createdChatMessage = yield message_model_1.ChatMessageModel.findById(messageId);
    console.log(createdChatMessage === null || createdChatMessage === void 0 ? void 0 : createdChatMessage._id, "this is schat message");
    if (!createdChatMessage) {
        throw new ApiError_1.ApiError(400, "Chat message not found");
    }
    if (req.workspaceMember._id.toString() !==
        createdChatMessage.sender.toString() &&
        !isAdmin) {
        throw new ApiError_1.ApiError(401, "You are not authorized.");
    }
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const deletedAttachments = yield attachment_model_1.AttachmentModel.deleteMany({
            _id: { $in: createdChatMessage.attachments },
        }, { session: session });
        if (!deletedAttachments.acknowledged) {
            throw new ApiError_1.ApiError(500, "Failed to delete chat's messsages");
        }
        const deletedMessage = yield message_model_1.ChatMessageModel.findByIdAndDelete(createdChatMessage._id, { session });
        if (!deletedMessage) {
            throw new ApiError_1.ApiError(500, "Failed to delete chat");
        }
        yield session.commitTransaction();
        // chatClient.publish(
        // 	"deleteMessage",
        // 	JSON.stringify({
        // 		chatId: chat._id,
        // 		messageId: deletedMessage._id,
        // 	})
        // );
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Chat deleted successfully"));
    }
    catch (error) {
        console.log(error, "This is error in deleteing chat message");
        yield session.abortTransaction();
        throw new ApiError_1.ApiError(500, "Internal server error");
    }
    finally {
        session.endSession();
    }
}));
exports.deleteMessage = deleteMessage;
const addMemberInChat = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.workspaceMember.role === "Member") {
        throw new ApiError_1.ApiError(401, "Unauthorized to add member");
    }
    const { memberId, chatId } = req.params;
    if (!memberId || !chatId) {
        throw new ApiError_1.ApiError(400, "Id required");
    }
    if (!isMemberInWorkspace(memberId)) {
        throw new ApiError_1.ApiError(400, "Member not found in the workspace");
    }
    const chat = yield chat_model_1.ChatModel.findById(chatId);
    if (!chat) {
        throw new ApiError_1.ApiError(400, "Chat not found");
    }
    const updatedChat = yield chat_model_1.ChatModel.findByIdAndUpdate(chat._id, {
        $push: {
            members: memberId,
        },
    });
    if (!updatedChat) {
        throw new ApiError_1.ApiError(500, "Failed to add member in the chat");
    }
    // chatClient.publish(
    // 	"AddMember",
    // 	JSON.stringify({
    // 		chatId: updatedChat._id,
    // 		memberId: memberId,
    // 	})
    // );
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Member added in the chat"));
}));
exports.addMemberInChat = addMemberInChat;
const removeMemberFromChat = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, memberId } = req.params;
    if (!chatId || !memberId) {
        throw new ApiError_1.ApiError(400, "Id is required");
    }
    const chat = yield chat_model_1.ChatModel.findById(chatId);
    if (!chat) {
        throw new ApiError_1.ApiError(400, "Chat not found");
    }
    const updatedChat = yield chat_model_1.ChatModel.findByIdAndUpdate(chat._id, {
        $pull: {
            members: memberId,
        },
    });
    if (!updatedChat) {
        throw new ApiError_1.ApiError(500, "Failed to remove member");
    }
    // chatClient.publish(
    // 	"removeMember",
    // 	JSON.stringify({
    // 		chatId: chat._id,
    // 		memberId: memberId,
    // 	})
    // );
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Member removed"));
}));
exports.removeMemberFromChat = removeMemberFromChat;
