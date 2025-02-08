"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const constant_1 = require("../../../constant");
const user_1 = require("../../user");
//TODO:One thing that need to add here is typing event in description,
//while typing or editing description of task, emit who is editing the task
// TODO:not sure whether this task event need to emit only to the user who is in the task or workspace
//In this code, I implemented to emit event to all workpsace users,
//but the typing event on task should only be emited to the user in the task
class Task {
    constructor(taskId) {
        this.taskId = taskId;
        this.users = new Map();
    }
    getUsersNumber() {
        return this.users.size;
    }
    addUser(user) {
        this.users.set(user.userId, user);
    }
    removeUser(userId) {
        this.users.delete(userId);
    }
    broadcast(users, message, userId) {
        users.forEach((user) => {
            if (user.userId !== userId) {
                user.socket.send(message);
            }
        });
    }
    updateStatus(status, userId, workspaceId) {
        //TODO:this logic need to be handle efficiently
        const users = user_1.userManager.getWorkspaceUsers(workspaceId);
        if (!users)
            return;
        this.broadcast(users, JSON.stringify({
            type: constant_1.workspaceTaskEvent.TASK_STATUS_CHANGED,
            data: {
                status,
                taskId: this.taskId,
                userId,
            },
        }), userId);
    }
    updatePriority(priority, userId, workspaceId) {
        const users = user_1.userManager.getWorkspaceUsers(workspaceId);
        if (!users)
            return;
        this.broadcast(users, JSON.stringify({
            type: constant_1.workspaceTaskEvent.TASK_PRIORITY_CHANGED,
            data: {
                priority,
                taskId: this.taskId,
                userId,
            },
        }), userId);
    }
    updateDate(date, userId, workspaceId) {
        const users = user_1.userManager.getWorkspaceUsers(workspaceId);
        if (!users)
            return;
        this.broadcast(users, JSON.stringify({
            type: constant_1.workspaceTaskEvent.TASK_DATE_CHANGED,
            data: {
                date,
                taskId: this.taskId,
                userId,
            },
        }), userId);
    }
    updateDescription(description, userId, workspaceId) {
        const users = user_1.userManager.getWorkspaceUsers(workspaceId);
        if (!users)
            return;
        this.broadcast(users, JSON.stringify({
            type: constant_1.workspaceTaskEvent.DESCRIPTION_EDITED,
            data: {
                description,
                taskId: this.taskId,
                userId,
            },
        }), userId);
    }
    addAttachment(attachment, userId, workspaceId) {
        const users = user_1.userManager.getWorkspaceUsers(workspaceId);
        if (!users)
            return;
        this.broadcast(users, JSON.stringify({
            type: constant_1.workspaceTaskEvent.NEW_ATTACHMENT,
            data: {
                attachment,
                taskId: this.taskId,
                userId,
            },
        }), userId);
    }
    removeAttachment(attachmentId, userId, workspaceId) {
        const users = user_1.userManager.getWorkspaceUsers(workspaceId);
        if (!users)
            return;
        this.broadcast(users, JSON.stringify({
            type: constant_1.workspaceTaskEvent.DELETE_ATTACHMENT,
            data: {
                attachmentId,
                taskId: this.taskId,
                userId,
            },
        }), userId);
    }
    makeComment(comment, userId, workspaceId) {
        const users = user_1.userManager.getWorkspaceUsers(workspaceId);
        if (!users)
            return;
        this.broadcast(users, JSON.stringify({
            type: constant_1.workspaceTaskEvent.NEW_COMMENT,
            data: {
                comment,
                taskId: this.taskId,
                userId,
            },
        }), userId);
    }
}
exports.Task = Task;
