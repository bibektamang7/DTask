import { User } from "./user";
import { ChatManager, chatManager } from "./services/chats/chatManager";
import { TaskManager, taskManager } from "./services/tasks/taskManager";

class Workspace {
  workspaceId: string;
  chatHandler: ChatManager;
  taskHandler: TaskManager;
  constructor(workspaceId: string) {
    this.workspaceId = workspaceId;
    this.chatHandler = chatManager;
    this.taskHandler = taskManager;
  }
  
  removeUser(userId: string) {
    this.chatHandler.removeUserFromAllChats(userId);
    this.taskHandler.removeUserFromAllTasks(userId);
  }

}
export { Workspace };
