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
exports.deleteMemberFromWorkspace = exports.getAllMembersFromWorkspace = exports.addMemeberInWorkspace = exports.getWorkspace = exports.updateWorkspace = exports.deleteWorkspace = exports.createWorkspace = void 0;
const workspaceMember_model_1 = require("../models/workspaces/workspaceMember.model");
const workspace_model_1 = require("../models/workspaces/workspace.model");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const validation_1 = require("../helpers/validation");
const notification_model_1 = require("../models/notification.model");
const mongoose_1 = __importDefault(require("mongoose"));
const task_model_1 = require("../models/tasks/task.model");
const attachment_model_1 = require("../models/attachment.model");
const comment_model_1 = require("../models/tasks/comment.model");
const createWorkspace = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = validation_1.createWorkspaceSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Validation Error");
    }
    const workspace = yield workspace_model_1.WorkspaceModel.create({
        name: parsedData.data.workspaceName,
        owner: req.member._id,
    });
    if (!workspace) {
        throw new ApiError_1.ApiError(500, "Internal server error");
    }
    //TODO:Need to handle this logic properly
    const workspaceMember = yield workspaceMember_model_1.WorkspaceMemberModel.create({
        userId: req.member.email,
        workspace: workspace._id,
        role: "Admin",
        isJoined: true,
    });
    const updateWorkspace = yield workspace_model_1.WorkspaceModel.findByIdAndUpdate(workspace._id, {
        $push: {
            members: workspaceMember._id
        }
    }, {
        new: true,
    });
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, workspace, "Workspace created successfully"));
}));
exports.createWorkspace = createWorkspace;
const deleteWorkspace = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId } = req.params;
    if (!workspaceId) {
        throw new ApiError_1.ApiError(400, "Workspace id required");
    }
    const workspace = yield workspace_model_1.WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        throw new ApiError_1.ApiError(400, "workspace not fount");
    }
    if (workspace.owner !== req.member._id) {
        throw new ApiError_1.ApiError(403, "Unauthorized to delete workspace");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        yield Promise.all([
            attachment_model_1.AttachmentModel.deleteMany({ taskId: { $in: workspace.tasks } }, { session: session }),
            comment_model_1.CommentModel.deleteMany({ taskId: { $in: workspace.tasks } }, { session: session }),
            task_model_1.TaskModel.deleteMany({ _id: { $in: workspace.tasks } }, { session: session }),
            workspaceMember_model_1.WorkspaceMemberModel.deleteMany({ workspace: workspace._id }, { session: session }),
        ]);
        yield workspace_model_1.WorkspaceModel.deleteOne({ _id: workspace._id }).session(session);
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        throw new ApiError_1.ApiError(500, "Internal server error");
    }
    finally {
        session.endSession();
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Deleted successfully"));
}));
exports.deleteWorkspace = deleteWorkspace;
const updateWorkspace = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId } = req.params;
    if (!workspaceId) {
        throw new ApiError_1.ApiError(400, "Workspace id required");
    }
    const parsedData = validation_1.updateWorkspaceNameSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Workspace name required");
    }
    const workspace = yield workspace_model_1.WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        throw new ApiError_1.ApiError(400, "Workspace not found");
    }
    if (workspace.owner !== req.member._id) {
        throw new ApiError_1.ApiError(403, "Unauthorized to edit workspace name");
    }
    const updatedWorkspace = yield workspace_model_1.WorkspaceModel.findByIdAndUpdate(workspace._id, {
        $set: {
            name: parsedData.data.workspaceName,
        },
    }, {
        $new: true,
    });
    if (!updatedWorkspace) {
        throw new ApiError_1.ApiError(400, "Failed to updated workspace");
    }
    //TODO:Consider what to return
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, workspace, "Workspace updated successfully"));
}));
exports.updateWorkspace = updateWorkspace;
const getWorkspace = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId } = req.params;
    if (!workspaceId) {
        throw new ApiError_1.ApiError(400, "Workspace id required");
    }
    const workspace = yield workspace_model_1.WorkspaceModel.aggregate([
        {
            $match: {
                _id: workspaceId,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "ownerId",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            role: 1,
                            email: 1,
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "tasks",
                localField: "tasks",
                foreignField: "_id",
                as: "tasks",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            status: 1,
                            priority: 1,
                            dueDate: 1,
                            createdAt: 1,
                            creator: 1,
                            assignees: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "attachments",
                localField: "attachments",
                foreignField: "_id",
                as: "attachments",
                pipeline: [
                    {
                        $project: {
                            fileUrl: 1,
                            fileName: 1,
                        },
                    },
                ],
            },
        },
    ]);
    if (workspace.length < 1) {
        throw new ApiError_1.ApiError(400, "Failed to fetch workspace");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, workspace[0]));
}));
exports.getWorkspace = getWorkspace;
const addMemeberInWorkspace = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = validation_1.addMemeberInWorkspaceSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Validation error");
    }
    if (parsedData.data.member.role === "Editor" &&
        (req.workspaceMember.role !== "Admin" ||
            req.workspaceMember.role === "Editor")) {
        throw new ApiError_1.ApiError(403, "Unauthorized to add editor");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const workspaceMember = yield workspaceMember_model_1.WorkspaceMemberModel.create([
            {
                workspace: req.workspaceMember.workspace,
                userId: parsedData.data.member.userId,
                role: parsedData.data.member.role,
            },
        ], { session });
        if (!workspaceMember) {
            throw new ApiError_1.ApiError(500, "Internal server error");
        }
        const workspace = yield workspace_model_1.WorkspaceModel.findByIdAndUpdate(req.workspaceMember.workspace, {
            $push: {
                members: workspaceMember[0]._id,
            },
        }, { session: session, new: true });
        if (!workspace) {
            throw new ApiError_1.ApiError(500, "Failed to update workspace");
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
    const invitationNotification = yield notification_model_1.NotificationSchema.create({});
    // TODO:emit notification to user
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Send invitation"));
}));
exports.addMemeberInWorkspace = addMemeberInWorkspace;
// TODO:need to consider this controller
const getAllMembersFromWorkspace = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.getAllMembersFromWorkspace = getAllMembersFromWorkspace;
const deleteMemberFromWorkspace = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { memberId } = req.params;
    if (!memberId) {
        throw new ApiError_1.ApiError(400, "Id required");
    }
    const member = yield workspaceMember_model_1.WorkspaceMemberModel.findById(memberId);
    if (!member) {
        throw new ApiError_1.ApiError(400, "Workspace member not found");
    }
    if (req.workspaceMember.role === member.role ||
        (member.role === "Editor" && req.workspaceMember.role === "Member")) {
        throw new ApiError_1.ApiError(403, "Unauthorized to delete member");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const workspace = yield workspace_model_1.WorkspaceModel.findByIdAndUpdate(req.workspaceMember.workspace, {
            $pull: {
                members: member._id,
            },
        }, { session: session });
        if (!workspace) {
            throw new ApiError_1.ApiError(500, "Failed to delete member");
        }
        const workspaceMember = yield workspaceMember_model_1.WorkspaceMemberModel.findByIdAndDelete(memberId, { session });
        if (!workspaceMember) {
            throw new ApiError_1.ApiError(500, "Internal server error");
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Delete successfully"));
}));
exports.deleteMemberFromWorkspace = deleteMemberFromWorkspace;
//Invitation controller
const acceptInvitation = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
const declineInvitation = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
