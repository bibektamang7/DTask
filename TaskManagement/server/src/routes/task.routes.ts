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
} from "../controllers/task.controller";
import { workspaceEditor } from "../middlewares/workspaceAuth";
import { authMiddleware } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = Router();

//not sure about get tasks and update task, need to review this route futher
router.use(authMiddleware);
router
	.route("/:workspaceId")
	.post(workspaceEditor,createTask)
	.get(workspaceEditor,getTask)
	.delete(workspaceEditor,deleteTask);

router
	.route("/:workspaceId/attachments/:taskId")
	.post(upload.array("taskFiles", 10), workspaceEditor,addAttachmentInTask)
	.delete(workspaceEditor,deleteAttachmentFromTask);
upload;
router
	.route("/:workspaceId/:taskId/comments")
	.post(upload.single("commentImage"),workspaceEditor, createComment)
	.delete(workspaceEditor,deleteComment);

export default router;
