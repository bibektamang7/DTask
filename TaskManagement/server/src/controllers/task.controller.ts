import { AttachmentModel } from "../models/attachment.model";
import { TaskModel } from "../models/tasks/task.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { createTaskSchema } from "../helpers/validation";
import { taskManager } from "../socket/services/tasks/taskManager";
import mongoose from "mongoose";
import { CommentModel } from "../models/tasks/comment.model";

const createTask = asyncHandler(async (req, res) => {
  const parsedData = createTaskSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new ApiError(400, "Validation error");
  }
  const task = await TaskModel.create(parsedData.data);
  if (!task) {
    throw new ApiError(500, "Internal server error");
  }
  // const socketTask = taskManager.getOrCreateTask(task._id.toString());

  // TODO:Emit socket emit for task creation
  //Also consider where you need to return created task or not
  res.status(200).json(new ApiResponse(200, {}, "Task created successfully"));
});

const getTasks = asyncHandler(async (req, res) => {});

const getTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new ApiError(400, "Task id required");
  }
  //TODO:NEED TO AGGREGATE THIS ACCOR
  const task = await TaskModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
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
    throw new ApiError(400, "Task not found");
  }
  res.status(200).json(new ApiResponse(200, task[0]));
});

const updateTask = asyncHandler(async (req, res) => {});

const deleteTask = asyncHandler(async (req, res) => {
  //TODO: need to delete information related to task such as comments, attachments

  const { taskId } = req.params;
  if (!taskId) {
    throw new ApiError(400, "Task id required");
  }
  const task = await TaskModel.findById(taskId);
  if (!task) {
    throw new ApiError(400, "Task not found");
  }

  if (
    task.workspaceId !== req.workspaceMember.workspace ||
    (req.user?._id !== task.createdBy && req.workspaceMember.role !== "Admin")
  ) {
    throw new ApiError(403, "Unauthorized to delete task");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedTask = await TaskModel.findByIdAndDelete(task._id, {
      session: session,
    });
    if (!deletedTask) {
      throw new ApiError(500, "Failed to delete task");
    }
    const deleteAttachments = await AttachmentModel.deleteMany(
      {
        _id: { $in: deletedTask.attachments },
      },
      { session: session }
    );

    if (!deleteAttachments.acknowledged) {
      throw new ApiError(500, "Failed to delete attachments");
    }

    const deleteComments = await CommentModel.deleteMany(
      {
        _id: { $in: deletedTask.comments },
      },
      { session: session }
    );

    if (!deleteComments.acknowledged) {
      throw new ApiError(500, "Failed to delete comments");
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, "Internal server error");
  } finally {
    session.endSession();
  }

  // TODO:Emit event for task deletion

  res.status(200).json(new ApiResponse(200, {}, "Deleted successfully"));
});

const addAttachmentInTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new ApiError(400, "Task id required");
  }
  const task = await TaskModel.findById(taskId);
  if (!task) {
    throw new ApiError(400, "Task not found");
  }
  if (task.workspaceId !== req.workspaceMember.workspace) {
    throw new ApiError(400, "Task not found in workspace");
  }

  // TODO:not sure about file or files
});

const deleteAttachmentFromTask = asyncHandler(async (req, res) => {
  // apply zod validation
  const { attachmentId } = req.body;
  const { taskId } = req.params;
  if (!taskId) {
    throw new ApiError(400, "Task id required");
  }
  const task = await TaskModel.findById(taskId);
  if (!task) {
    throw new ApiError(400, "Task not found");
  }
  if (task.workspaceId !== req.workspaceMember.workspace) {
    throw new ApiError(400, "Task not found in workspace");
  }
  if (!task.attachments.includes(new mongoose.Types.ObjectId(attachmentId))) {
    throw new ApiError(400, "Attachment not found in task");
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const attachment = await AttachmentModel.findByIdAndDelete(attachmentId, {
      session,
    });
    if (!attachment) {
      throw new ApiError(400, "Attachment not found");
    }
    const updatedTask = await TaskModel.findByIdAndUpdate(
      task._id,
      {
        $pull: {
          attachments: attachment._id,
        },
      },
      { session: session }
    );

    if (!updatedTask) {
      throw new ApiError(500, "Failed to delete attachment");
    }

    await session.commitTransaction();
  } catch (error) {
    await session.commitTransaction();
    throw new ApiError(500, "Internal server error");
  } finally {
    session.endSession();
  }
  //TODO:Emit attachment deletion event
  res.status(200).json(new ApiResponse(200, {}, "Attachment deleted"));
});

export {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  addAttachmentInTask,
  deleteAttachmentFromTask,
};
