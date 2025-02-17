"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workspaceAuth_1 = require("../middlewares/workspaceAuth");
const workspace_controller_1 = require("../controllers/workspace.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
//still need to consider getAllmembers routes
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router
    .route("/")
    .post(workspace_controller_1.createWorkspace)
    .get(workspace_controller_1.getWorkspace);
router.route("/delete-workspace/:workspaceId").delete(workspace_controller_1.deleteWorkspace);
router.route("/update-workspace/:workspaceId").patch(workspace_controller_1.updateWorkspace);
router
    .route("/members/:workspaceId")
    .post(workspaceAuth_1.workspaceEditor, workspace_controller_1.addMemeberInWorkspace)
    .delete(workspaceAuth_1.workspaceEditor, workspace_controller_1.deleteMemberFromWorkspace);
exports.default = router;
