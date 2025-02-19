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
router.use(authMiddleware, workspaceEditor);
router
	.route("/:workspaceId")
	.post(createTask)
	.get(getTask)
	.delete(deleteTask);

router
	.route("/attachments")
	.post(upload.array("taskFiles", 10), addAttachmentInTask)
	.delete(deleteAttachmentFromTask);
upload;
router
	.route("/:workspaceId/:taskId/comments")
	.post(upload.single("commentImage"), createComment)
	.delete(deleteComment);

export default router;
