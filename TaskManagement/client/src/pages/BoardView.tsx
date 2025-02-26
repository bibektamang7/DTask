import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	MoreHorizontal,
	MessageSquare,
	Paperclip,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useGetTasksQuery } from "@/redux/services/taskApi";
import { useTask } from "@/hooks/customs/useTask";
interface Task {
	id: string;
	title: string;
	tag: string;
	date: string;
	comments: number;
	attachments: number;
	status: string;
}

const initialTasks: Task[] = [
	{
		id: "1",
		title: "Task 1",
		status: "todo",
		tag: "Bug",
		date: "2024-02-24",
		comments: 2,
		attachments: 1,
	},
	{
		id: "2",
		title: "Task 2",
		status: "inProgress",
		tag: "Feature",
		date: "2024-02-24",
		comments: 3,
		attachments: 0,
	},
	{
		id: "3",
		title: "Task 3",
		status: "completed",
		tag: "Update",
		date: "2024-02-24",
		comments: 1,
		attachments: 2,
	},
];

function TaskCard({
	task,
	onDragStart,
	draggedTask,
}: {
	task: Task;
	onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
	draggedTask: Task | null;
}) {
	const isDragging = draggedTask?.id === task.id;

	return (
		<Card
			className={`mb-4 cursor-grab transition-all duration-200 ease-in-out ${
				isDragging ? "opacity-50 scale-105 shadow-lg" : ""
			}`}
			draggable
			onDragStart={(e) => onDragStart(e, task)}
		>
			<CardContent className="p-4">
				<div className="flex items-start justify-between">
					<span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-500">
						{task.tag}
					</span>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
					>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</div>
				<h3 className="mt-2 font-medium">{task.title}</h3>
				<div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
					<span>{task.date}</span>
					<div className="flex items-center gap-2">
						<div className="flex items-center">
							<MessageSquare className="h-4 w-4 mr-1" />
							{task.comments}
						</div>
						<div className="flex items-center">
							<Paperclip className="h-4 w-4 mr-1" />
							{task.attachments}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}


export default function BoardView() {
	const {tasksData, isLoading} = useTask()
	console.log(tasksData);
	console.log(isLoading);
	
	
	const [tasks, setTasks] = useState(initialTasks);
	const [draggedTask, setDraggedTask] = useState<Task | null>(null);


	const onDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
		e.dataTransfer.setData("text/plain", task.id); // Store task ID in event
		setDraggedTask(task);
	};

	const onDrop = (status: Task["status"]) => {
		if (draggedTask) {
			setTasks((prev) =>
				prev.map((task) =>
					task.id === draggedTask.id ? { ...task, status } : task
				)
			);
			setDraggedTask(null);
		}
	};
	if(isLoading) {
		return <div>Loading...</div>
	}
	useEffect(() => {
		if(tasksData) {
			setTasks(tasksData);
		}
	})
	return (
		<main className="p-8 w-full">
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
				{["Todo", "In-Progress", "Completed"].map((status) => (
					<div
						key={status}
						className="space-y-4"
						onDragOver={(e) => e.preventDefault()} // Allow drop
						onDrop={() => onDrop(status as Task["status"])}
					>
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold flex items-center">
								<span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
								{status}
							</h2>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
							>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</div>
						<div className="bg-muted/50 rounded-lg p-4 min-h-[600px]">
							{tasks.length > 0 ? tasks.filter((task) => task.status === status).map((task) => (
								<TaskCard
									draggedTask={draggedTask}
									onDragStart={onDragStart}
									key={task.id}
									task={task}
								/>
							)) : <p className="text-center text-sm ">No {status} tasks yet</p>}
						</div>
					</div>
				))}
			</div>
		</main>
	);
}
