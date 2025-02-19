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
import mongoose, { startSession } from "mongoose";
import { CommentModel } from "../models/tasks/comment.model";
import { uploadOnCloudinary } from "../helpers/fileUpload.cloudinary";

import { createClient } from "redis";

// const taskClient = createClient({ url: "redis://localhost:6379" });
// taskClient.connect().then(() => console.log("Task client connected"));

const isMemberInWorkspace = async (memberId: string) => {
	const db = mongoose.connection.db; // Get the database connection
	const collection = db?.collection("workspacemembers"); // Get the collection

	const member = await collection?.findOne({
		_id: new mongoose.Types.ObjectId(memberId),
	});
	if (!member?.isJoined) {
		//TODO:HANDLE THIS LOGIC PROPERLY
		return false;
	}
	return !!member;
};

const createTask = asyncHandler(async (req, res) => {
	if (req.workspaceMember.role === "Member") {
		throw new ApiError(401, "You are not authorized.");
	}
	const parsedData = createTaskSchema.safeParse(req.body);
	if (!parsedData.success) {
		console.log(parsedData.error.message);

		throw new ApiError(400, "Validation error");
	}
	console.log(req.workspaceMember.workspace);
	const workspaceMembers = await Promise.all(
		parsedData.data.assignees.map(async (userId) => {
			const isValid = await isMemberInWorkspace(userId);
			if (!isValid) {
				throw new ApiError(
					400,
					`User ${userId} is not a valid workspace member`
				);
			}
			return userId;
		})
	);

	const task = await TaskModel.create({
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
		throw new ApiError(500, "Internal server error");
	}

	const createdTask = await TaskModel.aggregate([
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
	res.status(200).json(new ApiResponse(200, task, "Task created successfully"));
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
	console.log("This is task here");
	console.log(task);

	if (!task || task.length < 1) {
		throw new ApiError(400, "Task not found");
	}
	res.status(200).json(new ApiResponse(200, task[0]));
});

const updateTask = asyncHandler(async (req, res) => {});

const deleteTask = asyncHandler(async (req, res) => {
	if (req.workspaceMember.role === "Member") {
		throw new ApiError(401, "You are not authorized.");
	}
	const { taskId } = req.query;
	if (!taskId) {
		throw new ApiError(400, "Task id required");
	}

	// TODO: POPULATE THIS LOGIC TO EXTRACT USERID FROM THE ASSIGNEES
	const task = await TaskModel.findById(taskId).populate({
		path: "assignees",
		populate: {
			path: "userId",
			select: "username avatar",
		},
	});
	if (!task) {
		throw new ApiError(400, "Task not found");
	}

	if (
		task.workspaceId.toString() !== req.workspaceMember.workspace.toString() ||
		(req.member._id.toString() !== task.createdBy.toString() &&
			req.workspaceMember.role !== "Admin")
	) {
		throw new ApiError(401, "Unauthorized to delete task");
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
		// taskClient.publish(
		// 	"taskDeleted",
		// 	JSON.stringify({
		// 		taskId: task._id,
		// 		assignees: task.assignees,
		// 	})
		// );
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
	if (req.workspaceMember.role === "Member") {
		throw new ApiError(401, "You are not authorized.");
	}
	const { taskId } = req.params;
	if (!taskId) {
		throw new ApiError(400, "Task id required");
	}
	const files = req.files as Express.Multer.File[];

	if (!files || files.length < 1) {
		throw new ApiError(400, "Attachment is required");
	}
	// TODO: EXTRACT USERID FROM ASSIGNEES
	const task = await TaskModel.findById(taskId).populate({
		path: "assignees",
		populate: {
			path: "userId",
			select: "username avatar",
		},
	});
	if (!task) {
		throw new ApiError(400, "Task not found");
	}
	if (task.workspaceId !== req.workspaceMember.workspace) {
		throw new ApiError(400, "Task not found in workspace");
	}

	const session = await startSession();
	session.startTransaction();
	try {
		let attachments;

		if (files && files.length > 0) {
			attachments = await Promise.all(
				files.map(async (file) => {
					const fileUploadResponse = await uploadOnCloudinary(
						file.path,
						`/tasks/${task._id}`
					);

					return await AttachmentModel.create(
						[
							{
								filename: fileUploadResponse?.filename,
								fileType: fileUploadResponse?.filename,
								publicId: fileUploadResponse?.publicId,
								fileUrl: fileUploadResponse?.url,
								taskId: task._id,
							},
						],
						{ session }
					);
				})
			);
		}

		const updatedTask = await TaskModel.findByIdAndUpdate(
			task._id,
			{
				$push: {
					attachments: attachments,
				},
			},
			{
				session: session,
			}
		);

		if (!updatedTask) {
			throw new ApiError(500, "Failed to update attachemnts");
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

		await session.commitTransaction();
	} catch (error: any) {
		await session.abortTransaction();
		throw new ApiError(500, "Failed to add attachments");
	} finally {
		session.endSession();
	}

	// TODO:not sure about file or files
});

const deleteAttachmentFromTask = asyncHandler(async (req, res) => {
	// apply zod validation
	if (req.workspaceMember.role === "Member") {
		throw new ApiError(401, "You are not authorized.");
	}
	const { attachmentId } = req.body;
	const { taskId } = req.params;
	if (!taskId) {
		throw new ApiError(400, "Task id required");
	}
	//TODO: EXTRACT USERID FROM ASSIGNEES
	const task = await TaskModel.findById(taskId).populate({
		path: "assignees",
		populate: {
			path: "userId",
			select: "username avatar",
		},
	});
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
		// taskClient.publish(
		// 	"AttachmentDeleted",
		// 	JSON.stringify({
		// 		taskId: updatedTask._id,
		// 		attachmentId: attachment._id,
		// 		assignees: task.assignees,
		// 	})
		// );
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

	if (!parsedData.data.message && !req.file) {
		throw new ApiError(400, "Either message or file is required");
	}
	// TODO:EXTRACT USERID FROM ASSIGNEES
	const task = await TaskModel.findById(parsedData.data.taskId).populate({
		path: "assignees",
		populate: {
			path: "userId",
			select: "username avatar",
		},
	});

	if (!task) {
		throw new ApiError(400, "Task not found");
	}

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		let attachment = null;
		if (req.file) {
			const fileUploadResponse = await uploadOnCloudinary(
				req.file.path,
				`/tasks/${task._id}`
			);
			attachment = await AttachmentModel.create(
				[
					{
						filename: fileUploadResponse?.filename,
						fileType: fileUploadResponse?.format,
						fileUrl: fileUploadResponse?.url,
						taskId: task._id,
					},
				],
				{ session: session }
			);
			if (!attachment) {
				throw new ApiError(500, "Failed to create attachment");
			}
		}

		const comment = await CommentModel.create(
			//TODO:SEE WHAT CAN YOU DO HERE
			// @ts-ignore
			[{ ...parsedData.data, attachments: attachment?._id || undefined }],
			{
				session: session,
			}
		);

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
		await session.commitTransaction();
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
			.json(new ApiResponse(200, comment[0], "Comment created successfully"));
	} catch (error: any) {
		await session.abortTransaction();
		throw new ApiError(
			500,
			error.message || "something went wrong while saving comment"
		);
	} finally {
		session.endSession();
	}
});

const deleteComment = asyncHandler(async (req, res) => {
	const { commentId } = req.query;
	console.log(commentId);
	if (!commentId) {
		throw new ApiError(400, "Comment id required");
	}
	const parsedData = deleteCommentSchema.safeParse({
		workspaceId: req.params.workspaceId,
		taskId: req.params.taskId,
	});
	if (!parsedData.success) {
		throw new ApiError(400, "Validation Error");
	}
	//TODO: SAME GOES HERE
	const task = await TaskModel.findById(parsedData.data.taskId);
	if (!task) {
		throw new ApiError(400, "Task not found");
	}
	const comment = await CommentModel.findById(commentId);
	if (!comment) {
		throw new ApiError(400, "Comment not found");
	}
	//TODO:create logic for admin be able to delete
	if (
		req.workspaceMember.role !== "Admin" &&
		comment.createdBy.toString() !== req.member._id.toString()
	) {
		throw new ApiError(401, "Unauthorized to delete comment");
	}
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		if (comment.attachments) {
			const deleteAttachment = await AttachmentModel.findByIdAndDelete(
				comment.attachments,
				{ session: session }
			);
			if (!deleteAttachment) {
				throw new ApiError(500, "Failed to delete attachment");
			}
		}

		const deletedComment = await CommentModel.findByIdAndDelete(comment._id, {
			session: session,
		});
		if (!deletedComment) {
			throw new ApiError(500, "Failed to delete comment");
		}

		await session.commitTransaction();
		// taskClient.publish(
		// 	"DeletedComment",
		// 	JSON.stringify({
		// 		taskId: task._id,
		// 		commentId: deletedComment._id,
		// 	})
		// );
		res
			.status(200)
			.json(new ApiResponse(200, {}, "Comment Deleted successfully"));
	} catch (error: any) {
		await session.abortTransaction();
		throw new ApiError(
			500,
			error.message || "something went wrong while deleting comment"
		);
	} finally {
		session.endSession();
	}
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
