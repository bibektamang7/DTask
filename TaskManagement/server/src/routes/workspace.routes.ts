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
	addTodo,
	deleteTodo,
	getNotifications,
	updateTodo,
	acceptInvitation,
	declineInvitation,
	getWorkspaces,
} from "../controllers/workspace.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

//still need to consider getAllmembers routes

const router = Router();
router.use(authMiddleware);

router.route("/").post(createWorkspace).get(getWorkspace);
router.route("/:workspaceId/get-workspaces").get(workspaceEditor, getWorkspaces);
router.route("/delete-workspace/:workspaceId").delete(deleteWorkspace);
router.route("/update-workspace/:workspaceId").patch(updateWorkspace);
router
	.route("/members/:workspaceId")
	.post(workspaceEditor, addMemeberInWorkspace)
	.delete(workspaceEditor, deleteMemberFromWorkspace);

router
	.route("/members/:workspaceId/todos")
	.post(workspaceEditor, addTodo)
	.patch(workspaceEditor, updateTodo)
	.delete(workspaceEditor, deleteTodo);

router
	.route("/notifications")
	.get(getNotifications)
	.post(acceptInvitation)
	.delete(declineInvitation);
export default router;
