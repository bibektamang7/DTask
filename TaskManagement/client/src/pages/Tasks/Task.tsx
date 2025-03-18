import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { priorityColors, statusColors, TaskEvent } from "@/constants";
import {
	Calendar,
	CircleCheck,
	Clock4,
	EllipsisVertical,
	Loader,
	Plus,
	PlusCircle,
	Star,
	Tag,
	Trash,
	Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Activity from "./Activity";
import MyWork from "./MyWork";
import TaskAssigned from "./TaskAssigned";
import Comment from "./Comment";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import CustomEditor from "@/components/workspace/tasks/Editor";
import { redirect, useLoaderData } from "react-router";
import {
	Attachment,
	Comment as CommentSchema,
	Status,
	Task as TaskSchema,
} from "@/types/task";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AddAttachment from "@/components/workspace/tasks/AddAttachment";
import ShowOpenedAttachment from "@/components/workspace/tasks/ShowOpenedAttachment";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTask } from "@/hooks/customs/Tasks/useDeleteTask";
import AlertBox from "@/components/AlertBox";
import { useTaskUpdate } from "@/hooks/customs/useTaskUpdate";
import AddAssignee from "@/components/workspace/tasks/AddAssignee";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { WorkspaceMember } from "@/types/workspace";
import { useSocket } from "@/context/SocketContex";
import { taskApi } from "@/redux/services/taskApi";

