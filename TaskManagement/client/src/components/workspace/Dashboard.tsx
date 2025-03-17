import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, MoreVertical, Paperclip } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useWorkspace } from "@/hooks/customs/useWorkspace";
import { useTask } from "@/hooks/customs/useTask";
import { Attachment, Comment, Status, Task } from "@/types/task";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { WorkspaceMember } from "@/types/workspace";
import { Badge } from "../ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { priorityColors, statusColors, TaskEvent } from "@/constants";
import { format } from "date-fns";
import Todo from "./Todo";
import QuoteOfTheDay from "./QuoteOfTheDay";
import { useSocket } from "@/context/SocketContex";
import Loader from "../Loader";
import { taskApi } from "@/redux/services/taskApi";

type TaskOptionProp = "Todo" | "In Progress" | "Completed";

const DashboardPage = () => {
	const socket = useSocket();
	const dispatch = useDispatch<AppDispatch>();

	const { taskData, isLoading: taskLoading } = useTask();
	const { workspaceData, isLoading } = useWorkspace();
	const workspaceMembers = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);
	if (isLoading || taskLoading) return <Loader />;

	const [tasks, setTasks] = useState<Task[]>(taskData);
	const [date, setDate] = useState<Date | undefined>(new Date());
	const formattedDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});
	const navigate = useNavigate();
	const [taskOption, setTaskOption] = useState<TaskOptionProp>("Todo");
	const [completedTasks, setCompletedTasks] = useState<any[]>([]);
	const [todoTasks, setTodoTasks] = useState<any[]>([]);
	const [inProgressTasks, setInProgressTasks] = useState<any[]>([]);
	const [recentTasks, setRecentTasks] = useState<any[]>([]);

	const selectedTasks =
		taskOption === "Completed"
			? completedTasks
			: taskOption === "Todo"
			? todoTasks
			: inProgressTasks;

	const onStatusChange = (taskId: string, status: Status) => {
		dispatch(
			taskApi.util.updateQueryData("getTasks", undefined, (_draft: Task[]) => {
				const taskIndex = _draft.findIndex((task) => task._id === taskId);
				if (taskIndex !== -1) {
					_draft[taskIndex] = { ..._draft[taskIndex], status };
				}
			})
		);
		// setTasks((prev) =>
		// 	prev.map((task) => {
		// 		return task._id === taskId ? { ...task, status } : task;
		// 	})
		// );
	};
	const onPriorityChange = (taskId: string, priority: string) => {
		dispatch(
			taskApi.util.updateQueryData("getTasks", undefined, (_draft: Task[]) => {
				const taskIndex = _draft.findIndex((task) => task._id === taskId);
				if (taskIndex !== -1) {
					_draft[taskIndex] = { ..._draft[taskIndex], priority };
				}
			})
		);
		// setTasks((prev) =>
		// 	prev.map((task) => {
		// 		return task._id === taskId ? { ...task, priority } : task;
		// 	})
		// );
	};
	const onDescriptionChange = (taskId: string, description: string) => {
		dispatch(
			taskApi.util.updateQueryData("getTasks", undefined, (_draft: Task[]) => {
				const taskIndex = _draft.findIndex((task) => task._id === taskId);
				if (taskIndex !== -1) {
					_draft[taskIndex] = { ..._draft[taskIndex], description };
				}
			})
		);

		// setTasks((prev) =>
		// 	prev.map((task) => {
		// 		return task._id === taskId ? { ...task, description } : task;
		// 	})
		// );
	};
	const onTitlechange = (taskId: string, title: string) => {
		dispatch(
			taskApi.util.updateQueryData("getTasks", undefined, (_draft: Task[]) => {
				const taskIndex = _draft.findIndex((task) => task._id === taskId);
				if (taskIndex !== -1) {
					_draft[taskIndex] = { ..._draft[taskIndex], title };
				}
			})
		);

		// setTasks((prev) =>
		// 	prev.map((task) => {
		// 		return task._id === taskId ? { ...task, title } : task;
		// 	})
		// );
	};
	const onNewCommentAdded = (taskId: string, comment: Comment) => {
		dispatch(
			taskApi.util.updateQueryData("getTasks", undefined, (_draft: Task[]) => {
				const taskIndex = _draft.findIndex((task) => task._id === taskId);
				if (taskIndex !== -1) {
					_draft[taskIndex] = {
						..._draft[taskIndex],
						comments: [..._draft[taskIndex].comments, comment],
					};
				}
			})
		);

		// setTasks((prev) =>
		// 	prev.map((task) => {
		// 		return task._id === taskId
		// 			? { ...task, comments: [...task.comments, comment] }
		// 			: task;
		// 	})
		// );
	};
	const onCommentDelete = (taskId: string, commentId: string) => {
		dispatch(
			taskApi.util.updateQueryData("getTasks", undefined, (_draft: Task[]) => {
				const taskIndex = _draft.findIndex((task) => task._id === taskId);
				if (taskIndex !== -1) {
					_draft[taskIndex] = {
						..._draft[taskIndex],
						comments: _draft[taskIndex].comments.filter(
							(comment) => comment._id !== commentId
						),
					};
				}
			})
		);
		// setTasks((prev) =>
		// 	prev.map((task) => {
		// 		return task._id === taskId
		// 			? {
		// 					...task,
		// 					comments: task.comments.filter(
		// 						(comment) => comment._id !== commentId
		// 					),
		// 			  }
		// 			: task;
		// 	})
		// );
	};

	const onNewAttachment = (taskId: string, attachment: Attachment) => {
		dispatch(
			taskApi.util.updateQueryData("getTasks", undefined, (_draft: Task[]) => {
				const taskIndex = _draft.findIndex((task) => task._id === taskId);
				if (taskIndex !== -1) {
					_draft[taskIndex] = {
						..._draft[taskIndex],
						attachments: [..._draft[taskIndex].attachments, attachment],
					};
				}
			})
		);

		// setTasks((prev) =>
		// 	prev.map((task) => {
		// 		return task._id === taskId
		// 			? {
		// 					...task,
		// 					attachments: [...task.attachments, attachment],
		// 			  }
		// 			: task;
		// 	})
		// );
	};
	const onAttachmentDelete = (taskId: string, attachmentId: string) => {
		dispatch(
			taskApi.util.updateQueryData("getTasks", undefined, (_draft: Task[]) => {
				const taskIndex = _draft.findIndex((task) => task._id === taskId);
				if (taskIndex !== -1) {
					_draft[taskIndex] = {
						..._draft[taskIndex],
						attachments: _draft[taskIndex].attachments.filter(
							(attachment) => attachment._id !== attachmentId
						),
					};
				}
			})
		);

		// setTasks((prev) =>
		// 	prev.map((task) => {
		// 		return task._id === taskId
		// 			? {
		// 					...task,
		// 					attachments: task.attachments.filter(
		// 						(attachment) => attachment._id !== attachmentId
		// 					),
		// 			  }
		// 			: task;
		// 	})
		// );
	};

	const onNewTask = (task: Task) => {
		dispatch(
			taskApi.util.updateQueryData("getTasks", undefined, (draft: Task[]) => {
				draft.push(task);
			})
		);
		// setTasks((prev) => [...prev, task]);
	};

	const onWorkspaceCreated = () => {};
	const onWorkspaceNameUpdated = () => {};
	const onRemoveMemberFromWorkspace = () => {};
	const onWorkspaceDeleted = () => {};
	const onWorkspaceInvitation = () => {};

	useEffect(() => {
		if (tasks) {
			const filteredCompletedTasks = taskData.filter(
				(task: Task) => task.status === "Completed"
			);
			const filteredTodoTasks = taskData.filter(
				(task: Task) => task.status === "Todo"
			);
			const filteredInProgressTasks = taskData.filter(
				(task: Task) => task.status === "In-Progress"
			);
			setCompletedTasks(filteredCompletedTasks || []);
			setTodoTasks(filteredTodoTasks || []);
			setInProgressTasks(filteredInProgressTasks || []);

			const sevenDaysAgo = new Date();
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

			const recentTasksList = taskData.filter((task: Task) => {
				const createdAt = new Date(task.createdAt);
				return createdAt >= sevenDaysAgo;
			});

			setRecentTasks(recentTasksList);
		}
	}, [tasks]);

	useEffect(() => {
		if (!socket) return;
		socket.onmessage = (event) => {
			const message = JSON.parse(event.data.toString());
			switch (message.type) {
				case "workspaceCreated":
					onWorkspaceCreated();
					break;

				case "workspaceDeleted":
					onWorkspaceDeleted();
					break;
				case "workspaceNameUpdate":
					onWorkspaceNameUpdated();
					break;
				case "removeMemberFromWorkspace":
					onRemoveMemberFromWorkspace();
					break;
				case "workspaceInvitation":
					onWorkspaceInvitation();
					break;
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
			}
		};
	}, [socket]);

	return (
		<main className="relative lg:flex lg:flex-1 w-full">
			<div className="w-full pl-2">
				<div className="container py-4 md:py-8 space-y-8">
					<div>
						<div className="text-muted-foreground">{formattedDate}</div>
						<h1 className="text-3xl md:text-4xl font-medium line-clamp-1">
							<span className="text-muted-foreground">Good Morning,</span>{" "}
							<span>{workspaceData.owner.username}</span>
						</h1>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<Todo />
						<QuoteOfTheDay />
					</div>

					<Card>
						<CardContent className="p-6">
							<h2 className="text-xl font-semibold mb-4">Overview</h2>
							<Tabs defaultValue={taskOption}>
								<TabsList className="gap-4">
									<TabsTrigger
										value="Todo"
										onClick={() => setTaskOption("Todo")}
									>
										Todo
									</TabsTrigger>
									<TabsTrigger
										value="In Progress"
										onClick={() => setTaskOption("In Progress")}
									>
										In Progress
									</TabsTrigger>
									<TabsTrigger
										value="Completed"
										onClick={() => setTaskOption("Completed")}
									>
										Completed
									</TabsTrigger>
								</TabsList>
								<TabsContent
									value={taskOption}
									className="space-y-4"
								>
									{selectedTasks.length > 0 ? (
										selectedTasks.map((task) => (
											<Card
												key={task._id}
												className="hover:cursor-pointer"
											>
												<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
													<div className="space-y-1">
														<h3 className="font-semibold text-lg leading-none tracking-tight">
															{task.title}
														</h3>
														<div className="flex flex-wrap gap-2">
															{task.tags.map((tag: string) => (
																<Badge
																	key={tag}
																	variant="secondary"
																	className="text-xs"
																>
																	{tag}
																</Badge>
															))}
														</div>
													</div>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
															>
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem>Edit</DropdownMenuItem>
															<DropdownMenuItem>Delete</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</CardHeader>
												<CardContent>
													<p className="text-sm text-muted-foreground line-clamp-2">
														{task.description}
													</p>
												</CardContent>
												<CardFooter className="flex flex-wrap gap-4 items-center justify-between">
													<div className="flex items-center gap-4">
														<Badge
															variant="secondary"
															className={
																statusColors[
																	task.status as keyof typeof statusColors
																]
															}
														>
															{task.status}
														</Badge>
														<Badge
															variant="secondary"
															className={
																priorityColors[
																	task.priority as keyof typeof priorityColors
																]
															}
														>
															{task.priority}
														</Badge>
														<div className="text-sm text-muted-foreground">
															Due {format(task.dueDate, "MMM d, yyyy")}
														</div>
													</div>
													<div className="flex items-center gap-4">
														<div className="flex items-center gap-1 text-muted-foreground">
															<Paperclip className="h-4 w-4" />
															<span className="text-sm">
																{task.attachments.length}
															</span>
														</div>
														<div className="flex items-center gap-1 text-muted-foreground">
															<MessageSquare className="h-4 w-4" />
															<span className="text-sm">
																{task.comments.length}
															</span>
														</div>
														<div className="flex -space-x-2">
															{task.assignees.map(
																(assignee: WorkspaceMember) => (
																	<Avatar
																		key={assignee._id}
																		className="border-2 border-background"
																	>
																		<AvatarImage
																			src={assignee.user.avatar}
																			alt={assignee.user.username}
																		/>
																		<AvatarFallback>
																			{assignee.user.username.charAt(0)}
																		</AvatarFallback>
																	</Avatar>
																)
															)}
														</div>
													</div>
												</CardFooter>
											</Card>
										))
									) : (
										<div className="h-32 bg-muted rounded-lg flex items-center justify-center">
											<p className="text-center text-sm">
												No {taskOption} yet.
											</p>
										</div>
									)}
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			</div>

			<aside className="w-full border-t md:border-l md:border-t-0 lg:w-80">
				<div className="p-4 md:p-6 space-y-6">
					<div>
						<h2 className="text-lg font-semibold mb-4">Calendar</h2>
						<Calendar
							mode="single"
							selected={date}
							onSelect={setDate}
							className="rounded-md border"
						/>
					</div>

					<div>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">Recent Tasks</h2>
							<Button
								onClick={() => navigate("tasks")}
								variant="ghost"
								className="text-blue-500 hover:text-blue-600"
							>
								<Link to={`tasks`}>View All</Link>
							</Button>
						</div>
						<div className="space-y-4">
							{recentTasks.length > 0 ? (
								recentTasks.map((task) => (
									<Card
										key={task._id}
										className="hover:cursor-pointer flex flex-col gap-4"
									>
										<CardHeader className="flex flex-row gap-4 items-start justify-between space-y-0 pb-2">
											<div className="space-y-1 flex-1">
												<h3 className="font-semibold line-clamp-1 text-slate-300 text-base leading-none tracking-tight">
													{task.title}
												</h3>
											</div>
											<div className="text-[0.6rem] text-muted-foreground w-1/5">
												Due {format(task.dueDate, "MMM d, yyyy")}
											</div>
										</CardHeader>

										<CardFooter className="flex flex-wrap gap-4 items-center justify-between">
											<div className="flex items-center gap-4">
												<Badge
													variant="secondary"
													className={
														statusColors[
															task.status as keyof typeof statusColors
														]
													}
												>
													{task.status}
												</Badge>
												<Badge
													variant="secondary"
													className={
														priorityColors[
															task.priority as keyof typeof priorityColors
														]
													}
												>
													{task.priority}
												</Badge>
											</div>
										</CardFooter>
									</Card>
								))
							) : (
								<div className="h-32 bg-muted rounded-lg flex items-center justify-center">
									<p className="text-center text-sm">No Recent Tasks</p>
								</div>
							)}
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">Team Member</h2>
							<Button
								onClick={() => navigate("users")}
								variant="ghost"
								className="text-blue-500 hover:text-blue-600"
							>
								View All
							</Button>
						</div>
						<div className="space-y-4">
							{workspaceMembers.length > 0 ? (
								workspaceMembers.map((member, index) => (
									<div
										key={index}
										className="flex items-center gap-3"
									>
										<Avatar>
											<AvatarImage
												src={member.user.avatar}
												alt={member.user.username}
											/>
											<AvatarFallback>
												{member.user.username.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="text-sm">{member.user.username}</div>
									</div>
								))
							) : (
								<div className="h-32 bg-muted rounded-lg flex items-center justify-center">
									<p className="text-center text-sm">No Team Members</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</aside>
		</main>
	);
};
export default DashboardPage;
