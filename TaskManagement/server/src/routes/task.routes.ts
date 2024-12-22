import { Router } from "express";
import {
  createTask,
  addAttachmentInTask,
  deleteAttachmentFromTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller";

const router = Router();

//not sure about get tasks and update task, need to review this route futher

router.route("/").post(createTask).get(getTask).delete(deleteTask);
router.route("/attachments").post(addAttachmentInTask).delete(deleteAttachmentFromTask)

export default router;
