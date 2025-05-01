import { ChatEvent, TaskEvent } from "@/constants";
import { taskApi } from "@/redux/services/taskApi";
import { AppDispatch } from "@/redux/store";
import { Attachment, Comment, Status, Task } from "@/types/task";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useDispatch } from "react-redux";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const SocketContext = createContext<WebSocket | null>(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { value: token } = JSON.parse(localStorage.getItem("token")!);
	const workspaceId = localStorage.getItem("workspace");

	const onStatusChange = useCallback(
		(taskId: string, status: Status) => {
			dispatch(
				taskApi.util.updateQueryData(
					"getTasks",
					{
						workspaceId,
						token,
					},
					(draft) => {
						const taskIndex = draft.data.findIndex(
							(task: Task) => task._id === taskId
						);
						if (taskIndex !== -1) {
							draft.data[taskIndex] = { ...draft.data[taskIndex], status };
						}
					}
				)
			);
			dispatch(
				taskApi.util.updateQueryData(
					"getTask",
					{ workspaceId, taskId },
					(draft) => {
						draft.data = { ...draft.data, status };
					}
				)
			);
			window.dispatchEvent(
				new CustomEvent("statusChange", { detail: { taskId, status } })
			);
		},
		[workspaceId, token, dispatch]
	);

	const onPriorityChange = useCallback(
		(taskId: string, priority: string) => {
			dispatch(
				taskApi.util.updateQueryData(
					"getTasks",

					{
						workspaceId,
						token,
					},
					(_draft) => {
						const taskIndex = _draft.data.findIndex(
							(task: Task) => task._id === taskId
						);
						if (taskIndex !== -1) {
							_draft.data[taskIndex] = { ..._draft.data[taskIndex], priority };
						}
					}
				)
			);

			dispatch(
				taskApi.util.updateQueryData(
					"getTask",
					{
						taskId,
						workspaceId,
					},
					(draft) => {
						draft.data = { ...draft.data, priority };
					}
				)
			);
			window.dispatchEvent(
				new CustomEvent("priorityChange", { detail: { taskId, priority } })
			);
		},
		[workspaceId, token, dispatch]
	);

	const onDescriptionChange = useCallback(
		(taskId: string, description: string) => {
			dispatch(
				taskApi.util.updateQueryData(
					"getTasks",

					{
						workspaceId,
						token,
					},
					(_draft) => {
						const taskIndex = _draft.data.findIndex(
							(task: Task) => task._id === taskId
						);
						if (taskIndex !== -1) {
							_draft.data[taskIndex] = {
								..._draft.data[taskIndex],
								description,
							};
						}
					}
				)
			);

			dispatch(
				taskApi.util.updateQueryData(
					"getTask",
					{
						taskId,
						workspaceId,
					},
					(draft) => {
						draft.data = { ...draft.data, description };
					}
				)
			);
			window.dispatchEvent(
				new CustomEvent("descriptionChange", {
					detail: { taskId, description },
				})
			);
		},
		[workspaceId, token, dispatch]
	);

	const onTitlechange = useCallback(
		(taskId: string, title: string) => {
			dispatch(
				taskApi.util.updateQueryData(
					"getTasks",

					{
						workspaceId,
						token,
					},
					(_draft) => {
						const taskIndex = _draft.data.findIndex(
							(task: Task) => task._id === taskId
						);
						if (taskIndex !== -1) {
							_draft.data[taskIndex] = { ..._draft.data[taskIndex], title };
						}
					}
				)
			);

			dispatch(
				taskApi.util.updateQueryData(
					"getTask",
					{ taskId, workspaceId },
					(draft) => {
						draft.data = { ...draft.data, title };
					}
				)
			);

			window.dispatchEvent(
				new CustomEvent("titleChange", { detail: { taskId, title } })
			);
		},
		[workspaceId, token, dispatch]
	);

	const onNewCommentAdded = useCallback(
		(taskId: string, comment: Comment) => {
			dispatch(
				taskApi.util.updateQueryData(
					"getTasks",

					{
						workspaceId,
						token,
					},
					(_draft) => {
						const taskIndex = _draft.data.findIndex(
							(task: Task) => task._id === taskId
						);
						if (taskIndex !== -1) {
							_draft[taskIndex] = {
								..._draft.data[taskIndex],
								comments: [..._draft.data[taskIndex].comments, comment],
							};
						}
					}
				)
			);

			dispatch(
				taskApi.util.updateQueryData(
					"getTask",
					{ taskId, workspaceId },
					(draft) => {
						draft.data = {
							...draft.data,
							comments: [...draft.data.comments, comment],
						};
					}
				)
			);
			window.dispatchEvent(
				new CustomEvent("newComment", { detail: { taskId, comment } })
			);
		},
		[token, dispatch, workspaceId]
	);

	const onCommentDelete = useCallback(
		(taskId: string, commentId: string) => {
			dispatch(
				taskApi.util.updateQueryData(
					"getTasks",

					{
						workspaceId,
						token,
					},
					(_draft) => {
						const taskIndex = _draft.data.findIndex(
							(task: Task) => task._id === taskId
						);
						if (taskIndex !== -1) {
							_draft.data[taskIndex] = {
								..._draft.data[taskIndex],
								comments: _draft.data[taskIndex].comments.filter(
									(comment: Comment) => comment._id !== commentId
								),
							};
						}
					}
				)
			);
			dispatch(
				taskApi.util.updateQueryData(
					"getTask",
					{ taskId, workspaceId },
					(draft) => {
						draft.data = {
							...draft.data,
							comments: draft.data.comments.filter(
								(comment: Comment) => comment._id !== commentId
							),
						};
					}
				)
			);
			window.dispatchEvent(
				new CustomEvent("commentDelete", { detail: { taskId, commentId } })
			);
		},
		[dispatch, token, workspaceId]
	);

	const onNewAttachment = useCallback(
		(taskId: string, attachment: Attachment[]) => {
			dispatch(
				taskApi.util.updateQueryData(
					"getTasks",

					{
						workspaceId,
						token,
					},
					(_draft) => {
						const taskIndex = _draft.data.findIndex(
							(task: Task) => task._id === taskId
						);
						if (taskIndex !== -1) {
							_draft.data[taskIndex] = {
								..._draft.data[taskIndex],
								attachments: [
									..._draft.data[taskIndex].attachments,
									...attachment,
								],
							};
						}
					}
				)
			);
			dispatch(
				taskApi.util.updateQueryData(
					"getTask",
					{ taskId, workspaceId },
					(draft) => {
						draft.data = {
							...draft.data,
							attachments: [...draft.data.attachments, ...attachment],
						};
					}
				)
			);
			window.dispatchEvent(
				new CustomEvent("newAttachment", { detail: { taskId, attachment } })
			);
		},
		[token, workspaceId, dispatch]
	);

	const onAttachmentDelete = useCallback(
		(taskId: string, attachmentId: string) => {
			dispatch(
				taskApi.util.updateQueryData(
					"getTasks",

					{
						workspaceId,
						token,
					},
					(_draft) => {
						const taskIndex = _draft.data.findIndex(
							(task: Task) => task._id === taskId
						);
						if (taskIndex !== -1) {
							_draft.data[taskIndex] = {
								..._draft.data[taskIndex],
								attachments: _draft.data[taskIndex].attachments.filter(
									(attachment: Attachment) => attachment._id !== attachmentId
								),
							};
						}
					}
				)
			);
			dispatch(
				taskApi.util.updateQueryData(
					"getTask",
					{ taskId, workspaceId },
					(draft) => {
						draft.data = {
							...draft.data,
							attachments: draft.data.attachments.filter(
								(attachment: Attachment) => attachment._id !== attachmentId
							),
						};
					}
				)
			);
			window.dispatchEvent(
				new CustomEvent("attachmentDelete", {
					detail: { taskId, attachmentId },
				})
			);
		},
		[token, workspaceId, dispatch]
	);

	const onNewTask = useCallback(
		(task: Task) => {
			dispatch(
				taskApi.util.updateQueryData(
					"getTasks",

					{
						workspaceId,
						token,
					},
					(draft) => {
						draft.data.push(task);
					}
				)
			);
			window.dispatchEvent(new CustomEvent("newTask", { detail: { task } }));
		},
		[workspaceId, token, dispatch]
	);

	useEffect(() => {
		const newSocket = new WebSocket(SOCKET_URL, token!);
		setSocket(newSocket);
		return () => {
			newSocket.close();
		};
	}, []);

	useEffect(() => {
		if (!socket) return;
		socket.onmessage = (event) => {
			const message = JSON.parse(event.data.toString());
			switch (message.type) {
				case TaskEvent.COMMENT_DELETED:
					onCommentDelete(message.data.taskId, message.data.commentId);
					break;

				case TaskEvent.DELETE_ATTACHMENT:
					onAttachmentDelete(message.data.taskId, message.data.attachmentId);

					break;
				case TaskEvent.NEW_ATTACHMENT:
					onNewAttachment(message.data.taskId, message.data.attachment);
					break;
				case TaskEvent.NEW_TASK_ADDED:
					onNewTask(message.data.task);
					break;
				case TaskEvent.TASK_DATE_CHANGED:
					// TODO:THIS IS NOT IMPLEMENTED FOR NOW
					break;
				case TaskEvent.TASK_DESCRIPTION_CHANGED:
					onDescriptionChange(message.data.taskId, message.data.description);
					break;
				case TaskEvent.TASK_PRIORITY_CHANGED:
					onPriorityChange(message.data.taskId, message.data.priority);
					break;
				case TaskEvent.TASK_STATUS_CHANGED:
					onStatusChange(message.data.taskId, message.data.status);
					break;
				case TaskEvent.TASK_TITLE_CHANGED:
					onTitlechange(message.data.taskId, message.data.title);
					break;
				case TaskEvent.NEW_COMMENT:
					onNewCommentAdded(message.data.taskId, message.data.comment);
					break;

				case ChatEvent.NEW_CHAT:
					window.dispatchEvent(
						new CustomEvent(ChatEvent.NEW_CHAT, {
							detail: { chat: message.data.chat },
						})
					);
					break;
				case ChatEvent.DELETE_CHAT:
					window.dispatchEvent(
						new CustomEvent(ChatEvent.DELETE_CHAT, {
							detail: { chatId: message.data.chatId },
						})
					);
					break;
				case ChatEvent.ADD_MESSAGE:
					window.dispatchEvent(
						new CustomEvent(ChatEvent.ADD_MESSAGE, {
							detail: { message: message.data.message },
						})
					);
					break;
				case ChatEvent.DELETE_MESSAGE:
					window.dispatchEvent(
						new CustomEvent(ChatEvent.DELETE_MESSAGE, {
							detail: {
								chatId: message.chat.chatId,
								messageId: message.data.messageId,
							},
						})
					);
					break;
				case ChatEvent.ADD_MEMBER:
					window.dispatchEvent(
						new CustomEvent(ChatEvent.ADD_MEMBER, {
							detail: {
								chatId: message.data.chatId,
								member: message.data.member,
							},
						})
					);
					break;
				case ChatEvent.REMOVE_MEMBER:
					window.dispatchEvent(
						new CustomEvent(ChatEvent.REMOVE_MEMBER, {
							detail: {
								chatId: message.data.chatId,
								memberId: message.data.memberId,
							},
						})
					);
					break;
			}
		};

		return () => {
			if (socket) {
				socket.onmessage = null;
			}
		};
	}, [socket]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export { SocketProvider };
