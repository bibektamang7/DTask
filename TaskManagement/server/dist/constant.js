"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceTaskEvent = exports.workspaceChatEvent = exports.DB_NAME = void 0;
const DB_NAME = "TaskManagement";
exports.DB_NAME = DB_NAME;
// websocket workspace chat events
const JOIN_WORKSPACE = "join-workspace";
const LEAVE_WORKSPACE = "leave-workspace";
const SEND_MESSAGE = "send-message";
const RECEIVED_MESSAGE = "received-message";
const workspaceEvent = Object.freeze({
    JOIN_WORKSPACE: "join-workspace",
    LEAVE_WORKSPACE: "leave-workspace`",
});
const workspaceChatEvent = Object.freeze({
    JOIN_CHAT: "join-chat",
    LEAVE_CHAT: "leave-chat",
});
exports.workspaceChatEvent = workspaceChatEvent;
// websocket workspace tasks events
const workspaceTaskEvent = Object.freeze({
    NEW_TASK_ADDED: "new-task-added",
    TASK_STATUS_CHANGED: "task-status-changed",
    TASK_PRIORITY_CHANGED: "task-priority-changed",
    TASK_DATE_CHANGED: "task-date-changed",
    NEW_COMMENT: "new-comment",
    NEW_ATTACHMENT: "new-attachment",
    DELETE_ATTACHMENT: "delete-attachment",
    USER_JOIN_TASK: "user-join-task",
    USER_LEAVE_TASK: "user-leave-task",
    DESCRIPTION_EDITED: "description_edited",
});
exports.workspaceTaskEvent = workspaceTaskEvent;
