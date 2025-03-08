import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, MessageSquare, Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import { useTask } from "@/hooks/customs/useTask";
import { Task } from "@/types/task";
import { useOutletContext } from "react-router";
import { useTaskUpdate } from "@/hooks/customs/useTaskUpdate";

interface TaskCardProps {
	onTaskClick: any;
	task: Task;
	onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
	draggedTask: Task | null;
}

const TaskCard: React.FC<TaskCardProps> = ({
	onTaskClick,
	task,
	onDragStart,
	draggedTask,
}) => {
	const isDragging = draggedTask?._id === task._id;

	return (
		<Card
			onClick={onTaskClick}
			className={`mb-4 cursor-grab transition-all duration-200 ease-in-out ${
				isDragging ? "opacity-50 scale-105 shadow-lg" : ""
			}`}
			draggable
			onDragStart={(e) => onDragStart(e, task)}
		>
			<CardContent className="p-4">
				<div className="flex items-start justify-between">
					<div>
						{task.tags.map((tag) => (
							<span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-500">
								{tag}
							</span>
						))}
					</div>
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
					<span>{new Date(task.dueDate).toDateString().toString()}</span>
					<div className="flex items-center gap-2">
						<div className="flex items-center">
							<MessageSquare className="h-4 w-4 mr-1" />
							{task.comments.length}
						</div>
						<div className="flex items-center">
							<Paperclip className="h-4 w-4 mr-1" />
							{task.attachments.length}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const BoardView = () => {
	const [setTaskId]: [setTaskId: React.Dispatch<React.SetStateAction<string>>] =
		useOutletContext();
	const { taskData, isLoading } = useTask();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [draggedTask, setDraggedTask] = useState<Task | null>(null);
	const { handleUpdate } = useTaskUpdate();

	const handleTaskUpdate = async (taskId: string, taskUpdateInfo: any) => {
		await handleUpdate(taskId, taskUpdateInfo);
	};

	useEffect(() => {
		if (taskData) {
			setTasks(taskData);
		}
	}, [taskData]);

	const onDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
		e.dataTransfer.setData("text/plain", task._id);
		setDraggedTask(task);
	};

	const onDrop = (status: Task["status"]) => {
		if (draggedTask) {
			setTasks((prev) =>
				prev.map((task) => {
					if (task._id === draggedTask._id) {
						const newTask = { ...task, status };
						console.log(newTask);
						return newTask;
					}
					return task;
				})
			);
			handleTaskUpdate(draggedTask._id, { status });
			setDraggedTask(null);
		}
	};
	if (isLoading) {
		return <div>Loading...</div>;
	}
	useEffect(() => {
		if (taskData) {
			setTasks(taskData);
		}
	}, []);
	return (
		<main className="p-8 w-full">
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
				{["Todo", "In-Progress", "Completed"].map((status) => (
					<div
						key={status}
						className="space-y-4"
						onDragOver={(e) => e.preventDefault()}
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
						<div className="bg-muted/50 rounded-lg p-4 min-h-[600px] h-full">
							{tasks.length > 0 ? (
								tasks
									.filter((task) => task.status === status)
									.map((task) => (
										<TaskCard
											onTaskClick={() => setTaskId(task._id)}
											draggedTask={draggedTask}
											onDragStart={onDragStart}
											key={task._id}
											task={task}
										/>
									))
							) : (
								<p className="text-center text-sm ">No {status} tasks yet</p>
							)}
						</div>
					</div>
				))}
			</div>
		</main>
	);
};

export default BoardView;
