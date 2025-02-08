import { NextFunction, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { WorkspaceMemberModel } from "../models/workspaces/workspaceMember.model";
import { ApiError } from "../utils/ApiError";

export const workspaceEditor = asyncHandler(async (req: Request, _, next: NextFunction) => {
    const { workspaceId } = req.params || req.body;
    if (!workspaceId) {
        throw new ApiError(400, "Workspace required");
    }  

    const workspaceMember = await WorkspaceMemberModel.findOne({
        workspace: workspaceId,
        userId: req.member?._id,
    });

    if (!workspaceMember || !workspaceMember.isJoined) {
        throw new ApiError(403, "Unauthorized member");
    }
    if (workspaceMember.role === "Member") {
        throw new ApiError(403, "Unauthorized to edit");
    }
    req.workspaceMember = workspaceMember;
    next();
})