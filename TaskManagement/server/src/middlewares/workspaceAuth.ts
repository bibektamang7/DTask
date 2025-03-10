import { NextFunction, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { WorkspaceMemberModel } from "../models/workspaces/workspaceMember.model";
import { ApiError } from "../utils/ApiError";
import { WorkspaceModel } from "../models/workspaces/workspace.model";

export const workspaceEditor = asyncHandler(
	async (req: Request, _, next: NextFunction) => {
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
			select: "user",
		});
		if (!workspace) {
			throw new ApiError(400, "Workspace not found");
		}
		const workspaceMember = await WorkspaceMemberModel.findOne({
			workspace: workspaceId,
			user: req.member._id,
		});
		
		if (!workspaceMember || !workspaceMember.isJoined) {
			throw new ApiError(401, "Unauthorized member");
		}
		req.workspaceMember = workspaceMember;
		req.workspace = workspace;
		next();
	}
);
