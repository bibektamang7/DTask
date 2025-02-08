"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceManager = void 0;
const workspace_1 = require("./workspace");
const user_1 = require("./user");
class WorkspaceManager {
    constructor() {
        this.workspaces = [];
    }
    static getInstance() {
        if (WorkspaceManager.instance) {
            return WorkspaceManager.instance;
        }
        WorkspaceManager.instance = new WorkspaceManager();
        return WorkspaceManager.instance;
    }
    getOrCreateWorkspace(workspaceId) {
        let workspace = this.workspaces.find((workspace) => workspace.workspaceId === workspaceId);
        if (!workspace) {
            workspace = new workspace_1.Workspace(workspaceId);
            this.workspaces.push(workspace);
        }
        return workspace;
    }
    handleWorkspaceEvents(ws, user) {
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data.toString());
            const workspaceId = message.data.workspaceId;
            const workspace = this.getOrCreateWorkspace(workspaceId);
            switch (message.type) {
                case "join-workspace": {
                    user_1.userManager.addUserToWorkspace(workspaceId, user);
                    user_1.userManager.addOnlineUsers(user);
                    break;
                }
                case "leave-workspace": {
                    user_1.userManager.removeUserFromWorkspace(workspace.workspaceId, user.userId);
                    const users = user_1.userManager.getWorkspaceUsers(workspaceId);
                    if (users) {
                        //TODO:NEED TO CONSIDE THIS
                        this.workspaces.filter((workspace) => workspace.workspaceId !== workspaceId);
                    }
                }
            }
        };
    }
    handleWorkspaceChats(ws, user) {
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data.toString());
            const workspaceId = message.data.workspaceId;
            const workspace = this.getOrCreateWorkspace(workspaceId);
            workspace.chatHandler.handleEvents(message, user);
        };
    }
    handleWorkspaceTasks(ws, user) {
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data.toString());
            const workspaceId = message.data.workspaceId;
            const workspace = this.getOrCreateWorkspace(workspaceId);
            workspace.chatHandler.handleEvents(message, user);
        };
    }
    removeUser(userId) {
        user_1.userManager.removeOnlineUser(userId);
        // TODO:REMOVE USER FROM WORKSPACES AS WELL
    }
}
exports.workspaceManager = WorkspaceManager.getInstance();
