// import { Workspace } from "./workspace";
// import { User } from "./user";
import { userManager } from "./user";

import { socketClient } from "./helpers/redisConnection";
// import { socketSubscriber } from ".";
import { socketBroadcast } from "./helpers";

function workspaceSocketBroadcaster(type: string, data: any) {
	const message = JSON.parse(data.toString());
	const members = message.members;
	const workpsaceMembers = members.filter((user: { _id: string }) => {
		const onlineUser = userManager.getOnlineUser(user._id);
		if (onlineUser) return onlineUser;
	});

	socketBroadcast(
		workpsaceMembers,
		JSON.stringify({
			type,
			data: {
				...message,
			},
		}),
		message.userId
	);
}

socketClient.subscribe("workspaceCreated", (data) => {
	workspaceSocketBroadcaster("workspace-invitation", data);
});

socketClient.subscribe("workspaceDeleted", (data) => {
	workspaceSocketBroadcaster("workspace-deleted", data);
});

socketClient.subscribe("workspaceNameUpdated", (data) => {
	workspaceSocketBroadcaster("workspaceName-updated", data);
});

//TODO: ADD INVITATION NOTIFICATION ENDPOINT

socketClient.subscribe("removeMemberFromWorkspace", (data) => {
	workspaceSocketBroadcaster("workspace-member-removed", data);
});

socketClient.subscribe("workspaceInvitation", (data) => {
	workspaceSocketBroadcaster("workspace-invitation", data);
});

// // class WorkspaceManager {
// // 	private static instance: WorkspaceManager;
// // 	workspaces: Workspace[]; //using array for now, can improve using map or set
// // 	constructor() {
// // 		this.workspaces = [];
// // 	}
// // 	static getInstance() {
// // 		if (WorkspaceManager.instance) {
// // 			return WorkspaceManager.instance;
// // 		}
// // 		WorkspaceManager.instance = new WorkspaceManager();
// // 		return WorkspaceManager.instance;
// // 	}
// // 	getOrCreateWorkspace(workspaceId: string) {
// // 		let workspace = this.workspaces.find(
// // 			(workspace) => workspace.workspaceId === workspaceId
// // 		);
// // 		if (!workspace) {
// // 			workspace = new Workspace(workspaceId);
// // 			this.workspaces.push(workspace);
// // 		}
// // 		return workspace;
// // 	}
// // 	handleWorkspaceEvents(user: User, message: any) {
// // 		const workspaceId = message.data.workspaceId;
// // 		const workspace = this.getOrCreateWorkspace(workspaceId);
// // 		switch (message.type) {
// // 			case "join-workspace": {
// // 				userManager.addUserToWorkspace(workspaceId, user);
// // 				userManager.addOnlineUsers(user);
// // 				break;
// // 			}
// // 			case "leave-workspace": {
// // 				userManager.removeUserFromWorkspace(workspace.workspaceId, user.userId);
// // 				const users = userManager.getWorkspaceUsers(workspaceId);
// // 				if (!users || users.length < 1) {
// // 					//TODO:NEED TO CONSIDE THIS
// // 					this.workspaces.filter(
// // 						(workspace) => workspace.workspaceId !== workspaceId
// // 					);
// // 				}
// // 			}
// // 		}
// // 	}
// // 	handleWorkspaceChats(user: User, message: any) {
// // 		const workspaceId = message.data.workspaceId;
// // 		const workspace = this.getOrCreateWorkspace(workspaceId);
// // 		workspace.chatHandler.handleEvents(message, user);
// // 	}
// // 	// handleWorkspaceTasks(user: User, message: any) {
// // 	// 	const workspaceId = message.data.workspaceId;
// // 	// 	const workspace = this.getOrCreateWorkspace(workspaceId);
// // 	// 	workspace.chatHandler.handleEvents(message, user);
// // 	// }
// // 	removeWorkspace(workspaceId: string) {
// // 		this.workspaces.filter((workspace) => workspace.workspaceId != workspaceId);
// // 	}
// // 	removeUser(userId: string) {
// // 		userManager.removeOnlineUser(userId);
// // 		// TODO:REMOVE USER FROM WORKSPACES AS WELL
// // 	}
// // }

// export const workspaceManager = WorkspaceManager.getInstance();
