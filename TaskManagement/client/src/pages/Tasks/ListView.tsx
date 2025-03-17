import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
	Search,
	Filter,
	SortAsc,
	MoreVertical,
	Paperclip,
	MessageSquare,
	Trash,
} from "lucide-react";
import { useTask } from "@/hooks/customs/useTask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Task } from "@/types/task";
import { useOutletContext } from "react-router";
import { statusColors, priorityColors } from "@/constants";
import Loader from "@/components/Loader";
import AlertBox from "@/components/AlertBox";
import { useDeleteTask } from "@/hooks/customs/Tasks/useDeleteTask";

export function ListView() {
	const [setTaskId]: [setTaskId: React.Dispatch<React.SetStateAction<string>>] =
		useOutletContext();
	const { taskData, isLoading } = useTask();
	const [tasks, setTasks] = React.useState<Task[]>([]);
	const [search, setSearch] = React.useState("");
	const [statusFilter, setStatusFilter] = React.useState<string>("all");
	const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
	const [sortBy, setSortBy] = React.useState<string>("dueDate");

	const [deletingTask, setDeletingTask] = useState<Task | null>(null);

	const { handleTaskDelete, deleteTaskLoading } = useDeleteTask();

	const filteredTasks = React.useMemo(() => {
		return tasks
			.filter((task: Task) => {
				const matchesSearch = task.title
					.toLowerCase()
					.includes(search.toLowerCase());
				const matchesStatus =
					statusFilter === "all" || task.status === statusFilter;
				const matchesPriority =
					priorityFilter === "all" || task.priority === priorityFilter;
				return matchesSearch && matchesStatus && matchesPriority;
			})
			.sort((a, b) => {
				if (sortBy === "dueDate") {
					return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
				}
				if (sortBy === "priority") {
					const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
					return (
						priorityOrder[a.priority as keyof typeof priorityOrder] -
						priorityOrder[b.priority as keyof typeof priorityOrder]
					);
				}
				return 0;
			});
	}, [tasks, search, statusFilter, priorityFilter, sortBy]);

	const handleDeleteTask = async () => {
		const response = await handleTaskDelete(deletingTask?._id!);
		if (response.success) {
			setDeletingTask(null);
		}
	};

	useEffect(() => {
		if (taskData) {
			setTasks(taskData);
		}
	}, [taskData]);

	if (isLoading) {
		return <Loader />;
	}
	return (
		<>
			{deletingTask && (
				<AlertBox
					onClose={() => setDeletingTask(null)}
					onDelete={() => handleDeleteTask()}
				/>
			)}
			<div className="w-full max-w-7xl mx-auto space-y-6 z-0">
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
					<div className="flex-1 w-full sm:max-w-sm">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								placeholder="Search tasks..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-9"
							/>
						</div>
					</div>
					<div className="flex flex-wrap gap-2 items-center">
						<Select
							value={statusFilter}
							onValueChange={setStatusFilter}
						>
							<SelectTrigger className="w-[130px]">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="Todo">Todo</SelectItem>
								<SelectItem value="In-Progress">In Progress</SelectItem>
								<SelectItem value="Done">Done</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={priorityFilter}
							onValueChange={setPriorityFilter}
						>
							<SelectTrigger className="w-[130px]">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Priority" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Priority</SelectItem>
								<SelectItem value="Urgent">Urgent</SelectItem>
								<SelectItem value="High">High</SelectItem>
								<SelectItem value="Medium">Medium</SelectItem>
								<SelectItem value="Low">Low</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={sortBy}
							onValueChange={setSortBy}
						>
							<SelectTrigger className="w-[130px]">
								<SortAsc className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="dueDate">Due Date</SelectItem>
								<SelectItem value="priority">Priority</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="grid gap-4">
					{filteredTasks.map((task: Task) => (
						<Card key={task._id}>
							<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
								<div className="space-y-1 flex flex-col items-start justify-start gap-4">
									<h3
										onClick={() => setTaskId(task._id)}
										className="hover:cursor-pointer font-semibold text-lg leading-none tracking-tight"
									>
										{task.title}
									</h3>
									<div className="flex flex-wrap items-center gap-2">
										{task.tags.map((tag) => (
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
										<DropdownMenuItem onClick={() => setDeletingTask(task)}>
											<Trash />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground line-clamp-2 mt-2">
									{task.description}
								</p>
							</CardContent>
							<CardFooter className="flex flex-wrap gap-4 items-center justify-between">
								<div className="flex items-center gap-4">
									<Badge
										variant="secondary"
										className={
											statusColors[task.status as keyof typeof statusColors]
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
										<span className="text-sm">{task.attachments.length}</span>
									</div>
									<div className="flex items-center gap-1 text-muted-foreground">
										<MessageSquare className="h-4 w-4" />
										<span className="text-sm">{task.comments.length}</span>
									</div>
									<div className="flex -space-x-2">
										{task.assignees.map((assignee) => (
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
										))}
									</div>
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</>
	);
}
