import { Router } from "express";
import { workspaceEditor } from "../middlewares/workspaceAuth";
import {
  createWorkspace,
  deleteWorkspace,
  updateWorkspace,
  getWorkspace,
  addMemeberInWorkspace,
  getAllMembersFromWorkspace,
  deleteMemberFromWorkspace,
} from "../controllers/workspace.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.use(authMiddleware);
//still need to consider getAllmembers routes


router
  .route("/")
  .post(createWorkspace)
  .delete(deleteWorkspace)
  .patch(updateWorkspace)
  .get(getWorkspace);

router
  .route("/members")
  .post(workspaceEditor,addMemeberInWorkspace)
  .delete(workspaceEditor,deleteMemberFromWorkspace);

export default router;
