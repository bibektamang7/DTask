import { Workspace } from "./workspace";
import { WebSocket } from "ws";
import { User } from "./user";
import { userManager } from "./user";

class WorkspaceManager {
  private static instance: WorkspaceManager;
  workspaces: Workspace[]; //using array for now, can improve using map or set
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
  getOrCreateWorkspace(workspaceId: string) {
    let workspace = this.workspaces.find(
      (workspace) => workspace.workspaceId === workspaceId
    );
    if (!workspace) {
      workspace = new Workspace(workspaceId);
      this.workspaces.push(workspace);
    }
    return workspace;
  }
  handleWorkspaceEvents(ws: WebSocket, user: User) {
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data.toString());
      const workspaceId = message.data.workspaceId;
      const workspace = this.getOrCreateWorkspace(workspaceId);
      switch (message.type) {
        case "join-workspace": {
          userManager.addUserToWorkspace(workspaceId, user);
          userManager.addOnlineUsers(user);
          break;
        }
        case "leave-workspace": {
          userManager.removeUserFromWorkspace(
            workspace.workspaceId,
            user.userId
          );
          const users = userManager.getWorkspaceUsers(workspaceId);
          if (users) {
            //TODO:NEED TO CONSIDE THIS
            this.workspaces.filter(
              (workspace) => workspace.workspaceId !== workspaceId
            );
          }
        }
      }
    };
  }
  handleWorkspaceChats(ws: WebSocket, user: User) {
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data.toString());
      const workspaceId = message.data.workspaceId;
      const workspace = this.getOrCreateWorkspace(workspaceId);
      workspace.chatHandler.handleEvents(message, user);
    };
  }
  handleWorkspaceTasks(ws: WebSocket, user: User) {
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data.toString());
      const workspaceId = message.data.workspaceId;
      const workspace = this.getOrCreateWorkspace(workspaceId);
      workspace.chatHandler.handleEvents(message, user);
    };
  }
  removeUser(userId: string) {
    userManager.removeOnlineUser(userId);
    // TODO:REMOVE USER FROM WORKSPACES AS WELL
  }
}

export const workspaceManager = WorkspaceManager.getInstance();
