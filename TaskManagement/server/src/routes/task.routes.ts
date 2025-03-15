import { Router } from "express";
import {
	createTask,
	addAttachmentInTask,
	deleteAttachmentFromTask,
	deleteTask,
	getTask,
	getTasks,
	updateTask,
	createComment,
	deleteComment,
	updateTaskDocument,
	addAssigneeInTask,
	removeAssigneedFromTask,
} from "../controllers/task.controller";
import { workspaceEditor } from "../middlewares/workspaceAuth";
import { authMiddleware } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = Router();

//not sure about get tasks and update task, need to review this route futher
router.use(authMiddleware);
router
	.route("/:workspaceId")
	.post(workspaceEditor, createTask)
	.get(workspaceEditor, getTask)
	.patch(workspaceEditor, updateTaskDocument)
	.delete(workspaceEditor, deleteTask);

router.route("/:workspaceId/getTasks").get(workspaceEditor, getTasks);
router
	.route("/:workspaceId/updateTask/:taskId")
	.patch(workspaceEditor, updateTask);
router
	.route("/:workspaceId/attachments/:taskId")
	.post(upload.array("taskFiles", 5), workspaceEditor, addAttachmentInTask)
	.delete(workspaceEditor, deleteAttachmentFromTask);
router
	.route("/:workspaceId/:taskId/comments")
	.post(upload.array("commentImage", 3), workspaceEditor, createComment)
	.delete(workspaceEditor, deleteComment);
router
	.route("/:workspaceId/:taskId/members/:memberId")
	.post(workspaceEditor, addAssigneeInTask)
	.delete(workspaceEditor, removeAssigneedFromTask);

export default router;
