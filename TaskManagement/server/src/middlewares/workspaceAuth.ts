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
		const workspace = await WorkspaceModel.findById(workspaceId);
		if (!workspace) {
			throw new ApiError(400, "Workspace not found");
		}
		const workspaceMember = await WorkspaceMemberModel.findOne({
			workspace: workspaceId,
			userId: req.member._id,
		});
		console.log("workspace member", workspaceMember);
		if (!workspaceMember || !workspaceMember.isJoined) {
			throw new ApiError(403, "Unauthorized member");
		}
		if (workspaceMember.role === "Member") {
			throw new ApiError(403, "Unauthorized to edit");
		}
		req.workspaceMember = workspaceMember;
		next();
	}
);
