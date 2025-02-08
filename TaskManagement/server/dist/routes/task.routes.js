"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const workspaceAuth_1 = require("../middlewares/workspaceAuth");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
//not sure about get tasks and update task, need to review this route futher
router.use(auth_middleware_1.authMiddleware);
router
    .route("/")
    .post(workspaceAuth_1.workspaceEditor, task_controller_1.createTask)
    .get(task_controller_1.getTask)
    .delete(workspaceAuth_1.workspaceEditor, task_controller_1.deleteTask);
router
    .route("/attachments")
    .post(workspaceAuth_1.workspaceEditor, task_controller_1.addAttachmentInTask)
    .delete(workspaceAuth_1.workspaceEditor, task_controller_1.deleteAttachmentFromTask);
router
    .route("/comments")
    .post(task_controller_1.createComment)
    .delete(task_controller_1.deleteComment);
exports.default = router;
