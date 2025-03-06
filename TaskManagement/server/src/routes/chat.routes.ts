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
	getChatMessages,
} from "../controllers/chat.controller";
import upload from "../middlewares/multer.middleware";
import { workspaceEditor } from "../middlewares/workspaceAuth";

const router = Router();

router.use(authMiddleware);

router
	.route("/:workspaceId")
	.post(workspaceEditor, createChat)
	.delete(workspaceEditor, deleteChat)
	.get(workspaceEditor, getChat);

router.route("/:workspaceId/getChats").get(workspaceEditor, getChats);

router
	.route("/:workspaceId/:chatId/messages")
	.post(upload.array("chatFiles"), workspaceEditor, sendMessage)
	.delete(workspaceEditor, deleteMessage)
	.get(workspaceEditor,getChatMessages )

router
	.route("/:workspaceId/:chatId/members/:memberId")
	.post(workspaceEditor, addMemberInChat)
	.delete(workspaceEditor, removeMemberFromChat);
export default router;
