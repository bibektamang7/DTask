import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

import {
	createChat,
	sendMessage,
	deleteChat,
	deleteMessage,
	addMemberInChat,
	removeMemberFromChat,
	getChat,
	getChats,
} from "../controllers/chat.controller";
import upload from "../middlewares/multer.middleware";
import { workspaceEditor } from "../middlewares/workspaceAuth";

const router = Router();

router.use(authMiddleware);

router
	.route("/:workspaceId")
	.post(workspaceEditor, createChat)
	.delete(workspaceEditor, deleteChat)
	.get(workspaceEditor, getChats);

router.route("/:workspaceId/:chatId").get(workspaceEditor, getChat);

router
	.route("/:workspaceId/:chatId/messages")
	.post(upload.array("chatFile"), workspaceEditor, sendMessage)
	.delete(workspaceEditor, deleteMessage);

router
	.route("/:workspaceId/:chatId/members/:memberId")
	.post(workspaceEditor, addMemberInChat)
	.delete(workspaceEditor, removeMemberFromChat);
export default router;
