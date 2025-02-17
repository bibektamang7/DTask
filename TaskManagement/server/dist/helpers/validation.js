"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginWithEmailAndPasswordSchema = exports.signupSchema = exports.setUsernameSchema = exports.updateWorkspaceNameSchema = exports.deleteTaskSchema = exports.deleteAttachmentSchema = exports.createWorkspaceSchema = exports.addMemeberInWorkspaceSchema = exports.addAttachmentSchema = exports.createTaskSchema = exports.createCommentSchema = exports.deleteCommentSchema = exports.createChatSchema = exports.sendMessageSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const signupSchema = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string(),
    username: zod_1.default.string(),
    workspace: zod_1.default.object({
        name: zod_1.default.string(),
        member: zod_1.default.array(zod_1.default.string()).optional(),
    }),
});
exports.signupSchema = signupSchema;
const setUsernameSchema = zod_1.default.object({
    email: zod_1.default.string(),
    username: zod_1.default.string().min(6).max(20),
});
exports.setUsernameSchema = setUsernameSchema;
const userLoginWithEmailAndPasswordSchema = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string(),
});
exports.userLoginWithEmailAndPasswordSchema = userLoginWithEmailAndPasswordSchema;
const createWorkspaceSchema = zod_1.default.object({
    owner: zod_1.default.string(),
    name: zod_1.default.string(), // consider min and max value of workspace name
    members: zod_1.default.array(zod_1.default.string()).optional(),
});
exports.createWorkspaceSchema = createWorkspaceSchema;
const updateWorkspaceNameSchema = zod_1.default.object({
    workspaceName: zod_1.default.string(),
});
exports.updateWorkspaceNameSchema = updateWorkspaceNameSchema;
const addMemeberInWorkspaceSchema = zod_1.default.object({
    member: zod_1.default.object({
        userId: zod_1.default.string(),
        role: zod_1.default.enum(["Member", "Editor", "Admin"]).default("Member"),
        workspaceId: zod_1.default.string(),
        isJoined: zod_1.default.boolean().default(false),
    }),
});
exports.addMemeberInWorkspaceSchema = addMemeberInWorkspaceSchema;
const createTaskSchema = zod_1.default.object({
    workspaceId: zod_1.default.string(),
    title: zod_1.default.string(),
    status: zod_1.default.enum(["Done", "Todo", "In-Progress"]),
    description: zod_1.default.string(),
    priority: zod_1.default.enum(["Low", "Medium", "High", "Urgent"]),
    dueDate: zod_1.default.string(), //TODO:need to recheck this validation
    assignees: zod_1.default.array(zod_1.default.string()).min(1),
    // attachments?: z.array() //TODO:Not sure
});
exports.createTaskSchema = createTaskSchema;
const deleteTaskSchema = zod_1.default.object({
    workspaceId: zod_1.default.string(),
});
exports.deleteTaskSchema = deleteTaskSchema;
const addAttachmentSchema = zod_1.default.object({
    workspaceId: zod_1.default.string(),
});
exports.addAttachmentSchema = addAttachmentSchema;
const deleteAttachmentSchema = zod_1.default.object({
    workspaceId: zod_1.default.string(),
});
exports.deleteAttachmentSchema = deleteAttachmentSchema;
const createCommentSchema = zod_1.default.object({
    message: zod_1.default.string().optional(),
    taskId: zod_1.default.string(),
    createdBy: zod_1.default.string(),
    workspaceId: zod_1.default.string(),
});
exports.createCommentSchema = createCommentSchema;
const deleteCommentSchema = zod_1.default.object({
    workspaceId: zod_1.default.string(),
    taskId: zod_1.default.string(),
});
exports.deleteCommentSchema = deleteCommentSchema;
const createChatSchema = zod_1.default.object({
    creator: zod_1.default.string(),
    members: zod_1.default.array(zod_1.default.string()).min(1),
});
exports.createChatSchema = createChatSchema;
const sendMessageSchema = zod_1.default.object({
    sender: zod_1.default.string(),
    content: zod_1.default.string().optional(),
});
exports.sendMessageSchema = sendMessageSchema;
