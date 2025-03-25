const workspaceTaskEvent = Object.freeze({
	NEW_TASK_ADDED: "new-task-added",
	TASK_ASSIGNED: "task-assigned",
	REMOVE_ASSINGEE: "task-assignee",
	TASK_STATUS_CHANGED: "task-status-changed",
	TASK_PRIORITY_CHANGED: "task-priority-changed",
	TASK_DATE_CHANGED: "task-date-changed",
	TASK_DESCRIPTION_CHANGED: "task-description-changed",
	TASK_TITLE_CHANGED: "task-title-changed",
	NEW_COMMENT: "new-comment",
	NEW_ATTACHMENT: "new-attachment",
	DELETE_ATTACHMENT: "delete-attachment",
	// USER_JOIN_TASK: "user-join-task",
	// USER_LEAVE_TASK: "user-leave-task",
	DESCRIPTION_EDITED: "description_edited",
	TASK_DELETED: "task-deleted",
	COMMENT_DELETED: "comment-deleted",
});
const workspaceChatEvent = Object.freeze({
	JOIN_CHAT: "join-chat",
	LEAVE_CHAT: "leave-chat",
	NEW_CHAT: "new-chat",
	ADD_MEMBER: "add-chat-member",
	REMOVE_MEMBER: "remove-member",
	DELETE_CHAT: "delete-chat",
	DELETE_MESSAGE: "delete-chat-message",
	ADD_MESSAGE: "add-chat-message",
});
export { workspaceTaskEvent, workspaceChatEvent };
