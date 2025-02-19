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
exports.deleteComment = exports.createComment = exports.deleteAttachmentFromTask = exports.addAttachmentInTask = exports.deleteTask = exports.updateTask = exports.getTask = exports.getTasks = exports.createTask = void 0;
const attachment_model_1 = require("../models/attachment.model");
const task_model_1 = require("../models/tasks/task.model");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const validation_1 = require("../helpers/validation");
const mongoose_1 = __importStar(require("mongoose"));
const comment_model_1 = require("../models/tasks/comment.model");
const fileUpload_cloudinary_1 = require("../helpers/fileUpload.cloudinary");
// const taskClient = createClient({ url: "redis://localhost:6379" });
// taskClient.connect().then(() => console.log("Task client connected"));
const isMemberInWorkspace = (memberId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = mongoose_1.default.connection.db; // Get the database connection
    const collection = db === null || db === void 0 ? void 0 : db.collection("workspacemembers"); // Get the collection
    const member = yield (collection === null || collection === void 0 ? void 0 : collection.findOne({
        _id: new mongoose_1.default.Types.ObjectId(memberId),
    }));
    if (!(member === null || member === void 0 ? void 0 : member.isJoined)) {
        //TODO:HANDLE THIS LOGIC PROPERLY
        return false;
    }
    return !!member;
});
const createTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = validation_1.createTaskSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error.message);
        throw new ApiError_1.ApiError(400, "Validation error");
    }
    console.log(req.workspaceMember.workspace);
    const workspaceMembers = yield Promise.all(parsedData.data.assignees.map((userId) => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield isMemberInWorkspace(userId);
        if (!isValid) {
            throw new ApiError_1.ApiError(400, `User ${userId} is not a valid workspace member`);
        }
        return userId;
    })));
    const task = yield task_model_1.TaskModel.create({
        workspaceId: parsedData.data.workspaceId,
        title: parsedData.data.title,
        status: parsedData.data.status,
        description: parsedData.data.description,
        priority: parsedData.data.priority,
        dueDate: parsedData.data.dueDate,
        assignees: workspaceMembers,
        createdBy: req.workspaceMember._id,
    });
    if (!task) {
        throw new ApiError_1.ApiError(500, "Internal server error");
    }
    const createdTask = yield task_model_1.TaskModel.aggregate([
        {
            $match: {
                _id: task._id,
            },
        },
        {
            $lookup: {
                from: "WorkspaceMember",
                localField: "assignees",
                foreignField: "_id",
                as: "assignees",
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
    // taskClient.publish(
    // 	"taskCreated",
    // 	JSON.stringify({
    // 		task: createdTask[0],
    // 		assignees: parsedData.data.assignees,
    // 	})
    // );
    // TODO:Emit socket emit for task creation
    //Also consider where you need to return created task or not
    res.status(200).json(new ApiResponse_1.ApiResponse(200, task, "Task created successfully"));
}));
exports.createTask = createTask;
const getTasks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.getTasks = getTasks;
const getTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    if (!taskId) {
        throw new ApiError_1.ApiError(400, "Task id required");
    }
    //TODO:NEED TO AGGREGATE THIS ACCOR
    const task = yield task_model_1.TaskModel.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(taskId),
            },
        },
        {
            $lookup: {
                from: "User",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
                pipeline: [
                    {
                        $project: {
                            avatar: 1,
                            username: 1,
                            email: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "Attachment",
                localField: "attachments",
                foreignField: "_id",
                as: "attachments",
                pipeline: [
                    {
                        $project: {
                            filename: 1,
                            fileUrl: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "User",
                localField: "assignees",
                foreignField: "_id",
                as: "assignees",
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
            $lookup: {
                from: "Comment",
                localField: "comments",
                foreignField: "_id",
                as: "comments",
                pipeline: [
                    {
                        $lookup: {
                            from: "Attachment",
                            localField: "attachments",
                            foreignField: "_id",
                            as: "attachemnts",
                            pipeline: [
                                {
                                    $project: {
                                        filename: 1,
                                        fileUrl: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            message: 1,
                            createdBy: 1,
                            likes: 1,
                            attachments: 1,
                        },
                    },
                ],
            },
        },
    ]);
    console.log("This is task here");
    console.log(task);
    if (!task || task.length < 1) {
        throw new ApiError_1.ApiError(400, "Task not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, task[0]));
}));
exports.getTask = getTask;
const updateTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.updateTask = updateTask;
const deleteTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.query;
    if (!taskId) {
        throw new ApiError_1.ApiError(400, "Task id required");
    }
    // TODO: POPULATE THIS LOGIC TO EXTRACT USERID FROM THE ASSIGNEES
    const task = yield task_model_1.TaskModel.findById(taskId).populate({
        path: "assignees",
        populate: {
            path: "userId",
            select: "username avatar",
        },
    });
    if (!task) {
        throw new ApiError_1.ApiError(400, "Task not found");
    }
    if (task.workspaceId.toString() !== req.workspaceMember.workspace.toString() ||
        (req.member._id.toString() !== task.createdBy.toString() &&
            req.workspaceMember.role !== "Admin")) {
        throw new ApiError_1.ApiError(401, "Unauthorized to delete task");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const deletedTask = yield task_model_1.TaskModel.findByIdAndDelete(task._id, {
            session: session,
        });
        if (!deletedTask) {
            throw new ApiError_1.ApiError(500, "Failed to delete task");
        }
        const deleteAttachments = yield attachment_model_1.AttachmentModel.deleteMany({
            _id: { $in: deletedTask.attachments },
        }, { session: session });
        if (!deleteAttachments.acknowledged) {
            throw new ApiError_1.ApiError(500, "Failed to delete attachments");
        }
        const deleteComments = yield comment_model_1.CommentModel.deleteMany({
            _id: { $in: deletedTask.comments },
        }, { session: session });
        if (!deleteComments.acknowledged) {
            throw new ApiError_1.ApiError(500, "Failed to delete comments");
        }
        yield session.commitTransaction();
        // taskClient.publish(
        // 	"taskDeleted",
        // 	JSON.stringify({
        // 		taskId: task._id,
        // 		assignees: task.assignees,
        // 	})
        // );
    }
    catch (error) {
        yield session.abortTransaction();
        throw new ApiError_1.ApiError(500, "Internal server error");
    }
    finally {
        session.endSession();
    }
    // TODO:Emit event for task deletion
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Deleted successfully"));
}));
exports.deleteTask = deleteTask;
const addAttachmentInTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    if (!taskId) {
        throw new ApiError_1.ApiError(400, "Task id required");
    }
    const files = req.files;
    if (!files || files.length < 1) {
        throw new ApiError_1.ApiError(400, "Attachment is required");
    }
    // TODO: EXTRACT USERID FROM ASSIGNEES
    const task = yield task_model_1.TaskModel.findById(taskId).populate({
        path: "assignees",
        populate: {
            path: "userId",
            select: "username avatar",
        },
    });
    if (!task) {
        throw new ApiError_1.ApiError(400, "Task not found");
    }
    if (task.workspaceId !== req.workspaceMember.workspace) {
        throw new ApiError_1.ApiError(400, "Task not found in workspace");
    }
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        let attachments;
        if (files && files.length > 0) {
            attachments = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const fileUploadResponse = yield (0, fileUpload_cloudinary_1.uploadOnCloudinary)(file.path, `/tasks/${task._id}`);
                return yield attachment_model_1.AttachmentModel.create([
                    {
                        filename: fileUploadResponse === null || fileUploadResponse === void 0 ? void 0 : fileUploadResponse.filename,
                        fileType: fileUploadResponse === null || fileUploadResponse === void 0 ? void 0 : fileUploadResponse.filename,
                        publicId: fileUploadResponse === null || fileUploadResponse === void 0 ? void 0 : fileUploadResponse.publicId,
                        fileUrl: fileUploadResponse === null || fileUploadResponse === void 0 ? void 0 : fileUploadResponse.url,
                        taskId: task._id,
                    },
                ], { session });
            })));
        }
        const updatedTask = yield task_model_1.TaskModel.findByIdAndUpdate(task._id, {
            $push: {
                attachments: attachments,
            },
        }, {
            session: session,
        });
        if (!updatedTask) {
            throw new ApiError_1.ApiError(500, "Failed to update attachemnts");
        }
        // TODO: CONSIDER SENDING TASK WITH FULL DETAILS
        // SO THAT ACTIVE USER WILL BE UPDATED AT REAL TIME
        // taskClient.publish(
        // 	"AttachmentAdded",
        // 	JSON.stringify({
        // 		taskId: updatedTask._id,
        // 		attachment: updatedTask.attachments,
        // 		assinees: task.assignees,
        // 	})
        // );
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        throw new ApiError_1.ApiError(500, "Failed to add attachments");
    }
    finally {
        session.endSession();
    }
    // TODO:not sure about file or files
}));
exports.addAttachmentInTask = addAttachmentInTask;
const deleteAttachmentFromTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // apply zod validation
    const { attachmentId } = req.body;
    const { taskId } = req.params;
    if (!taskId) {
        throw new ApiError_1.ApiError(400, "Task id required");
    }
    //TODO: EXTRACT USERID FROM ASSIGNEES
    const task = yield task_model_1.TaskModel.findById(taskId).populate({
        path: "assignees",
        populate: {
            path: "userId",
            select: "username avatar",
        },
    });
    if (!task) {
        throw new ApiError_1.ApiError(400, "Task not found");
    }
    if (task.workspaceId !== req.workspaceMember.workspace) {
        throw new ApiError_1.ApiError(400, "Task not found in workspace");
    }
    if (!task.attachments.includes(new mongoose_1.default.Types.ObjectId(attachmentId))) {
        throw new ApiError_1.ApiError(400, "Attachment not found in task");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const attachment = yield attachment_model_1.AttachmentModel.findByIdAndDelete(attachmentId, {
            session,
        });
        if (!attachment) {
            throw new ApiError_1.ApiError(400, "Attachment not found");
        }
        const updatedTask = yield task_model_1.TaskModel.findByIdAndUpdate(task._id, {
            $pull: {
                attachments: attachment._id,
            },
        }, { session: session });
        if (!updatedTask) {
            throw new ApiError_1.ApiError(500, "Failed to delete attachment");
        }
        yield session.commitTransaction();
        // taskClient.publish(
        // 	"AttachmentDeleted",
        // 	JSON.stringify({
        // 		taskId: updatedTask._id,
        // 		attachmentId: attachment._id,
        // 		assignees: task.assignees,
        // 	})
        // );
    }
    catch (error) {
        yield session.commitTransaction();
        throw new ApiError_1.ApiError(500, "Internal server error");
    }
    finally {
        session.endSession();
    }
    //TODO:Emit attachment deletion event
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Attachment deleted"));
}));
exports.deleteAttachmentFromTask = deleteAttachmentFromTask;
// comments handlers
const createComment = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = validation_1.createCommentSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Validation Error");
    }
    if (!parsedData.data.message && !req.file) {
        throw new ApiError_1.ApiError(400, "Either message or file is required");
    }
    // TODO:EXTRACT USERID FROM ASSIGNEES
    const task = yield task_model_1.TaskModel.findById(parsedData.data.taskId).populate({
        path: "assignees",
        populate: {
            path: "userId",
            select: "username avatar",
        },
    });
    if (!task) {
        throw new ApiError_1.ApiError(400, "Task not found");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let attachment = null;
        if (req.file) {
            const fileUploadResponse = yield (0, fileUpload_cloudinary_1.uploadOnCloudinary)(req.file.path, `/tasks/${task._id}`);
            attachment = yield attachment_model_1.AttachmentModel.create([
                {
                    filename: fileUploadResponse === null || fileUploadResponse === void 0 ? void 0 : fileUploadResponse.filename,
                    fileType: fileUploadResponse === null || fileUploadResponse === void 0 ? void 0 : fileUploadResponse.format,
                    fileUrl: fileUploadResponse === null || fileUploadResponse === void 0 ? void 0 : fileUploadResponse.url,
                    taskId: task._id,
                },
            ], { session: session });
            if (!attachment) {
                throw new ApiError_1.ApiError(500, "Failed to create attachment");
            }
        }
        const comment = yield comment_model_1.CommentModel.create(
        //TODO:SEE WHAT CAN YOU DO HERE
        // @ts-ignore
        [Object.assign(Object.assign({}, parsedData.data), { attachments: (attachment === null || attachment === void 0 ? void 0 : attachment._id) || undefined })], {
            session: session,
        });
        if (!comment) {
            throw new ApiError_1.ApiError(500, "Failed to create comment");
        }
        const updatedTask = yield task_model_1.TaskModel.findByIdAndUpdate(task._id, {
            $push: {
                comments: comment[0]._id,
            },
        }, { session: session, new: true });
        if (!updatedTask) {
            throw new ApiError_1.ApiError(500, "Failed to add comment");
        }
        yield session.commitTransaction();
        //TODO:emit socket event
        console.log("THis is comment created");
        console.log(updatedTask);
        // TODO: CONSIDER ADDING FULL DETAILS OF COMMENT SO THAT USER WILL BE UPDATED AT REAL TIEM
        // taskClient.publish(
        // 	"madeComment",
        // 	JSON.stringify({
        // 		taskId: updatedTask._id,
        // 		comment: comment,
        // 		assignees: task.assignees
        // 	})
        // );
        res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, comment[0], "Comment created successfully"));
    }
    catch (error) {
        yield session.abortTransaction();
        throw new ApiError_1.ApiError(500, error.message || "something went wrong while saving comment");
    }
    finally {
        session.endSession();
    }
}));
exports.createComment = createComment;
const deleteComment = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.query;
    console.log(commentId);
    if (!commentId) {
        throw new ApiError_1.ApiError(400, "Comment id required");
    }
    const parsedData = validation_1.deleteCommentSchema.safeParse({
        workspaceId: req.params.workspaceId,
        taskId: req.params.taskId,
    });
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Validation Error");
    }
    //TODO: SAME GOES HERE
    const task = yield task_model_1.TaskModel.findById(parsedData.data.taskId);
    if (!task) {
        throw new ApiError_1.ApiError(400, "Task not found");
    }
    const comment = yield comment_model_1.CommentModel.findById(commentId);
    if (!comment) {
        throw new ApiError_1.ApiError(400, "Comment not found");
    }
    //TODO:create logic for admin be able to delete
    if (comment.createdBy.toString() !== req.member._id.toString()) {
        throw new ApiError_1.ApiError(401, "Unauthorized to delete comment");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (comment.attachments) {
            const deleteAttachment = yield attachment_model_1.AttachmentModel.findByIdAndDelete(comment.attachments, { session: session });
            if (!deleteAttachment) {
                throw new ApiError_1.ApiError(500, "Failed to delete attachment");
            }
        }
        const deletedComment = yield comment_model_1.CommentModel.findByIdAndDelete(comment._id, {
            session: session,
        });
        if (!deletedComment) {
            throw new ApiError_1.ApiError(500, "Failed to delete comment");
        }
        yield session.commitTransaction();
        // taskClient.publish(
        // 	"DeletedComment",
        // 	JSON.stringify({
        // 		taskId: task._id,
        // 		commentId: deletedComment._id,
        // 	})
        // );
        res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, {}, "Comment Deleted successfully"));
    }
    catch (error) {
        yield session.abortTransaction();
        throw new ApiError_1.ApiError(500, error.message || "something went wrong while deleting comment");
    }
    finally {
        session.endSession();
    }
}));
exports.deleteComment = deleteComment;
