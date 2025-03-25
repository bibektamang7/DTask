import { WebSocket } from "ws";

class User {
	socket: WebSocket;
	userId: string;
	constructor(socket: WebSocket, id: string) {
		this.socket = socket;
		this.userId = id;
	}
}

class UserManager {
	private static instance: UserManager;
	private onlineUsers: Map<string, User>;
	// private workspaceUsers: Map<string, User[]>;

	constructor() {
		// this.workspaceUsers = new Map();
		this.onlineUsers = new Map();
	}

	static getInstance() {
		if (UserManager.instance) {
			return UserManager.instance;
		}
		UserManager.instance = new UserManager();
		return UserManager.instance;
	}

	addOnlineUsers(user: User) {
		this.onlineUsers.set(user.userId, user);
	}

	removeOnlineUser(userId: string) {
		this.onlineUsers.delete(userId);
	}

	getOnlineUser(userId: string) {
		return this.onlineUsers.get(userId);
	}
	getAllUser() {
		return this.onlineUsers;
	}
	// //workspace related method
	// addUserToWorkspace(workspaceId: string, user: User) {
	//   this.workspaceUsers.set(workspaceId, [
	//     ...(this.workspaceUsers.get(workspaceId) || []),
	//     user,
	//   ]);
	// }

	// getWorkspaceUsers(workspaceId: string) {
	//   return this.workspaceUsers.get(workspaceId);
	// }

	// removeUserFromWorkspace(workspaceId: string, userId: string) {
	//   const users = this.workspaceUsers.get(workspaceId);
	//   if (!users) return;
	//   const updatedUsers = users.filter((user) => user.userId !== userId);
	//   this.workspaceUsers.set(workspaceId, updatedUsers);
	// }

	//chats related method
	// addUserToChat(chatId: string, user: User) {
	//   this.chatUsers.set(chatId, [
	//     ...(this.workspaceUsers.get(chatId) || []),
	//     user,
	//   ]);
	// }
	// removeUserFromChat(chatId: string, userId: string) {
	//   const users = this.chatUsers.get(chatId);
	//   if (!users) return;
	//   const updatedUsers = users.filter((user) => user.userId !== userId);
	//   this.chatUsers.set(chatId, updatedUsers);
	// }
	// broadcastChat(message: any, participants: string[], userId: string, chatId: string) {
	//   const users = this.chatUsers.get(chatId);
	//   if (!users) return;
	//   users.forEach(user => {

	//   })
	// }
	//tasks related method
	// addUserToTask(taskId: string, user: User) {
	//   this.taskUsers.set(taskId, [
	//     ...(this.workspaceUsers.get(taskId) || []),
	//     user,
	//   ]);
	// }
	// removeUserFromTask(taskId: string, userId: string) {
	//   const users = this.taskUsers.get(taskId);
	//   if (!users) return;
	//   const updatedUsers = users.filter((user) => user.userId !== userId);
	//   this.taskUsers.set(taskId, updatedUsers);
	// }
}

export const userManager = UserManager.getInstance();

export { User };
