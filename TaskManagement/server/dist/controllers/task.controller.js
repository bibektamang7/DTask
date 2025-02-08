"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = exports.deleteAttachmentFromTask = exports.addAttachmentInTask = exports.deleteTask = exports.updateTask = exports.getTask = exports.getTasks = exports.createTask = void 0;
const attachment_model_1 = require("../models/attachment.model");
const task_model_1 = require("../models/tasks/task.model");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const validation_1 = require("../helpers/validation");
const mongoose_1 = __importDefault(require("mongoose"));
const comment_model_1 = require("../models/tasks/comment.model");
const createTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = validation_1.createTaskSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Validation error");
    }
    const task = yield task_model_1.TaskModel.create(Object.assign(Object.assign({}, parsedData.data), { createdBy: req.member._id }));
    if (!task) {
        throw new ApiError_1.ApiError(500, "Internal server error");
    }
    // const socketTask = taskManager.getOrCreateTask(task._id.toString());
    // TODO:Emit socket emit for task creation
    //Also consider where you need to return created task or not
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Task created successfully"));
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
    if (!task || task.length < 1) {
        throw new ApiError_1.ApiError(400, "Task not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, task[0]));
}));
exports.getTask = getTask;
const updateTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.updateTask = updateTask;
const deleteTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    if (!taskId) {
        throw new ApiError_1.ApiError(400, "Task id required");
    }
    const task = yield task_model_1.TaskModel.findById(taskId);
    if (!task) {
        throw new ApiError_1.ApiError(400, "Task not found");
    }
    if (task.workspaceId !== req.workspaceMember.workspace ||
        (req.member._id !== task.createdBy && req.workspaceMember.role !== "Admin")) {
        throw new ApiError_1.ApiError(403, "Unauthorized to delete task");
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
    const task = yield task_model_1.TaskModel.findById(taskId);
    if (!task) {
        throw new ApiError_1.ApiError(400, "Task not found");
    }
    if (task.workspaceId !== req.workspaceMember.workspace) {
        throw new ApiError_1.ApiError(400, "Task not found in workspace");
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
    const task = yield task_model_1.TaskModel.findById(taskId);
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
    const task = yield task_model_1.TaskModel.findById(parsedData.data.taskId);
    if (!task) {
        throw new ApiError_1.ApiError(400, "Task not found");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        //TODO:this is not complete so consider it
        const comment = yield comment_model_1.CommentModel.create([parsedData], {
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
        session.commitTransaction();
        //TODO:emit socket event
        res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, {}, "Comment created successfully"));
    }
    catch (error) {
        session.abortTransaction();
    }
    finally {
        session.endSession();
    }
}));
exports.createComment = createComment;
const deleteComment = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError_1.ApiError(400, "Comment id required");
    }
    const parsedData = validation_1.deleteCommentSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Validation Error");
    }
    const comment = yield comment_model_1.CommentModel.findById(commentId);
    if (!comment) {
        throw new ApiError_1.ApiError(400, "Comment not found");
    }
    //TODO:create logic for admin be able to delete
    if (comment.createdBy !== req.member._id) {
        throw new ApiError_1.ApiError(403, "Unauthorized to delete comment");
    }
    //TODO:make it atomic
    if (comment.attachments) {
        const deleteAttachment = yield attachment_model_1.AttachmentModel.findByIdAndDelete(comment.attachments);
        if (!deleteAttachment) {
            throw new ApiError_1.ApiError(500, "Failed to delete attachment");
        }
    }
    const deleteComment = yield comment_model_1.CommentModel.findByIdAndDelete(comment._id);
    if (!deleteComment) {
        throw new ApiError_1.ApiError(500, "Failed to delete comment");
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, "Comment Deleted successfully"));
}));
exports.deleteComment = deleteComment;
