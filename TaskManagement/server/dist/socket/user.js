"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userManager = void 0;
class User {
    constructor(socket, id) {
        this.socket = socket;
        this.userId = id;
    }
}
exports.User = User;
//define methods separately for the simplicity
//can use Record to make remove redundency
class UserManager {
    // private taskUsers: Map<string, User[]>;
    constructor() {
        this.workspaceUsers = new Map();
        // this.taskUsers = new Map()
        this.onlineUsers = new Map();
    }
    static getInstance() {
        if (UserManager.instance) {
            return UserManager.instance;
        }
        UserManager.instance = new UserManager();
        return UserManager.instance;
    }
    addOnlineUsers(user) {
        this.onlineUsers.set(user.userId, user);
    }
    removeOnlineUser(userId) {
        this.onlineUsers.delete(userId);
    }
    getOnlineUser(userId) {
        return this.onlineUsers.get(userId);
    }
    //workspace related method
    addUserToWorkspace(workspaceId, user) {
        this.workspaceUsers.set(workspaceId, [
            ...(this.workspaceUsers.get(workspaceId) || []),
            user,
        ]);
    }
    getWorkspaceUsers(workspaceId) {
        return this.workspaceUsers.get(workspaceId);
    }
    removeUserFromWorkspace(workspaceId, userId) {
        const users = this.workspaceUsers.get(workspaceId);
        if (!users)
            return;
        const updatedUsers = users.filter((user) => user.userId !== userId);
        this.workspaceUsers.set(workspaceId, updatedUsers);
    }
}
exports.userManager = UserManager.getInstance();
