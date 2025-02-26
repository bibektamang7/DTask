import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PencilIcon, Quote } from "lucide-react";
import { useGetWorkspaceQuery } from "@/redux/services/workspaceApi";
import { useNavigate } from "react-router";
import { useWorkspace } from "@/hooks/customs/useWorkspace";

// const teamMembers = [
// 	{ name: "Bipin Tamang", image: "/placeholder.svg" },
// 	{ name: "John Doe", image: "/placeholder.svg" },
// 	{ name: "Jane Smith", image: "/placeholder.svg" },
// ];

type TaskOptionProp = "Todo" | "In Progress" | "Completed";

export default function DashboardPage() {
	const { workspaceData, isLoading } = useWorkspace();

	if (isLoading) return <>Loading...</>;

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
	const [teamMembers, setTeamMembers] = useState<any[]>([]);
	const [quoteOfTheDay, setQuoteOfTheDay] = useState<string>("");

	useEffect(() => {
		if (workspaceData) {
			// setCompletedTasks(workspaceData.completedTasks || []);
			// setOverdueTasks(workspaceData.overdueTasks || []);
			// setUpcomingTasks(workspaceData.upcomingTasks || []);

			const sevenDaysAgo = new Date();
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

			// const recentTasksList = workspaceData.tasks.filter((task: any) => {
			// 	const createdAt = new Date(task.createdAt);
			// 	return createdAt >= sevenDaysAgo;
			// });

			// setRecentTasks(recentTasksList);
		}
	}, [workspaceData]);
	const selectedTasks =
		taskOption === "Completed"
			? completedTasks
			: taskOption === "Todo"
			? todoTasks
			: inProgressTasks;

	return (
		<main className="relative lg:flex lg:flex-1">
			<div className="w-full">
				<div className="container mx-auto p-4 md:p-8 space-y-8">
					<div>
						<div className="text-muted-foreground">{formattedDate}</div>
						<h1 className="text-3xl md:text-4xl font-medium line-clamp-1">
							<span className="text-muted-foreground">Good Morning,</span>{" "}
							<span>{workspaceData.owner.username}</span>
						</h1>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<Card className="lg:col-span-2">
							<CardContent className="p-6">
								<div className="flex items-center gap-2 mb-4">
									<PencilIcon className="h-6 w-6 text-yellow-500" />
									<h2 className="text-xl font-semibold">To do list</h2>
								</div>
								<Button
									variant="ghost"
									className="w-full justify-start text-muted-foreground mb-4"
								>
									+ click to add
								</Button>
								<div className="space-y-3">
									<div className="flex items-start gap-2">
										<input
											type="checkbox"
											id="task1"
										/>
										<label
											htmlFor="task1"
											className="text-sm leading-none"
										>
											Finish making this application
										</label>
									</div>
									<div className="flex items-start gap-2">
										<input
											type="checkbox"
											id="task2"
										/>
										<label
											htmlFor="task2"
											className="text-sm leading-none"
										>
											Have dinner before 8
										</label>
									</div>
									<div className="flex items-start gap-2">
										<input
											type="checkbox"
											id="task3"
										/>
										<label
											htmlFor="task3"
											className="text-sm leading-none"
										>
											Finish making this application
										</label>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-lg font-semibold">Quote of the day</h2>
									<Button
										variant="ghost"
										className="text-blue-500 hover:text-blue-600"
									>
										View
									</Button>
								</div>
								<p className="text-muted-foreground text-sm">
									<Quote>{quoteOfTheDay}</Quote>
								</p>
							</CardContent>
						</Card>
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
										selectedTasks.map((item) => (
											<div
												key={item}
												className="flex items-center gap-4 p-4 bg-muted rounded-lg"
											>
												<div className="h-10 w-10 bg-muted-foreground/20 rounded-full" />
												<div className="text-sm">
													New ideas for developments
												</div>
											</div>
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
								View All
							</Button>
						</div>
						<div className="space-y-4">
							{recentTasks.length > 0 ? (
								recentTasks.map((task) => (
									<div className="h-32 bg-muted rounded-lg" />
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
							{teamMembers.length > 0 ? (
								teamMembers.map((member, index) => (
									<div
										key={index}
										className="flex items-center gap-3"
									>
										<Avatar>
											<AvatarImage
												src={member.avatar}
												alt={member.username}
											/>
											<AvatarFallback>{member.username}</AvatarFallback>
										</Avatar>
										<div className="text-sm">{member.username}</div>
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
}
