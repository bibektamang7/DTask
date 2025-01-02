import { workspaceTaskEvent } from "../../../constant";
import { User } from "../../user";
import { Task } from "./task";

export class TaskManager {
  private static instance: TaskManager;
  tasks: Task[];
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
  handleTaskEvent(message: any, user: User) {
    switch (message.type) {
      case workspaceTaskEvent.USER_JOIN_TASK:
        const taskId = message.data.taskId;
        const task = this.getOrCreateTask(taskId);
        task.addUser(user);
        break;
      case workspaceTaskEvent.USER_LEAVE_TASK: {
        const task = this.getOrCreateTask(taskId);
        task.removeUser(user.userId);
        if (task.getUsersNumber() < 1) {
          this.tasks.filter((task) => task.taskId !== taskId);
        }
        break;
      }
    }
  }

  getOrCreateTask(taskId: string) {
    let task = this.tasks.find((task) => task.taskId === taskId);
    if (!task) {
      task = new Task(taskId);
      this.tasks.push(task);
    }
    return task;
  }

  removeUserFromAllTasks(userId: string) {
    this.tasks.filter((task) => {
      task.removeUser(userId);
      if (task.getUsersNumber() > 0) return task;
    });
  }
}
export const taskManager = TaskManager.getInstance();
