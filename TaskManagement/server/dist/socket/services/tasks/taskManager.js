"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskManager = exports.TaskManager = void 0;
const constant_1 = require("../../../constant");
const task_1 = require("./task");
class TaskManager {
    constructor() {
        this.tasks = [];
    }
    static getInstance() {
        if (TaskManager.instance) {
            return TaskManager.instance;
        }
        TaskManager.instance = new TaskManager();
        return TaskManager.instance;
    }
    handleTaskEvent(message, user) {
        switch (message.type) {
            case constant_1.workspaceTaskEvent.USER_JOIN_TASK:
                const taskId = message.data.taskId;
                const task = this.getOrCreateTask(taskId);
                task.addUser(user);
                break;
            case constant_1.workspaceTaskEvent.USER_LEAVE_TASK: {
                const task = this.getOrCreateTask(taskId);
                task.removeUser(user.userId);
                if (task.getUsersNumber() < 1) {
                    this.tasks.filter((task) => task.taskId !== taskId);
                }
                break;
            }
        }
    }
    getOrCreateTask(taskId) {
        let task = this.tasks.find((task) => task.taskId === taskId);
        if (!task) {
            task = new task_1.Task(taskId);
            this.tasks.push(task);
        }
        return task;
    }
    removeUserFromAllTasks(userId) {
        this.tasks.filter((task) => {
            task.removeUser(userId);
            if (task.getUsersNumber() > 0)
                return task;
        });
    }
}
exports.TaskManager = TaskManager;
exports.taskManager = TaskManager.getInstance();
