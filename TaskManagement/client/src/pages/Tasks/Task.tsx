import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { priorityColors, statusColors } from "@/constants";
import {
	Calendar,
	CircleCheck,
	Clock4,
	EllipsisVertical,
	Loader,
	Star,
	Tag,
	Users,
} from "lucide-react";
import React from "react";
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
import { useLoaderData } from "react-router";
import { WorkspaceMember } from "@/types/workspace";
import { Attachment } from "@/types/task";
const Task: React.FC = () => {
	const loaderData = useLoaderData();
	console.log(loaderData);

	return (
		<div className="w-full h-full flex justify-end">
			<div className="w-full p-4 rounded-md overflow-y-auto scrollbar-hidden overflow-x-hidden">
				<div className="flex items-center justify-between border-b-2 pb-4 border-gray-700">
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
				<div className="flex gap-8 mt-2 min-h-screen overflow-y-auto">
					<div className="mt-5 w-full">
						<h3 className="font-semibold text-xl">
							{loaderData.title}Wireframe
						</h3>
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
								<Badge
									variant="secondary"
									className={
										statusColors[loaderData.status as keyof typeof statusColors]
									}
								>
									{loaderData.status}
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
									className={
										priorityColors[
											loaderData.priority as keyof typeof priorityColors
										]
									}
								>
									{loaderData.priority}
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
										<Badge>{tag}k</Badge>
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
								<div>
									{loaderData.assignees.map((assignee: WorkspaceMember) => (
										<Avatar>
											<AvatarImage src={assignee.user.avatar} />
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
								{loaderData.description}
							</p>
						</div>
						<div className="attachments mt-6">
							<h3 className="font-medium text-lg tracking-tighter">
								Attachments
							</h3>
							<div className="flex items-center justify-center">
								{loaderData.attachments.length < 1 ? (
									<div>No attachments yet.</div>
								) : (
									<Carousel
										opts={{
											align: "start",
										}}
										className="w-full max-w-sm h-full mt-4"
									>
										<CarouselContent>
											{loaderData.attachments.map(
												(attachment: Attachment, index: number) => (
													<CarouselItem
														key={attachment._id}
														className="md:basis-2/3 lg:basis-1/3"
													>
														<div className="p-1">
															<Card>
																<CardContent className="flex aspect-square items-center justify-center p-6">
																	<span className="text-3xl font-semibold">
																		{index + 1}
																	</span>
																</CardContent>
															</Card>
														</div>
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
								<CustomEditor />
							</div>
						</div>
					</div>
					<div className="mt-4 flex-1 min-h-screen h-screen">
						<div className="h-full w-full">
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
												comments={loaderData.comments}
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
											<Comment comments={loaderData.comments} />
										</TabsContent>
									</Tabs>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Task;
