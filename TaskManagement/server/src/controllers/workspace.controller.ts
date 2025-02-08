import { WorkspaceMemberModel } from "../models/workspaces/workspaceMember.model";
import { WorkspaceModel } from "../models/workspaces/workspace.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {
  addMemeberInWorkspaceSchema,
  createWorkspaceSchema,
  updateWorkspaceNameSchema,
} from "../helpers/validation";
import { NotificationSchema } from "../models/notification.model";
import mongoose from "mongoose";
import { TaskModel } from "../models/tasks/task.model";
import { AttachmentModel } from "../models/attachment.model";
import { CommentModel } from "../models/tasks/comment.model";
import { User } from "../models/user.model";

const createWorkspace = asyncHandler(async (req, res) => {
  const parsedData = createWorkspaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new ApiError(400, "Validation Error");
  }
  const workspace = await WorkspaceModel.create({
    name: parsedData.data.workspaceName,
    owner: (req.member as User)._id,
  });
  if (!workspace) {
    throw new ApiError(500, "Internal server error");
  }
  //TODO:Need to handle this logic properly
  
  const workspaceMember = await WorkspaceMemberModel.create({
    userId: (req.member as User).email,
    workspace: workspace._id,
    role: "Admin",
    isJoined: true,
  });
  const updateWorkspace = await WorkspaceModel.findByIdAndUpdate(workspace._id,
    {
      $push: {
        members: workspaceMember._id
      }
    }, {
      new: true,
    }
  )
  res
    .status(200)
    .json(new ApiResponse(200, workspace, "Workspace created successfully"));
});

const deleteWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  if (!workspaceId) {
    throw new ApiError(400, "Workspace id required");
  }

  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new ApiError(400, "workspace not fount");
  }
  if (workspace.owner !== (req.member as User)._id) {
    throw new ApiError(403, "Unauthorized to delete workspace");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Promise.all([
      AttachmentModel.deleteMany(
        { taskId: { $in: workspace.tasks } },
        { session: session }
      ),
      CommentModel.deleteMany(
        { taskId: { $in: workspace.tasks } },
        { session: session }
      ),
      TaskModel.deleteMany(
        { _id: { $in: workspace.tasks } },
        { session: session }
      ),
      WorkspaceMemberModel.deleteMany(
        { workspace: workspace._id },
        { session: session }
      ),
    ]);

    await WorkspaceModel.deleteOne({ _id: workspace._id }).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, "Internal server error");
  } finally {
    session.endSession();
  }

  res.status(200).json(new ApiResponse(200, {}, "Deleted successfully"));
});

const updateWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  if (!workspaceId) {
    throw new ApiError(400, "Workspace id required");
  }
  const parsedData = updateWorkspaceNameSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new ApiError(400, "Workspace name required");
  }
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new ApiError(400, "Workspace not found");
  }
  if (workspace.owner !== (req.member as User)._id) {
    throw new ApiError(403, "Unauthorized to edit workspace name");
  }
  const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
    workspace._id,
    {
      $set: {
        name: parsedData.data.workspaceName,
      },
    },
    {
      $new: true,
    }
  );
  if (!updatedWorkspace) {
    throw new ApiError(400, "Failed to updated workspace");
  }
  //TODO:Consider what to return
  res
    .status(200)
    .json(new ApiResponse(200, workspace, "Workspace updated successfully"));
});

const getWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  if (!workspaceId) {
    throw new ApiError(400, "Workspace id required");
  }
  const workspace = await WorkspaceModel.aggregate([
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
    throw new ApiError(400, "Failed to fetch workspace");
  }
  res.status(200).json(new ApiResponse(200, workspace[0]));
});

const addMemeberInWorkspace = asyncHandler(async (req, res) => {
  const parsedData = addMemeberInWorkspaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new ApiError(400, "Validation error");
  }
  if (
    parsedData.data.member.role === "Editor" &&
    (req.workspaceMember.role !== "Admin" ||
      req.workspaceMember.role === "Editor")
  ) {
    throw new ApiError(403, "Unauthorized to add editor");
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const workspaceMember = await WorkspaceMemberModel.create(
      [
        {
          workspace: req.workspaceMember.workspace,
          userId: parsedData.data.member.userId,
          role: parsedData.data.member.role,
        },
      ],
      { session }
    );
    if (!workspaceMember) {
      throw new ApiError(500, "Internal server error");
    }
    const workspace = await WorkspaceModel.findByIdAndUpdate(
      req.workspaceMember.workspace,
      {
        $push: {
          members: workspaceMember[0]._id,
        },
      },
      { session: session, new: true }
    );
    if (!workspace) {
      throw new ApiError(500, "Failed to update workspace");
    }
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, "Internal server error");
  } finally {
    session.endSession();
  }

  const invitationNotification = await NotificationSchema.create({});
  // TODO:emit notification to user
  res.status(200).json(new ApiResponse(200, {}, "Send invitation"));
});
// TODO:need to consider this controller
const getAllMembersFromWorkspace = asyncHandler(async (req, res) => {});

const deleteMemberFromWorkspace = asyncHandler(async (req, res) => {
  const { memberId } = req.params;
  if (!memberId) {
    throw new ApiError(400, "Id required");
  }

  const member = await WorkspaceMemberModel.findById(memberId);
  if (!member) {
    throw new ApiError(400, "Workspace member not found");
  }

  if (
    req.workspaceMember.role === member.role ||
    (member.role === "Editor" && req.workspaceMember.role === "Member")
  ) {
    throw new ApiError(403, "Unauthorized to delete member");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const workspace = await WorkspaceModel.findByIdAndUpdate(
      req.workspaceMember.workspace,
      {
        $pull: {
          members: member._id,
        },
      },
      { session: session }
    );
    if (!workspace) {
      throw new ApiError(500, "Failed to delete member");
    }
    const workspaceMember = await WorkspaceMemberModel.findByIdAndDelete(
      memberId,
      { session }
    );
    if (!workspaceMember) {
      throw new ApiError(500, "Internal server error");
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, "Internal server error");
  } finally {
    session.endSession();
  }

  res.status(200).json(new ApiResponse(200, {}, "Delete successfully"));
});

//Invitation controller
const acceptInvitation = asyncHandler(async (req, res) => {});
const declineInvitation = asyncHandler(async (req, res) => {});

export {
  createWorkspace,
  deleteWorkspace,
  updateWorkspace,
  getWorkspace,
  addMemeberInWorkspace,
  getAllMembersFromWorkspace,
  deleteMemberFromWorkspace,
};
