import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { priorityColors, statusColors } from "@/constants";
import Activity from "@/pages/Tasks/Activity";
import Comment from "@/pages/Tasks/Comment";
import MyWork from "@/pages/Tasks/MyWork";
import TaskAssigned from "@/pages/Tasks/TaskAssigned";
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
import React, { useState } from "react";
import { Link } from "react-router";

interface TaskProps {
	onClose: any;
}
type TaskOptions = "Activity" | "My Work" | "Assigned" | "Comments";
const Task: React.FC<TaskProps> = ({ onClose }) => {
	const [taskOptions, setTaskOptions] = useState<TaskOptions>("Activity");
	return (
		<section className="fixed top-0 left-0 px-8 py-4 w-screen h-screen min-h-screen backdrop-blur-sm z-20">
			<div className="w-full h-full flex justify-end">
				<div className="lg:w-[35%] w-full sm:w-[70%] bg-gray-900 p-4 rounded-md overflow-y-auto scrollbar-hidden overflow-x-hidden">
					<div className="flex items-center justify-between border-b-2 pb-4 border-gray-700">
						<Link
							to={``}
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
						<h3 className="font-medium text-lg">Design Homepage Wireframe</h3>
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
									September 20, 2024 10:30 AM
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
									Completed
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
									Urgent
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
									Octaber 2, 2024 - Octaber 13, 2024
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
								<Badge>Task</Badge>
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
								<div>
									<Avatar className="">
										<AvatarImage src="" />
										<AvatarFallback>B</AvatarFallback>
									</Avatar>
								</div>
							</div>
						</div>
						<div className="mt-4 rounded-md shadow-md bg-slate-800 py-2 pl-3 pr-4">
							<strong className="text-sm font-medium">Task Description</strong>
							<p className="tracking-tighter text-slate-300 mt-1 font-light -leading-[2rem] text-[0.8rem]">
								This is task management system and I'm tyring to build robust
								task management system that everyone can use without making any
								extra effors.
							</p>
						</div>
					</div>
					<div className="mt-4">
						<div>
							<Card className="bg-inherit">
								<CardContent className="p-0">
									<Tabs defaultValue={taskOptions}>
										<TabsList className="w-full bg-inherit justify-start">
											<TabsTrigger
												className="bg-inherit"
												value="Activity"
												onClick={() => setTaskOptions("Activity")}
											>
												Activity
											</TabsTrigger>
											<TabsTrigger
												className="bg-inherit"
												value="My Work"
												onClick={() => setTaskOptions("My Work")}
											>
												My Work
											</TabsTrigger>
											<TabsTrigger
												className="bg-inherit"
												value="Assigned"
												onClick={() => setTaskOptions("Assigned")}
											>
												Assigned
											</TabsTrigger>

											<TabsTrigger
												className="bg-inherit"
												value="Comments"
												onClick={() => setTaskOptions("Comments")}
											>
												Comments
											</TabsTrigger>
										</TabsList>
										<TabsContent value={taskOptions}>
											{taskOptions === "Activity" ? (
												<Activity />
											) : taskOptions === "My Work" ? (
												<MyWork />
											) : taskOptions === "Assigned" ? (
												<TaskAssigned />
											) : (
												<Comment />
											)}
										</TabsContent>
									</Tabs>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Task;
