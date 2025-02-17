"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceEditor = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const workspaceMember_model_1 = require("../models/workspaces/workspaceMember.model");
const ApiError_1 = require("../utils/ApiError");
const workspace_model_1 = require("../models/workspaces/workspace.model");
exports.workspaceEditor = (0, asyncHandler_1.asyncHandler)((req, _, next) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const { workspaceId } = req.params;
		if (!workspaceId) {
			throw new ApiError_1.ApiError(400, "Workspace id required");
		}
		const workspace = yield workspace_model_1.WorkspaceModel.findById(
			workspaceId
		);
		if (!workspace) {
			throw new ApiError_1.ApiError(400, "Workspace not found");
		}
		const workspaceMember =
			yield workspaceMember_model_1.WorkspaceMemberModel.findOne({
				workspace: workspaceId,
				userId: req.member._id,
			});
		console.log("workspace member", workspaceMember);
		if (!workspaceMember || !workspaceMember.isJoined) {
			throw new ApiError_1.ApiError(401, "Unauthorized member");
		}
		if (workspaceMember.role === "Member") {
			throw new ApiError_1.ApiError(401, "Unauthorized to edit");
		}
		req.workspaceMember = workspaceMember;
		next();
	})
);
