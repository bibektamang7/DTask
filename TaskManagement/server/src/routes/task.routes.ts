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

const router = Router();

//not sure about get tasks and update task, need to review this route futher
router.use(authMiddleware);
router
  .route("/")
  .post(workspaceEditor, createTask)
  .get(getTask)
  .delete(workspaceEditor, deleteTask);
router
  .route("/attachments")
  .post(workspaceEditor, addAttachmentInTask)
  .delete(workspaceEditor, deleteAttachmentFromTask);

router
  .route("/comments")
  .post(createComment)
  .delete(deleteComment)


export default router;
