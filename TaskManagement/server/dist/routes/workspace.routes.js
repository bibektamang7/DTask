"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workspaceAuth_1 = require("../middlewares/workspaceAuth");
const workspace_controller_1 = require("../controllers/workspace.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
//still need to consider getAllmembers routes
router
    .route("/")
    .post(workspace_controller_1.createWorkspace)
    .delete(workspace_controller_1.deleteWorkspace)
    .patch(workspace_controller_1.updateWorkspace)
    .get(workspace_controller_1.getWorkspace);
router
    .route("/members")
    .post(workspaceAuth_1.workspaceEditor, workspace_controller_1.addMemeberInWorkspace)
    .delete(workspaceAuth_1.workspaceEditor, workspace_controller_1.deleteMemberFromWorkspace);
exports.default = router;
