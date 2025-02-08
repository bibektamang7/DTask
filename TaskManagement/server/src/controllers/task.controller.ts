import { AttachmentModel } from "../models/attachment.model";
import { TaskModel } from "../models/tasks/task.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {
	createCommentSchema,
	createTaskSchema,
	deleteCommentSchema,
} from "../helpers/validation";
import mongoose from "mongoose";
import { CommentModel } from "../models/tasks/comment.model";
import { User } from "../models/user.model";

const createTask = asyncHandler(async (req, res) => {
	const parsedData = createTaskSchema.safeParse(req.body);
	if (!parsedData.success) {
		throw new ApiError(400, "Validation error");
	}
	const task = await TaskModel.create({
		...parsedData.data,
		createdBy: req.member._id,
	});
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
		(req.member._id !== task.createdBy && req.workspaceMember.role !== "Admin")
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

// comments handlers
const createComment = asyncHandler(async (req, res) => {
	const parsedData = createCommentSchema.safeParse(req.body);
	if (!parsedData.success) {
		throw new ApiError(400, "Validation Error");
	}
	const task = await TaskModel.findById(parsedData.data.taskId);

	if (!task) {
		throw new ApiError(400, "Task not found");
	}

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		//TODO:this is not complete so consider it
		const comment = await CommentModel.create([parsedData], {
			session: session,
		});
		if (!comment) {
			throw new ApiError(500, "Failed to create comment");
		}
		const updatedTask = await TaskModel.findByIdAndUpdate(
			task._id,
			{
				$push: {
					comments: comment[0]._id,
				},
			},
			{ session: session, new: true }
		);
		if (!updatedTask) {
			throw new ApiError(500, "Failed to add comment");
		}
		session.commitTransaction();
		//TODO:emit socket event
		res
			.status(200)
			.json(new ApiResponse(200, {}, "Comment created successfully"));
	} catch (error) {
		session.abortTransaction();
	} finally {
		session.endSession();
	}
});
const deleteComment = asyncHandler(async (req, res) => {
	const { commentId } = req.params;
	if (!commentId) {
		throw new ApiError(400, "Comment id required");
	}
	const parsedData = deleteCommentSchema.safeParse(req.body);
	if (!parsedData.success) {
		throw new ApiError(400, "Validation Error");
	}
	const comment = await CommentModel.findById(commentId);
	if (!comment) {
		throw new ApiError(400, "Comment not found");
	}
	//TODO:create logic for admin be able to delete
	if (comment.createdBy !== req.member._id) {
		throw new ApiError(403, "Unauthorized to delete comment");
	}
	//TODO:make it atomic
	if (comment.attachments) {
		const deleteAttachment = await AttachmentModel.findByIdAndDelete(
			comment.attachments
		);
		if (!deleteAttachment) {
			throw new ApiError(500, "Failed to delete attachment");
		}
	}

	const deleteComment = await CommentModel.findByIdAndDelete(comment._id);
	if (!deleteComment) {
		throw new ApiError(500, "Failed to delete comment");
	}

	res
		.status(200)
		.json(new ApiResponse(200, {}, "Comment Deleted successfully"));
});

export {
	createTask,
	getTasks,
	getTask,
	updateTask,
	deleteTask,
	addAttachmentInTask,
	deleteAttachmentFromTask,
	createComment,
	deleteComment,
};