const Task: React.FC = () => {
	// const socket = useSocket();

	// const dispatch = useDispatch<AppDispatch>();

	const loaderData = useLoaderData();
	const [_, setTrigger] = useState(0);
	const [status, setStatus] = useState(loaderData.status);
	const [priority, setPriority] = useState(loaderData.priority);
	const [assignees, setAssignees] = useState<string[]>(loaderData.assignees);
	const [attachments, setAttachments] = useState<Attachment[]>(
		loaderData.attachments
	);
	const [comments, setComments] = useState<CommentSchema[]>(
		loaderData.comments
	);

	const workspaceMembers = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);
	const [isAddAssignee, setIsAddAssignee] = useState<boolean>(false);
	const [openedAttachment, setOpenedAttachment] = useState<Attachment | null>(
		null
	);
	const [deletingTask, setDeletingTask] = useState<TaskSchema | null>(null);
	const [isAddAttachmentOpen, setIsAddAttachmentOpen] =
		useState<boolean>(false);

	const { handleTaskDelete } = useDeleteTask();
	const { handleUpdate } = useTaskUpdate();

	const handleDeleteTask = async () => {
		const response = await handleTaskDelete(deletingTask?._id!);
		if (response.success) {
			setDeletingTask(null);
			window.location.href = "/w/tasks";
		}
	};

	const handleTaskUpdate = async (data: any) => {
		const response = await handleUpdate(loaderData._id, data);
	};

	// const onStatusChange = (taskId: string, status: Status) => {
	// 	if (taskId === loaderData._id) {
	// 		setStatus(status);
	// 		// dispatch(
	// 		// 	taskApi.util.updateQueryData(
	// 		// 		"getTask",
	// 		// 		{ workspaceId: loaderData.workspace, taskId: loaderData._id },
	// 		// 		(draft) => {
	// 		// 			draft.data = { ...draft.data, status };
	// 		// 		}
	// 		// 	)
	// 		// );
	// 	}
	// };
	// const onPriorityChange = (taskId: string, priority: string) => {
	// 	if (taskId === loaderData._id) {
	// 		setPriority(priority);
	// 	}
	// 	// dispatch(
	// 	// 	taskApi.util.updateQueryData(
	// 	// 		"getTask",
	// 	// 		{
	// 	// 			taskId: loaderData._id,
	// 	// 			workspaceId: loaderData.workspace,
	// 	// 		},
	// 	// 		(draft) => {
	// 	// 			draft.data = { ...draft.data, priority };
	// 	// 		}
	// 	// 	)
	// 	// );
	// };
	// const onDescriptionChange = (taskId: string, description: string) => {
	// 	dispatch(
	// 		taskApi.util.updateQueryData(
	// 			"getTask",
	// 			{
	// 				taskId: loaderData._id,
	// 				workspaceId: loaderData.workspace,
	// 			},
	// 			(draft) => {
	// 				draft.data = { ...draft.data, description };
	// 			}
	// 		)
	// 	);
	// };
	// const onTitlechange = (taskId: string, title: string) => {
	// 	dispatch(
	// 		taskApi.util.updateQueryData(
	// 			"getTask",
	// 			{ taskId: loaderData._id, workspaceId: loaderData.workspace },
	// 			(draft) => {
	// 				draft.data = { ...draft.data, title };
	// 			}
	// 		)
	// 	);
	// };
	// const onNewCommentAdded = (taskId: string, comment: CommentSchema) => {
	// 	dispatch(
	// 		taskApi.util.updateQueryData(
	// 			"getTask",
	// 			{ taskId: loaderData._id, workspaceId: loaderData.workspace },
	// 			(draft) => {
	// 				draft.data = {
	// 					...draft.data,
	// 					comments: [...draft.data.comments, comment],
	// 				};
	// 			}
	// 		)
	// 	);
	// };
	// const onCommentDelete = (taskId: string, commentId: string) => {
	// 	dispatch(
	// 		taskApi.util.updateQueryData(
	// 			"getTask",
	// 			{ taskId: loaderData._id, workspaceId: loaderData.workspace },
	// 			(draft) => {
	// 				draft.data = {
	// 					...draft.data,
	// 					comments: draft.data.comments.filter(
	// 						(comment: CommentSchema) => comment._id !== commentId
	// 					),
	// 				};
	// 			}
	// 		)
	// 	);
	// };
	// const onNewAttachment = (taskId: string, attachment: Attachment) => {
	// 	dispatch(
	// 		taskApi.util.updateQueryData(
	// 			"getTask",
	// 			{ taskId: loaderData._id, workspaceId: loaderData.workspace },
	// 			(draft) => {
	// 				draft.data = {
	// 					...draft.data,
	// 					attachments: [...draft.data.attachments, attachment],
	// 				};
	// 			}
	// 		)
	// 	);
	// 	setTrigger(1);
	// };
	// const onAttachmentDelete = (taskId: string, attachmentId: string) => {
	// 	dispatch(
	// 		taskApi.util.updateQueryData(
	// 			"getTask",
	// 			{ taskId: loaderData._id, workspaceId: loaderData.workspace },
	// 			(draft) => {
	// 				draft.data = {
	// 					...draft.data,
	// 					attachments: draft.data.attachments.filter(
	// 						(attachment: Attachment) => attachment._id !== attachmentId
	// 					),
	// 				};
	// 			}
	// 		)
	// 	);
	// };

	const handleStatusChange = (
		event: CustomEvent<{ taskId: string; status: string }>
	) => {
		if (event.detail.taskId === loaderData._id) {
			setStatus(event.detail.status);
			setTrigger(1);
		}
	};

	const handlePriorityChange = (
		event: CustomEvent<{ taskId: string; priority: string }>
	) => {
		if (event.detail.taskId === loaderData._id) {
			setPriority(event.detail.priority);
			setTrigger(1);
		}
	};
	const handleDescriptionChange = (
		event: CustomEvent<{ taskId: string; description: string }>
	) => {
		setTrigger(1);
	};

	const handleTitleChange = (
		event: CustomEvent<{ taskId: string; title: string }>
	) => {
		if (event.detail.taskId === loaderData._id) {
			setTrigger(1);
		}
	};
	const handleNewComment = (
		event: CustomEvent<{ taskId: string; comment: CommentSchema }>
	) => {
		if (event.detail.taskId === loaderData._id) {
			setComments((prev) => [...prev, event.detail.comment]);
		}
	};
	const handleCommentDelete = (
		event: CustomEvent<{ taskId: string; commentId: string }>
	) => {
		if (event.detail.taskId === loaderData._id) {
			setComments((prev) =>
				prev.filter((comment) => comment._id !== event.detail.commentId)
			);
		}
	};
	const handleNewAttachment = (
		event: CustomEvent<{ taskId: string; attachment: Attachment[] }>
	) => {
		if (event.detail.taskId === loaderData._id) {
			setAttachments((prev) => [...prev, ...event.detail.attachment]);
		}
	};

	const handelAttachmentDelete = (
		event: CustomEvent<{ taskId: string; attachmentId: string }>
	) => {
		if (event.detail.taskId === loaderData._id) {
			setAttachments((prev) =>
				prev.filter(
					(attachment) => attachment._id !== event.detail.attachmentId
				)
			);
		}
	};

	useEffect(() => {
		window.addEventListener(
			"statusChange",
			handleStatusChange as EventListener
		);
		window.addEventListener(
			"descriptionChange",
			handleDescriptionChange as EventListener
		);
		window.addEventListener(
			"priorityChange",
			handlePriorityChange as EventListener
		);
		window.addEventListener("titleChange", handleTitleChange as EventListener);

		window.addEventListener(
			"attachmentDelete",
			handelAttachmentDelete as EventListener
		);
		window.addEventListener(
			"newAttachment",
			handleNewAttachment as EventListener
		);
		window.addEventListener(
			"commentDelete",
			handleCommentDelete as EventListener
		);
		window.addEventListener("newComment", handleNewComment as EventListener);

		return () => {
			window.removeEventListener(
				"statusChange",
				handleStatusChange as EventListener
			);
			window.removeEventListener(
				"descriptionChange",
				handleDescriptionChange as EventListener
			);
			window.removeEventListener(
				"priorityChange",
				handlePriorityChange as EventListener
			);
			window.removeEventListener(
				"titleChange",
				handleTitleChange as EventListener
			);

			window.removeEventListener(
				"attachmentDelete",
				handelAttachmentDelete as EventListener
			);
			window.removeEventListener(
				"newAttachment",
				handleNewAttachment as EventListener
			);
			window.removeEventListener(
				"commentDelete",
				handleCommentDelete as EventListener
			);
			window.removeEventListener(
				"newComment",
				handleNewComment as EventListener
			);
		};
	}, []);

	// useEffect(() => {
	// 	if (!socket) return;
	// 	socket.onmessage = (event) => {
	// 		const message = JSON.parse(event.data.toString());

	// 		switch (message.type) {
	// 			case TaskEvent.COMMENT_DELETED:
	// 				onCommentDelete(message.data.taskId, message.data.commentId);
	// 				break;

	// 			case TaskEvent.DELETE_ATTACHMENT:
	// 				onAttachmentDelete(message.data.taskId, message.data.attachmentId);

	// 				break;
	// 			case TaskEvent.NEW_ATTACHMENT:
	// 				onNewAttachment(message.data.taskId, message.data.attachment);
	// 				break;
	// 			case TaskEvent.TASK_DATE_CHANGED:
	// 				// TODO:THIS IS NOT IMPLEMENTED FOR NOW
	// 				break;
	// 			case TaskEvent.TASK_DESCRIPTION_CHANGED:
	// 				onDescriptionChange(message.data.taskId, message.data.description);
	// 				break;
	// 			case TaskEvent.TASK_PRIORITY_CHANGED:
	// 				onPriorityChange(message.data.taskId, message.data.priority);
	// 				break;
	// 			case TaskEvent.TASK_STATUS_CHANGED:
	// 				onStatusChange(message.data.taskId, message.data.status);
	// 				break;
	// 			case TaskEvent.TASK_TITLE_CHANGED:
	// 				onTitlechange(message.data.taskId, message.data.title);
	// 				break;
	// 			case TaskEvent.NEW_COMMENT:
	// 				onNewCommentAdded(message.data.taskId, message.data.comment);
	// 				break;
	// 		}
	// 	};
	// }, [socket]);

	return (
		<>
			{isAddAssignee && (
				<AddAssignee
					taskId={loaderData._id}
					assignedMembers={loaderData.assignees}
					onClose={() => setIsAddAssignee(false)}
					setAssignees={setAssignees}
				/>
			)}
			{openedAttachment && (
				<ShowOpenedAttachment
					attachment={openedAttachment}
					onClose={() => setOpenedAttachment(null)}
				/>
			)}
			{isAddAttachmentOpen && (
				<AddAttachment
					onClose={() => setIsAddAttachmentOpen(false)}
					taskId={loaderData._id}
				/>
			)}
			{deletingTask && (
				<AlertBox
					onClose={() => setDeletingTask(null)}
					onDelete={() => handleDeleteTask()}
				/>
			)}
			<div className="w-full h-full flex justify-end">
				<div className="w-full p-4 rounded-md overflow-y-auto scrollbar-hidden overflow-x-hidden">
					<div className="flex items-center justify-between border-b-2 py-2 pb-4 border-gray-700">
						<div className="flex items-center justify-end gap-2 flex-1">
							<Star
								size={16}
								type="icon"
								className="hover:scale-110 hover:cursor-pointer "
							/>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<EllipsisVertical
										type="icon"
										size={15}
										className="hover:scale-110 hover:cursor-pointer"
									/>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => setIsAddAssignee(true)}>
										<PlusCircle />
										Add Assignee
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setDeletingTask(loaderData)}>
										<Trash />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className="flex gap-8 mt-2 min-h-screen overflow-y-auto flex-wrap lg:flex-nowrap">
						<div className="mt-5 w-full">
							<h3 className="font-semibold text-xl">{loaderData.title}</h3>
							<div className="text-sm mt-6">
								<div className="mt-4 flex items-center justify-between">
									<div className="flex gap-2 items-center justify-center">
										<Clock4
											type="icon"
											size={16}
											className="text-gray-500"
										/>
										<span className="font-medium text-[0.8rem] text-gray-4  00">
											Created time
										</span>
									</div>
									<p className="font-medium text-[0.7rem] ">
										{new Date(loaderData.createdAt).toDateString()}
									</p>
								</div>
								<div className="mt-4 flex items-center justify-between">
									<div className="flex gap-2 items-center justify-center">
										<Loader
											type="icon"
											size={16}
											className="text-gray-500"
										/>
										<span className="font-medium text-[0.8rem] text-gray-4  00">
											Status
										</span>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger className="p-0 bg-inherit">
											<Badge
												variant="secondary"
												className={
													statusColors[
														loaderData.status as keyof typeof statusColors
													]
												}
											>
												{status}
											</Badge>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											{["Todo", "In-Progress", "Completed"].map(
												(statusElement: string) =>
													status !== statusElement && (
														<DropdownMenuItem
															key={statusElement}
															onClick={() => {
																handleTaskUpdate({ status: statusElement });
																setStatus(statusElement);
															}}
															className={
																statusColors[
																	statusElement as keyof typeof statusColors
																]
															}
														>
															{statusElement}
														</DropdownMenuItem>
													)
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								<div className="mt-4 flex items-center justify-between">
									<div className="flex gap-2 items-center justify-center">
										<CircleCheck
											type="icon"
											size={16}
											className="text-gray-500"
										/>
										<span className="font-medium text-[0.8rem] text-gray-4  00">
											Priority
										</span>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger className="p-0 bg-inherit">
											<Badge
												variant="secondary"
												className={
													priorityColors[
														priority as keyof typeof priorityColors
													]
												}
											>
												{priority}
											</Badge>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											{["Low", "High", "Medium", "Urgent"].map(
												(priorityElement: string) =>
													priority !== priorityElement && (
														<DropdownMenuItem
															key={priorityElement}
															onClick={() => {
																handleTaskUpdate({ priority: priorityElement });
																setPriority(priorityElement);
															}}
															className={
																priorityColors[
																	priorityElement as keyof typeof priorityColors
																]
															}
														>
															{priorityElement}
														</DropdownMenuItem>
													)
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								<div className="mt-4 flex items-center justify-between">
									<div className="flex gap-2 items-center justify-center">
										<Calendar
											type="icon"
											size={16}
											className="text-gray-500"
										/>
										<span className="font-medium text-[0.8rem] text-gray-4  00">
											Due Date
										</span>
									</div>
									<p className="font-medium text-[0.7rem] ">
										{new Date(loaderData.startDate).toDateString()} -{" "}
										{new Date(loaderData.dueDate).toDateString()}
									</p>
								</div>
								<div className="mt-4 flex items-center justify-between">
									<div className="flex gap-2 items-center justify-center">
										<Tag
											type="icon"
											size={16}
											className="text-gray-500"
										/>
										<span className="font-medium text-[0.8rem] text-gray-4  00">
											Tags
										</span>
									</div>
									<div className="flex gap-1 flex-wrap">
										{loaderData.tags.map((tag: string) => (
											<Badge key={tag}>{tag}k</Badge>
										))}
									</div>
								</div>
								<div className="mt-4 flex items-center justify-between">
									<div className="flex gap-2 items-center justify-center">
										<Users
											type="icon"
											size={16}
											className="text-gray-500"
										/>
										<span className="font-medium text-[0.8rem] text-gray-4  00">
											Assignees
										</span>
									</div>
									<div className="flex items-center">
										{assignees.map((assignee: String) =>
											workspaceMembers.map(
												(member) =>
													assignee === member._id && (
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger className="p-0 bg-inherit outline-none border-none">
																	<Avatar>
																		<AvatarImage src={member.user.avatar} />
																		<AvatarFallback>
																			{member.user.username.charAt(0)}
																		</AvatarFallback>
																	</Avatar>
																</TooltipTrigger>
																<TooltipContent>
																	<p>{member.user.email}</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													)
											)
										)}
									</div>
								</div>
							</div>
							<div className="mt-4 rounded-md shadow-md bg-slate-800 py-2 pl-3 pr-4">
								<strong className="text-sm font-medium">
									Task Description
								</strong>
								<p className="tracking-tighter text-slate-300 mt-1 font-light -leading-[2rem] text-[0.8rem]">
									{loaderData.description}
								</p>
							</div>
							<div className="attachments mt-6 space-y-16">
								<div className="flex items-center justify-between">
									<h3 className="font-medium text-lg tracking-tighter">
										Attachments
									</h3>
									<Plus
										type="icon"
										onClick={() => setIsAddAttachmentOpen(true)}
										className="hover:cursor-pointer"
									/>
								</div>
								<div className="flex items-center justify-center">
									{attachments.length < 1 ? (
										<div>No attachments yet.</div>
									) : (
										<Carousel
											opts={{
												align: "start",
											}}
											className="w-full max-w-sm h-full mt-4"
										>
											<CarouselContent>
												{attachments.map(
													(attachment: Attachment, index: number) => (
														<CarouselItem
															key={attachment._id}
															className="md:basis-2/3 lg:basis-1/3 hover:cursor-pointer"
															onDoubleClick={() =>
																setOpenedAttachment(attachment)
															}
														>
															<Card>
																<CardContent className="flex aspect-square items-center justify-center p-6">
																	<img
																		src={attachment.fileUrl}
																		className="w-full h-full object-cover"
																	/>
																</CardContent>
															</Card>
														</CarouselItem>
													)
												)}
											</CarouselContent>
											<CarouselPrevious />
											<CarouselNext />
										</Carousel>
									)}
								</div>
								<div className="relative overflow-auto scrollbar-hidden w-full mt-8 h-screen">
									<CustomEditor
										taskId={loaderData._id}
										initialContent={loaderData.taskEditorData}
									/>
								</div>
							</div>
						</div>
						<div className="mt-4 flex-1 min-h-screen h-screen">
							<div className="h-full w-full overflow-hidden overflow-y-scroll scrollbar-hidden">
								<Card className="bg-inherit h-full">
									<CardContent className="p-0">
										<Tabs defaultValue={"Activity"}>
											<TabsList className="w-full bg-inherit justify-start">
												<TabsTrigger
													className="bg-inherit"
													value="Activity"
												>
													Activity
												</TabsTrigger>
												<TabsTrigger
													className="bg-inherit"
													value="My Work"
												>
													My Work
												</TabsTrigger>
												<TabsTrigger
													className="bg-inherit"
													value="Assigned"
												>
													Assigned
												</TabsTrigger>

												<TabsTrigger
													className="bg-inherit"
													value="Comments"
												>
													Comments
												</TabsTrigger>
											</TabsList>
											<TabsContent value="Activity">
												<Activity
													todaysActivities={loaderData.todaysActivity}
													yesterdaysActivities={loaderData.yesterdaysActivity}
													pastsActivities={loaderData.pastsActivity}
												/>
											</TabsContent>
											<TabsContent value="My Work">
												<MyWork
													activities={[
														...loaderData.todaysActivity,
														...loaderData.yesterdaysActivity,
														...loaderData.pastsActivity,
													]}
													comments={comments}
												/>
											</TabsContent>
											<TabsContent value="Assigned">
												<TaskAssigned
													todaysActivities={loaderData.todaysActivity}
													yesterdaysActivities={loaderData.yesterdaysActivity}
													pastsActivities={loaderData.pastsActivity}
												/>
											</TabsContent>
											<TabsContent value="Comments">
												<Comment
													taskId={loaderData._id}
													comments={comments}
												/>
											</TabsContent>
										</Tabs>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Task;
