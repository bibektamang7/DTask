"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspace = void 0;
const chatManager_1 = require("./services/chats/chatManager");
const taskManager_1 = require("./services/tasks/taskManager");
class Workspace {
    constructor(workspaceId) {
        this.workspaceId = workspaceId;
        this.chatHandler = chatManager_1.chatManager;
        this.taskHandler = taskManager_1.taskManager;
    }
    removeUser(userId) {
        this.chatHandler.removeUserFromAllChats(userId);
        this.taskHandler.removeUserFromAllTasks(userId);
    }
}
exports.Workspace = Workspace;
