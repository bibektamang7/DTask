import { workspaceTaskEvent } from "../../constants";
import { User, userManager } from "../../user";
//TODO:One thing that need to add here is typing event in description,
//while typing or editing description of task, emit who is editing the task

// TODO:not sure whether this task event need to emit only to the user who is in the task or workspace
//In this code, I implemented to emit event to all workpsace users,
//but the typing event on task should only be emited to the user in the task

class Task {
	taskId: string;
	// private users: Map<string, User>;
	constructor(taskId: string) {
		this.taskId = taskId;
		// this.users = new Map();
	}
	// getUsersNumber() {
	// 	return this.users.size;
	// }
	// getUser(userId: string) {
	// 	return this.users.get(userId);
	// }
	// addUser(user: User) {
	// 	this.users.set(user.userId, user);
	// // }
	// removeUser(userId: string) {
	// 	this.users.delete(userId);
	// }

	broadcast(users: User[], message: string, userId: string) {
		users.forEach((user) => {
			if (user.userId !== userId) {
				user.socket.send(message);
			}
		});
	}

	// updateStatus(status: string, userId: string, workspaceId: string) {
	// 	//TODO:this logic need to be handle efficiently
	// 	const users = userManager.getWorkspaceUsers(workspaceId);
	// 	if (!users) return;
	// 	this.broadcast(
	// 		users,
	// 		JSON.stringify({
	// 			type: workspaceTaskEvent.TASK_STATUS_CHANGED,
	// 			data: {
	// 				status,
	// 				taskId: this.taskId,
	// 				userId,
	// 			},
	// 		}),
	// 		userId
	// 	);
	// }
	// updatePriority(priority: string, userId: string, workspaceId: string) {
	// 	const users = userManager.getWorkspaceUsers(workspaceId);
	// 	if (!users) return;
	// 	this.broadcast(
	// 		users,
	// 		JSON.stringify({
	// 			type: workspaceTaskEvent.TASK_PRIORITY_CHANGED,
	// 			data: {
	// 				priority,
	// 				taskId: this.taskId,
	// 				userId,
	// 			},
	// 		}),
	// 		userId
	// 	);
	// }
	// updateDate(date: string, userId: string, workspaceId: string) {
	// 	const users = userManager.getWorkspaceUsers(workspaceId);
	// 	if (!users) return;
	// 	this.broadcast(
	// 		users,
	// 		JSON.stringify({
	// 			type: workspaceTaskEvent.TASK_DATE_CHANGED,
	// 			data: {
	// 				date,
	// 				taskId: this.taskId,
	// 				userId,
	// 			},
	// 		}),
	// 		userId
	// 	);
	// }
	// updateDescription(description: string, userId: string, workspaceId: string) {
	// 	const users = userManager.getWorkspaceUsers(workspaceId);
	// 	if (!users) return;
	// 	this.broadcast(
	// 		users,
	// 		JSON.stringify({
	// 			type: workspaceTaskEvent.DESCRIPTION_EDITED,
	// 			data: {
	// 				description,
	// 				taskId: this.taskId,
	// 				userId,
	// 			},
	// 		}),
	// 		userId
	// 	);
	// }
	// addAttachment(attachment: string, userId: string, workspaceId: string) {
	// 	const users = userManager.getWorkspaceUsers(workspaceId);
	// 	if (!users) return;
	// 	this.broadcast(
	// 		users,
	// 		JSON.stringify({
	// 			type: workspaceTaskEvent.NEW_ATTACHMENT,
	// 			data: {
	// 				attachment,
	// 				taskId: this.taskId,
	// 				userId,
	// 			},
	// 		}),
	// 		userId
	// 	);
	// }
	// removeAttachment(attachmentId: string, userId: string, workspaceId: string) {
	// 	const users = userManager.getWorkspaceUsers(workspaceId);
	// 	if (!users) return;
	// 	this.broadcast(
	// 		users,
	// 		JSON.stringify({
	// 			type: workspaceTaskEvent.DELETE_ATTACHMENT,
	// 			data: {
	// 				attachmentId,
	// 				taskId: this.taskId,
	// 				userId,
	// 			},
	// 		}),
	// 		userId
	// 	);
	// }

	// makeComment(comment: string, userId: string, workspaceId: string) {
	// 	const users = userManager.getWorkspaceUsers(workspaceId);
	// 	if (!users) return;
	// 	this.broadcast(
	// 		users,
	// 		JSON.stringify({
	// 			type: workspaceTaskEvent.NEW_COMMENT,
	// 			data: {
	// 				comment,
	// 				taskId: this.taskId,
	// 				userId,
	// 			},
	// 		}),
	// 		userId
	// 	);
	// }
}

export { Task };
