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

import { createClient } from "redis";

const workspaceClient = createClient({ url: "redis://localhost:6379" });
const publisher = workspaceClient.duplicate();

(async () => {
	workspaceClient
		.connect()
		.then(() => console.log("Worksapce client connected"));
	await publisher.connect();
})();

const isValidUser = async (userId: string) => {
	const db = mongoose.connection.db;
	const collection = db?.collection("users");
	const user = await collection?.findOne({
		_id: new mongoose.Types.ObjectId(userId),
	});

	return !!user;
};

const createWorkspaceService = async (data: any) => {
	const parsedData = createWorkspaceSchema.safeParse(data);
	if (!parsedData.success) {
		throw new ApiError(400, "Validation Error");
	}
	await Promise.all(
		(parsedData.data?.members || []).map(async (userId) => {
			const isValid = await isValidUser(userId);
			if (!isValid) {
				throw new ApiError(400, "Invalid users");
			}
		})
	);
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// Validate input data

		// Create the workspace
		const workspace = await WorkspaceModel.create(
			[
				{
					name: parsedData.data.name,
					owner: parsedData.data.owner,
				},
			],
			{ session }
		);
		if (!workspace) throw new Error("Failed to create workspace");

		// Add members to workspace
		const updatedMember =
			parsedData.data.members?.map((id) => ({
				user: id,
				workspace: workspace[0]._id,
				role: "Member",
				isJoined: false,
			})) ?? [];

		updatedMember.push({
			user: workspace[0].owner.toString(),
			workspace: workspace[0]._id,
			role: "Admin",
			isJoined: true,
		});

		const member = await WorkspaceMemberModel.create(updatedMember, {
			session,
			ordered: true,
		});

		if (!member) throw new Error("Failed to create workspace member");

		// Update workspace with member details
		const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
			workspace[0]._id,
			{ $set: { members: member } },
			{ new: true, session }
		);
		if (!updatedWorkspace) throw new Error("Failed to update workspace member");

		await session.commitTransaction();

		await publisher.publish(
			"workspaceCreated",
			JSON.stringify({
				workspaceId: workspace[0]._id,
				members: parsedData.data.members || [],
			})
		);

		return updatedWorkspace;
	} catch (error: any) {
		console.log(error);

		await session.abortTransaction();
		session.endSession();
		throw new ApiError(500, "Something went wrong while creating workspace");
	} finally {
		session.endSession();
	}
};

workspaceClient.subscribe("createWorkspace", async (message) => {
	const data = JSON.parse(message);
	try {
		const workspace = await createWorkspaceService(data);

		await publisher.publish("workspace:created", JSON.stringify({ workspace }));
	} catch (error: any) {
		await publisher.publish(
			"workspace:failed",
			JSON.stringify({ message: error.message })
		);
	}
});

const createWorkspace = asyncHandler(async (req, res) => {
	const workspace = await createWorkspaceService({
		...req.body,
		owner: req.member?._id.toString(),
	});

	res
		.status(200)
		.json(new ApiResponse(200, workspace, "Workspace created successfully"));
});

