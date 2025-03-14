import { Badge } from "@/components/ui/badge";
import { priorityColors, statusColors } from "@/constants";
import { RootState } from "@/redux/store";
import { WorkspaceMember } from "@/types/workspace";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
	Calendar,
	CircleCheck,
	Clock4,
	EllipsisVertical,
	Loader,
	Maximize2,
	Star,
	Tag,
	Users,
} from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

interface TaskProps {
	onClose: any;
	taskId: string;
}
const Task: React.FC<TaskProps> = ({ onClose, taskId }) => {
	const task = useSelector((state: RootState) => state.Tasks.tasks).find(
		(task) => task._id === taskId
	);
	const taskRef = useRef<HTMLDivElement>(null);
	const handleClickOutside = useCallback(function handleClickOutside(e: any) {
		if (taskRef.current && !taskRef.current.contains(e.target)) {
			onClose();
		}
	}, []);
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleClickOutside]);

	return (
		<section className="fixed top-0 left-0 px-8 py-4 w-screen h-screen min-h-screen backdrop-blur-sm z-20">
			<div className="w-full h-full flex justify-end">
				<div
					ref={taskRef}
					className="lg:w-[35%] w-full sm:w-[70%] bg-gray-900 p-4 rounded-md overflow-y-auto scrollbar-hidden overflow-x-hidden"
				>
					<div className="flex items-center justify-between border-b-2 pb-4 border-gray-700">
						<Link
							to={`/w/task/${taskId}`}
							className="hover:scale-110 hover:text-white"
						>
							<Maximize2
								className="rotate-90"
								size={16}
							/>
						</Link>
						{/* <span
							onClick={onClose}
							className="hover:cursor-pointer hover:scale-110 text-sm text-slate-300"
						>
							X
						</span> */}
						<div className="flex items-center justify-center gap-2">
							<Star
								size={16}
								type="icon"
								className="hover:scale-110 hover:cursor-pointer "
							/>
							<EllipsisVertical
								type="icon"
								size={15}
								className="hover:scale-110 hover:cursor-pointer"
							/>
						</div>
					</div>
					<div className="mt-5">
						<h3 className="font-medium text-lg">{task?.title}</h3>
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
									{new Date(task?.createdAt!).toDateString()}
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
								<Badge
									variant="secondary"
									className={
										statusColors["Completed" as keyof typeof statusColors]
									}
								>
									{task?.status}
								</Badge>
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
								<Badge
									variant="secondary"
									className={priorityColors["Urgent"]}
								>
									{task?.priority}
								</Badge>
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
									{new Date(task?.startDate!).toDateString()} -{" "}
									{new Date(task?.dueDate!).toDateString()}
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
								{task?.tags.map((tag: string) => (
									<Badge key={tag}>{tag}</Badge>
								))}
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
								<div className="flex -gap-2">
									{task?.assignees.map((assignee: WorkspaceMember) => (
										<Avatar key={assignee._id}>
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
						</div>
						<div className="mt-4 rounded-md shadow-md bg-slate-800 py-2 pl-3 pr-4">
							<strong className="text-sm font-medium">Task Description</strong>
							<p className="tracking-tighter text-slate-300 mt-1 font-light -leading-[2rem] text-[0.8rem]">
								{task?.description}
							</p>
						</div>
					</div>
					{/* <div className="mt-4">
						<div>
							<Card className="bg-inherit">
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
											<Activity />
										</TabsContent>
										<TabsContent value="My Work">
											<MyWork />
										</TabsContent>
										<TabsContent value="Assigned">
											<TaskAssigned />
										</TabsContent>
										<TabsContent value="Comments">
											<Comment />
										</TabsContent>
									</Tabs>
								</CardContent>
							</Card>
						</div>
					</div> */}
				</div>
			</div>
		</section>
	);
};

export default Task;
