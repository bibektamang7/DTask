"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const chat_controller_1 = require("../controllers/chat.controller");
const multer_middleware_1 = __importDefault(require("../middlewares/multer.middleware"));
const workspaceAuth_1 = require("../middlewares/workspaceAuth");
const router = (0, express_1.default)();
router.use(auth_middleware_1.authMiddleware);
router
    .route("/:workspaceId")
    .post(workspaceAuth_1.workspaceEditor, chat_controller_1.createChat)
    .delete(workspaceAuth_1.workspaceEditor, chat_controller_1.deleteChat)
    .get(chat_controller_1.getChats);
router.route("/:workspaceId/:chatId").get(chat_controller_1.getChat);
router
    .route("/:workspaceId/:chatId/messages")
    .post(multer_middleware_1.default.array("chatFile"), workspaceAuth_1.workspaceEditor, chat_controller_1.sendMessage)
    .delete(workspaceAuth_1.workspaceEditor, chat_controller_1.deleteMessage);
router
    .route("/:workspaceId/:chatId/members/:memberId")
    .post(workspaceAuth_1.workspaceEditor, chat_controller_1.addMemberInChat)
    .delete(workspaceAuth_1.workspaceEditor, chat_controller_1.removeMemberFromChat);
exports.default = router;