const deleteWorkspace = asyncHandler(async (req, res) => {
	const { workspaceId } = req.params;
	if (!workspaceId) {
		throw new ApiError(400, "Workspace id required");
	}

	const workspace = await WorkspaceModel.findById(workspaceId).populate({
		path: "members",
		populate: {
			path: "user",
			select: "username avatar",
		},
	});
	if (!workspace) {
		throw new ApiError(400, "workspace not fount");
	}

	if (workspace.owner.toString() !== req.member._id.toString()) {
		throw new ApiError(401, "Unauthorized to delete workspace");
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
		await WorkspaceModel.deleteOne(
			{ _id: workspace._id },
			{ session: session }
		);

		await session.commitTransaction();
		publisher.publish(
			"workspaceDeleted",
			JSON.stringify({
				workspaceId: workspace._id,
				workspaceMember: workspace.members,
			})
		);
	} catch (error: any) {
		await session.abortTransaction();
		console.log(error);
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
	const workspace = await WorkspaceModel.findById(workspaceId).populate({
		path: "members",
		populate: {
			path: "user",
			select: "username avatar",
		},
	});
	if (!workspace) {
		throw new ApiError(400, "Workspace not found");
	}
	if (workspace.owner.toString() !== req.member._id.toString()) {
		throw new ApiError(401, "Unauthorized to edit workspace name");
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
	publisher.publish(
		"workspaceNameUpdated",
		JSON.stringify({
			workspaceId: updatedWorkspace._id,
			name: updatedWorkspace.name,
			members: workspace.members,
		})
	);
	res
		.status(200)
		.json(new ApiResponse(200, workspace, "Workspace updated successfully"));
});

const getWorkspace = asyncHandler(async (req, res) => {
	const { workspaceId } = req.params;
	const userId = req.member._id;

	if (!workspaceId && !userId) {
		throw new ApiError(400, "Workspace ID or User ID is required");
	}

	const matchCondition = workspaceId ? { _id: workspaceId } : { owner: userId };

	const workspace = await WorkspaceModel.aggregate([
		{
			$match: matchCondition,
		},
		{
			$lookup: {
				from: "users",
				localField: "owner",
				foreignField: "_id",
				as: "owner",
				pipeline: [
					{
						$project: {
							_id: 1,
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
				from: "workspacemembers",
				localField: "members",
				foreignField: "_id",
				as: "members",
				pipeline: [
					{
						$lookup: {
							from: "users",
							localField: "user",
							foreignField: "_id",
							as: "user",
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
						$addFields: {
							user: { $arrayElemAt: ["$user", 0] },
						},
					},
				],
			},
		},
		{
			$addFields: {
				owner: { $arrayElemAt: ["$owner", 0] },
			},
		},
	]);

	if (workspace.length < 1) {
		throw new ApiError(404, "Workspace not found");
	}

	res.status(200).json(new ApiResponse(200, workspace[0]));
});

const addMemeberInWorkspace = asyncHandler(async (req, res) => {
	if (req.workspaceMember.role === "Member") {
		throw new ApiError(401, "You are not authorized.");
	}
	const parsedData = addMemeberInWorkspaceSchema.safeParse(req.body);
	if (!parsedData.success) {
		throw new ApiError(400, "Validation error");
	}

	if (!isValidUser(parsedData.data.member.userId)) {
		throw new ApiError(400, "User not found");
	}
	if (
		parsedData.data.member.role === "Editor" &&
		(req.workspaceMember.role !== "Admin" ||
			req.workspaceMember.role === "Editor")
	) {
		throw new ApiError(401, "Unauthorized to add editor");
	}
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const workspaceMember = await WorkspaceMemberModel.create(
			[
				{
					workspace: req.workspaceMember.workspace,
					user: parsedData.data.member.userId,
					role: parsedData.data.member.role,
					isJoined: parsedData.data.member.isJoined,
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
					members: workspaceMember,
				},
			},
			{ session: session, new: true }
		).populate({
			path: "members",
			populate: {
				path: "user",
				select: "avatar username",
			},
		});

		if (!workspace) {
			throw new ApiError(500, "Failed to update workspace");
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
		await session.commitTransaction();

		res
			.status(200)
			.json(
				new ApiResponse(
					200,
					workspaceMember[0],
					"Member added in the workspace"
				)
			);
	} catch (error: any) {
		console.log(error);

		await session.abortTransaction();
		throw new ApiError(500, error.message || "Internal server error");
	} finally {
		session.endSession();
	}

	// TODO:emit notification to user
	// res
	// 	.status(200)
	// .json(new ApiResponse(200, {}, "User added in workspace successfully"));
});
// TODO:need to consider this controller
const getAllMembersFromWorkspace = asyncHandler(async (req, res) => {});

const deleteMemberFromWorkspace = asyncHandler(async (req, res) => {
	if (req.workspaceMember.role === "Member") {
		throw new ApiError(401, "You are not authorized.");
	}
	const { memberId } = req.query;

	if (!memberId) {
		throw new ApiError(400, "userId is required");
	}
	const member = await WorkspaceMemberModel.findById(memberId);
	if (!member) {
		throw new ApiError(400, "Workspace member not found");
	}

	if (
		req.workspaceMember.role === member.role ||
		(member.role === "Editor" && req.workspaceMember.role === "Member")
	) {
		throw new ApiError(401, "Unauthorized to delete member");
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
		const populatedWorkspace = await workspace.populate({
			path: "members",
			populate: {
				path: "user",
				select: "avatar username",
			},
		});
		if (!populatedWorkspace) {
			throw new ApiError(500, "Internal server error");
		}
		const workspaceMember = await WorkspaceMemberModel.findByIdAndDelete(
			member._id,
			{ session }
		);

		if (!workspaceMember) {
			throw new ApiError(500, "Internal server error");
		}

		await session.commitTransaction();
		publisher.publish(
			"removeMemberFromWorkspace",
			JSON.stringify({
				workspaceId: workspace._id,
				userId: member.user,
				members: populatedWorkspace.members,
			})
		);
	} catch (error) {
		await session.abortTransaction();

		throw new ApiError(500, "Internal server error");
	} finally {
		session.endSession();
	}

	res.status(200).json(new ApiResponse(200, {}, "Delete successfully"));
});

// //Invitation controller
// const acceptInvitation = asyncHandler(async (req, res) => {});
// const declineInvitation = asyncHandler(async (req, res) => {});

export {
	createWorkspace,
	deleteWorkspace,
	updateWorkspace,
	getWorkspace,
	addMemeberInWorkspace,
	getAllMembersFromWorkspace,
	deleteMemberFromWorkspace,
};
