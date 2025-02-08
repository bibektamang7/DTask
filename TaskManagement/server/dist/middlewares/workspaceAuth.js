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
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceEditor = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const workspaceMember_model_1 = require("../models/workspaces/workspaceMember.model");
const ApiError_1 = require("../utils/ApiError");
exports.workspaceEditor = (0, asyncHandler_1.asyncHandler)((req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { workspaceId } = req.params || req.body;
    if (!workspaceId) {
        throw new ApiError_1.ApiError(400, "Workspace required");
    }
    const workspaceMember = yield workspaceMember_model_1.WorkspaceMemberModel.findOne({
        workspace: workspaceId,
        userId: (_a = req.member) === null || _a === void 0 ? void 0 : _a._id,
    });
    if (!workspaceMember || !workspaceMember.isJoined) {
        throw new ApiError_1.ApiError(403, "Unauthorized member");
    }
    if (workspaceMember.role === "Member") {
        throw new ApiError_1.ApiError(403, "Unauthorized to edit");
    }
    req.workspaceMember = workspaceMember;
    next();
}));
