import { userManager } from "../../user";
import { workspaceTaskEvent } from "../../constants";
// import { Task } from "./task";

import { createClient } from "redis";
import { socketBroadcast } from "../../helpers";
// import { socketClient } from "../..";
import { socketClient } from "../../helpers/redisConnection";

// export const taskSocketClient = createClient({ url: "redis://localhost:6379" });

// (async () => {
// 	taskSocketClient
// 		.connect()
// 		.then(() => console.log("Task socket client connected"));
// })();

function taskSocketBroadcaster(type: string, data: any) {
	const message = JSON.parse(data.toString());
	const members = message.members;
	const wrokspaceMembers = members
		.map((member: { _id: string }) => userManager.getOnlineUser(member._id))
		.filter(Boolean); // Removes undefined/null values

	const emitMessage = JSON.stringify({
		type,
		data: {
			...message,
		},
	});
	socketBroadcast(wrokspaceMembers, emitMessage, message.userId);
}

socketClient.subscribe("taskCreated", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.NEW_TASK_ADDED, data);
});

socketClient.subscribe("taskDeleted", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.TASK_DELETED, data);
});

socketClient.subscribe("attachmentAdded", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.NEW_ATTACHMENT, data);
});

socketClient.subscribe("attachmentDeleted", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.DELETE_ATTACHMENT, data);
});

socketClient.subscribe("makeComment", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.NEW_COMMENT, data);
});

socketClient.subscribe("deletedComment", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.COMMENT_DELETED, data);
});

socketClient.subscribe("STATUS", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.TASK_STATUS_CHANGED, data);
});

socketClient.subscribe("PRIORITY", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.TASK_PRIORITY_CHANGED, data);
});

socketClient.subscribe("TASK_DESCRIPTION", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.TASK_DESCRIPTION_CHANGED, data);
});

socketClient.subscribe("TASK_TITLE", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.TASK_TITLE_CHANGED, data);
});

socketClient.subscribe("remove_assignee", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.REMOVE_ASSINGEE, data);
});
socketClient.subscribe("taskAssigned", (data) => {
	taskSocketBroadcaster(workspaceTaskEvent.TASK_ASSIGNED, data);
});
// export class TaskManager {
// 	private static instance: TaskManager;
// 	tasks: Task[];
// 	constructor() {
// 		this.tasks = [];
// 	}

// 	static getInstance() {
// 		if (TaskManager.instance) {
// 			return TaskManager.instance;
// 		}
// 		TaskManager.instance = new TaskManager();
// 		return TaskManager.instance;
// 	}
// 	// handleTaskEvent(message: any, user: User) {
// 	// 	switch (message.type) {
// 	// 		case workspaceTaskEvent.USER_JOIN_TASK:
// 	// 			const taskId = message.data.taskId;
// 	// 			const task = this.getOrCreateTask(taskId);
// 	// 			break;
// 	// 		case workspaceTaskEvent.USER_LEAVE_TASK: {
// 	// 			const task = this.getOrCreateTask(taskId);
// 	// 			break;
// 	// 		}
// 	// 	}
// 	// }

// 	getOrCreateTask(taskId: string) {
// 		let task = this.tasks.find((task) => task.taskId === taskId);
// 		if (!task) {
// 			task = new Task(taskId);
// 			this.tasks.push(task);
// 		}
// 		return task;
// 	}
// }

// export const taskManager = TaskManager.getInstance();
