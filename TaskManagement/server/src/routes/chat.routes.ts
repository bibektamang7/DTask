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
	.get(getChats);

router
	.route("/:workspaceId/:chatId/:memberId")
	.post(addMemberInChat)
	.delete(removeMemberFromChat);

router.route("/:workspaceId/:chatId").get(getChat);

router
	.route("/:workspaceId/:chatId/messages")
	.post(upload.array("chatFile"), sendMessage)
	.delete(deleteMessage);

export default router;
