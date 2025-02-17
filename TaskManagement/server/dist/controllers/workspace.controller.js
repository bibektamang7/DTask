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
const mongoose_1 = __importDefault(require("mongoose"));
const task_model_1 = require("../models/tasks/task.model");
const attachment_model_1 = require("../models/attachment.model");
const comment_model_1 = require("../models/tasks/comment.model");
const redis_1 = require("redis");
const workspaceClient = (0, redis_1.createClient)({ url: "redis://localhost:6379" });
const publisher = workspaceClient.duplicate();
(() => __awaiter(void 0, void 0, void 0, function* () {
    workspaceClient
        .connect()
        .then(() => console.log("Worksapce client connected"));
    yield publisher.connect();
}))();
const isValidUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = mongoose_1.default.connection.db;
    const collection = db === null || db === void 0 ? void 0 : db.collection("User");
    const user = yield (collection === null || collection === void 0 ? void 0 : collection.findOne({
        _id: new mongoose_1.default.Types.ObjectId(userId),
    }));
    return !!user;
});
const createWorkspaceService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const parsedData = validation_1.createWorkspaceSchema.safeParse(data);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Validation Error");
    }
    yield Promise.all((((_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.members) || []).map((userId) => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield isValidUser(userId);
        if (!isValid) {
            throw new ApiError_1.ApiError(400, "Invalid users");
        }
    })));
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Validate input data
        // Create the workspace
        const workspace = yield workspace_model_1.WorkspaceModel.create([
            {
                name: parsedData.data.name,
                owner: parsedData.data.owner,
            },
        ], { session });
        if (!workspace)
            throw new Error("Failed to create workspace");
        // Add members to workspace
        const updatedMember = (_c = (_b = parsedData.data.members) === null || _b === void 0 ? void 0 : _b.map((id) => ({
            userId: id,
            workspace: workspace[0]._id,
            role: "Member",
            isJoined: false,
        }))) !== null && _c !== void 0 ? _c : [];
        updatedMember.push({
            userId: workspace[0].owner.toString(),
            workspace: workspace[0]._id,
            role: "Admin",
            isJoined: true,
        });
        const member = yield workspaceMember_model_1.WorkspaceMemberModel.create(updatedMember, {
            session,
        });
        if (!member)
            throw new Error("Failed to create workspace member");
        // Update workspace with member details
        const updatedWorkspace = yield workspace_model_1.WorkspaceModel.findByIdAndUpdate(workspace[0]._id, { $set: { member } }, { new: true, session });
        if (!updatedWorkspace)
            throw new Error("Failed to update workspace member");
        yield session.commitTransaction();
        // publisher.publish(
        // 	"workspaceCreated",
        // 	JSON.stringify({
        // 		workspaceId: workspace[0]._id,
        // 		members: parsedData.data.members,
        // 	})
        // );
        return updatedWorkspace;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new ApiError_1.ApiError(500, "Something went wrong while creating workspace");
    }
    finally {
        session.endSession();
    }
});
workspaceClient.subscribe("createWorkspace", (message) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(message);
    try {
        const workspace = yield createWorkspaceService(data);
        yield publisher.publish("workspace:created", JSON.stringify({ workspace }));
    }
    catch (error) {
        console.log("workspace creation failed");
        yield publisher.publish("workspace:failed", JSON.stringify({ message: error.message }));
    }
}));
const createWorkspace = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workspace = yield createWorkspaceService(Object.assign(Object.assign({}, req.body), { owner: (_a = req.member) === null || _a === void 0 ? void 0 : _a._id.toString() }));
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
    const workspace = yield workspace_model_1.WorkspaceModel.findById(workspaceId).populate({
        path: "members",
        populate: {
            path: "userId",
            select: "username avatar",
        },
    });
    if (!workspace) {
        throw new ApiError_1.ApiError(400, "workspace not fount");
    }
    if (workspace.owner.toString() !== req.member._id.toString()) {
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
        yield workspace_model_1.WorkspaceModel.deleteOne({ _id: workspace._id }, { session: session });
        yield session.commitTransaction();
        // publisher.publish(
        // 	"workspaceDeleted",
        // 	JSON.stringify({
        // 		workspaceId: workspace._id,
        // 		workspaceMember: workspace.members,
        // 	})
        // );
    }
    catch (error) {
        yield session.abortTransaction();
        console.log(error);
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
    const workspace = yield workspace_model_1.WorkspaceModel.findById(workspaceId).populate({
        path: "members",
        populate: {
            path: "userId",
            select: "username avatar",
        },
    });
    if (!workspace) {
        throw new ApiError_1.ApiError(400, "Workspace not found");
    }
    if (workspace.owner.toString() !== req.member._id.toString()) {
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
    // publisher.publish(
    // 	"workspaceNameUpdated",
    // 	JSON.stringify({
    // 		workspaceId: updatedWorkspace._id,
    // 		name: updatedWorkspace.name,
    // 		members: workspace.members,
    // 	})
    // );
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, workspace, "Workspace updated successfully"));
}));
exports.updateWorkspace = updateWorkspace;
const getWorkspace = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("what sdfkskljflaskdf safksdakfljkdfq");
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
        console.log(parsedData.error.message);
        throw new ApiError_1.ApiError(400, "Validation error");
    }
    if (!isValidUser(parsedData.data.member.userId)) {
        throw new ApiError_1.ApiError(400, "User not found");
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
                isJoined: parsedData.data.member.isJoined,
            },
        ], { session });
        if (!workspaceMember) {
            throw new ApiError_1.ApiError(500, "Internal server error");
        }
        const workspace = yield workspace_model_1.WorkspaceModel.findByIdAndUpdate(req.workspaceMember.workspace, {
            $push: {
                members: parsedData.data.member.userId,
            },
        }, { session: session, new: true }).populate({
            path: "members",
            populate: {
                path: "userId",
                select: "avatar username",
            },
        });
        if (!workspace) {
            throw new ApiError_1.ApiError(500, "Failed to update workspace");
        }
        //TOOD:ThIS IS NOT COMPLETE NEED TO CONSIDER,
        // const invitationNotification = await NotificationSchema.create([{
        // 	recipient: workspaceMember[0].userId,
        // 	sender: req.member._id,
        // 	purpose: "INVITE",
        // 	message: "",
        // }], {session: session});
        // if(!invitationNotification) {
        // 	throw new ApiError(500, "Failed to send notification");
        // }
        yield session.commitTransaction();
        res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, workspaceMember[0], "Member added in the workspace"));
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        throw new ApiError_1.ApiError(500, error.message || "Internal server error");
    }
    finally {
        session.endSession();
    }
    // TODO:emit notification to user
    // res
    // 	.status(200)
    // .json(new ApiResponse(200, {}, "User added in workspace successfully"));
}));
exports.addMemeberInWorkspace = addMemeberInWorkspace;
// TODO:need to consider this controller
const getAllMembersFromWorkspace = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.getAllMembersFromWorkspace = getAllMembersFromWorkspace;
const deleteMemberFromWorkspace = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { memberId } = req.query;
    if (!memberId) {
        throw new ApiError_1.ApiError(400, "userId is required");
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
        const populatedWorkspace = yield workspace.populate({
            path: "members",
            populate: {
                path: "userId",
                select: "avatar username",
            },
        });
        if (!populatedWorkspace) {
            throw new ApiError_1.ApiError(500, "Internal server error");
        }
        const workspaceMember = yield workspaceMember_model_1.WorkspaceMemberModel.findByIdAndDelete(member._id, { session });
        if (!workspaceMember) {
            throw new ApiError_1.ApiError(500, "Internal server error");
        }
        yield session.commitTransaction();
        // publisher.publish(
        // 	"RemoveMemberFromWorkspace",
        // 	JSON.stringify({
        // 		workspaceId: workspace._id,
        // 		userId: member.userId,
        // 		members: populatedWorkspace.members,
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Delete successfully"));
}));
exports.deleteMemberFromWorkspace = deleteMemberFromWorkspace;
