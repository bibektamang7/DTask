import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ArrowRight,
	Bell,
	Calendar,
	CheckSquare,
	MessageSquare,
	Search,
	Users,
} from "lucide-react";
import { Link } from "react-router";

const Feature = () => (
	<div className="flex flex-col  min-h-screen ">
		<main className="flex-1">
			<section className="w-full mt-6 border-b py-4 ">
				<div className="container px-4">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2 w-[80%]">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gradient">
								Powerful Features for Seamless Productivity
							</h1>
							<p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								TaskMaster combines powerful task management, real-time
								communication, and smart notifications to help your team stay
								organized and productive.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="w-full py-12 ">
				<div className="container px-4 md:px-6">
					<Tabs
						defaultValue="tasks"
						className="w-full">
						<div className="flex justify-center mb-8">
							<TabsList className="grid w-full max-w-md grid-cols-3">
								<TabsTrigger
									value="tasks"
									className="data-[state=active]:bg-black data-[state=active]:text-white">
									<CheckSquare className="h-4 w-4 mr-2" />
									Tasks
								</TabsTrigger>
								<TabsTrigger
									value="chat"
									className="data-[state=active]:bg-black data-[state=active]:text-white">
									<MessageSquare className="h-4 w-4 mr-2" />
									Chat
								</TabsTrigger>
								<TabsTrigger
									value="notifications"
									className="data-[state=active]:bg-black data-[state=active]:text-white">
									<Bell className="h-4 w-4 mr-2" />
									Notifications
								</TabsTrigger>
							</TabsList>
						</div>

						{/* Tasks Feature */}
						<TabsContent
							value="tasks"
							className="mt-0">
							<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
								<div className="space-y-4">
									<h2 className="text-3xl font-bold tracking-tighter">
										Intuitive Task Management
									</h2>
									<p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
										Create, assign, and track tasks with ease. Our intuitive
										interface makes it simple to organize work and keep projects
										on track.
									</p>
									<ul className="space-y-2">
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>
												Customizable task boards with drag-and-drop
												functionality
											</span>
										</li>
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>
												Task dependencies and subtasks for complex projects
											</span>
										</li>
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>Priority levels and deadline tracking</span>
										</li>
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>Custom fields and task templates</span>
										</li>
									</ul>
								</div>
								<div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
									<div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center">
										<div className="flex space-x-1">
											<div className="h-3 w-3 rounded-full bg-gray-300"></div>
											<div className="h-3 w-3 rounded-full bg-gray-300"></div>
											<div className="h-3 w-3 rounded-full bg-gray-300"></div>
										</div>
										<div className="mx-auto font-medium text-sm">
											Project Dashboard
										</div>
									</div>
									<div className="p-4">
										<div className="flex justify-between items-center mb-4">
											<h3 className="font-semibold">Marketing Campaign</h3>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													className="h-8">
													<Search className="h-4 w-4 mr-1" />
													Filter
												</Button>
												<Button
													size="sm"
													className="h-8 bg-black text-white hover:bg-gray-800">
													+ New Task
												</Button>
											</div>
										</div>
										<div className="grid grid-cols-3 gap-4">
											<div className="space-y-2">
												<div className="bg-gray-100 p-2 rounded-md font-medium text-sm">
													To Do (3)
												</div>
												<Card className="border-l-4 border-l-gray-400">
													<CardHeader className="p-3">
														<CardTitle className="text-sm">
															Create social media posts
														</CardTitle>
														<CardDescription className="text-xs">
															Due in 2 days
														</CardDescription>
													</CardHeader>
													<CardFooter className="p-3 pt-0 flex justify-between">
														<div className="flex items-center text-xs text-gray-500">
															<CheckSquare className="h-3 w-3 mr-1" />
															<span>0/3</span>
														</div>
														<div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
															JD
														</div>
													</CardFooter>
												</Card>
												<Card className="border-l-4 border-l-red-400">
													<CardHeader className="p-3">
														<CardTitle className="text-sm">
															Design email template
														</CardTitle>
														<CardDescription className="text-xs">
															High priority
														</CardDescription>
													</CardHeader>
													<CardFooter className="p-3 pt-0 flex justify-between">
														<div className="flex items-center text-xs text-gray-500">
															<Calendar className="h-3 w-3 mr-1" />
															<span>Tomorrow</span>
														</div>
														<div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
															AS
														</div>
													</CardFooter>
												</Card>
											</div>
											<div className="space-y-2">
												<div className="bg-gray-100 p-2 rounded-md font-medium text-sm">
													In Progress (2)
												</div>
												<Card className="border-l-4 border-l-yellow-400">
													<CardHeader className="p-3">
														<CardTitle className="text-sm">
															Create campaign strategy
														</CardTitle>
														<CardDescription className="text-xs">
															Medium priority
														</CardDescription>
													</CardHeader>
													<CardFooter className="p-3 pt-0 flex justify-between">
														<div className="flex items-center text-xs text-gray-500">
															<CheckSquare className="h-3 w-3 mr-1" />
															<span>2/5</span>
														</div>
														<div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
															TK
														</div>
													</CardFooter>
												</Card>
												<Card className="border-l-4 border-l-yellow-400">
													<CardHeader className="p-3">
														<CardTitle className="text-sm">
															Competitor research
														</CardTitle>
														<CardDescription className="text-xs">
															Medium priority
														</CardDescription>
													</CardHeader>
													<CardFooter className="p-3 pt-0 flex justify-between">
														<div className="flex items-center text-xs text-gray-500">
															<Users className="h-3 w-3 mr-1" />
															<span>2 assignees</span>
														</div>
														<div className="flex -space-x-1">
															<div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
																RM
															</div>
															<div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
																JL
															</div>
														</div>
													</CardFooter>
												</Card>
											</div>
											<div className="space-y-2">
												<div className="bg-gray-100 p-2 rounded-md font-medium text-sm">
													Completed (2)
												</div>
												<Card className="border-l-4 border-l-green-400 opacity-75">
													<CardHeader className="p-3">
														<CardTitle className="text-sm">
															Define target audience
														</CardTitle>
														<CardDescription className="text-xs">
															Completed yesterday
														</CardDescription>
													</CardHeader>
													<CardFooter className="p-3 pt-0 flex justify-between">
														<div className="flex items-center text-xs text-gray-500">
															<CheckSquare className="h-3 w-3 mr-1" />
															<span>5/5</span>
														</div>
														<div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
															MJ
														</div>
													</CardFooter>
												</Card>
												<Card className="border-l-4 border-l-green-400 opacity-75">
													<CardHeader className="p-3">
														<CardTitle className="text-sm">
															Budget approval
														</CardTitle>
														<CardDescription className="text-xs">
															Completed 2 days ago
														</CardDescription>
													</CardHeader>
													<CardFooter className="p-3 pt-0 flex justify-between">
														<div className="flex items-center text-xs text-gray-500">
															<Users className="h-3 w-3 mr-1" />
															<span>Team</span>
														</div>
														<div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
															+3
														</div>
													</CardFooter>
												</Card>
											</div>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						{/* Chat Feature */}
						<TabsContent
							value="chat"
							className="mt-0">
							<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
								<div className="space-y-4">
									<h2 className="text-3xl font-bold tracking-tighter">
										Real-time Team Chat
									</h2>
									<p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
										Communicate with your team in real-time. Discuss tasks,
										share files, and keep everyone in the loop.
									</p>
									<ul className="space-y-2">
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>Team channels and direct messaging</span>
										</li>
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>File sharing and rich media support</span>
										</li>
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>Message threading and reactions</span>
										</li>
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>Search and message history</span>
										</li>
									</ul>
								</div>
								<div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
									<div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
												M
											</div>
											<div>
												<div className="font-medium text-sm">
													Marketing Team
												</div>
												<div className="text-xs text-gray-500">5 members</div>
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0">
											<Search className="h-4 w-4" />
										</Button>
									</div>
									<div className="p-4 h-[350px] flex flex-col">
										<div className="flex-1 space-y-4 overflow-y-auto">
											<div className="flex gap-2">
												<div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs">
													JD
												</div>
												<div>
													<div className="flex items-center gap-2">
														<span className="font-medium text-sm">
															Jane Doe
														</span>
														<span className="text-xs text-gray-500">
															10:30 AM
														</span>
													</div>
													<div className="bg-gray-100 p-2 rounded-md mt-1 text-sm">
														Hey team, I've just uploaded the new campaign assets
														to the shared folder.
													</div>
												</div>
											</div>
											<div className="flex gap-2">
												<div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs">
													TK
												</div>
												<div>
													<div className="flex items-center gap-2">
														<span className="font-medium text-sm">Tom Kim</span>
														<span className="text-xs text-gray-500">
															10:32 AM
														</span>
													</div>
													<div className="bg-gray-100 p-2 rounded-md mt-1 text-sm">
														Thanks Jane! I'll take a look and provide feedback
														by EOD.
													</div>
												</div>
											</div>
											<div className="flex gap-2">
												<div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs">
													AS
												</div>
												<div>
													<div className="flex items-center gap-2">
														<span className="font-medium text-sm">
															Alex Smith
														</span>
														<span className="text-xs text-gray-500">
															10:35 AM
														</span>
													</div>
													<div className="bg-gray-100 p-2 rounded-md mt-1 text-sm">
														@Jane Can you also share the copy for the email
														template? I need to start working on the design.
													</div>
												</div>
											</div>
											<div className="flex gap-2 justify-end">
												<div>
													<div className="flex items-center justify-end gap-2">
														<span className="text-xs text-gray-500">
															10:36 AM
														</span>
														<span className="font-medium text-sm">You</span>
													</div>
													<div className="bg-black text-white p-2 rounded-md mt-1 text-sm">
														I've shared the copy in the #email-campaign channel.
														Let me know if you need anything else!
													</div>
												</div>
												<div className="h-8 w-8 rounded-full bg-gray-800 text-white flex-shrink-0 flex items-center justify-center text-xs">
													ME
												</div>
											</div>
										</div>
										<div className="mt-4 flex gap-2">
											<div className="flex-1 relative">
												<input
													type="text"
													placeholder="Type a message..."
													className="w-full p-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
												/>
												<button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round">
														<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
														<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
													</svg>
												</button>
											</div>
											<Button className="bg-black text-white hover:bg-gray-800">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round">
													<path d="m22 2-7 20-4-9-9-4Z"></path>
													<path d="M22 2 11 13"></path>
												</svg>
											</Button>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						{/* Notifications Feature */}
						<TabsContent
							value="notifications"
							className="mt-0">
							<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
								<div className="space-y-4">
									<h2 className="text-3xl font-bold tracking-tighter">
										Smart Notifications
									</h2>
									<p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
										Stay informed with intelligent notifications. Get updates on
										task changes, mentions, and important deadlines.
									</p>
									<ul className="space-y-2">
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>Customizable notification preferences</span>
										</li>
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>Real-time alerts for mentions and assignments</span>
										</li>
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>Deadline reminders and status updates</span>
										</li>
										<li className="flex items-center">
											<CheckSquare className="h-5 w-5 mr-2 text-black" />
											<span>Mobile push notifications and email digests</span>
										</li>
									</ul>
								</div>
								<div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
									<div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
										<div className="font-medium">Notifications</div>
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												className="h-8">
												Mark all as read
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round">
													<circle
														cx="12"
														cy="12"
														r="1"></circle>
													<circle
														cx="19"
														cy="12"
														r="1"></circle>
													<circle
														cx="5"
														cy="12"
														r="1"></circle>
												</svg>
											</Button>
										</div>
									</div>
									<div className="divide-y divide-gray-100">
										<div className="p-4 bg-gray-50">
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
													<Bell className="h-5 w-5" />
												</div>
												<div className="flex-1">
													<div className="flex items-center justify-between">
														<div className="font-medium">
															Deadline Approaching
														</div>
														<div className="text-xs text-gray-500">
															5 min ago
														</div>
													</div>
													<p className="text-sm text-gray-600 mt-1">
														"Design email template" is due tomorrow at 5:00 PM
													</p>
												</div>
											</div>
										</div>
										<div className="p-4">
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
													<MessageSquare className="h-5 w-5" />
												</div>
												<div className="flex-1">
													<div className="flex items-center justify-between">
														<div className="font-medium">New Message</div>
														<div className="text-xs text-gray-500">
															10 min ago
														</div>
													</div>
													<p className="text-sm text-gray-600 mt-1">
														Alex Smith mentioned you in #email-campaign
													</p>
												</div>
											</div>
										</div>
										<div className="p-4">
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
													<CheckSquare className="h-5 w-5" />
												</div>
												<div className="flex-1">
													<div className="flex items-center justify-between">
														<div className="font-medium">Task Completed</div>
														<div className="text-xs text-gray-500">
															1 hour ago
														</div>
													</div>
													<p className="text-sm text-gray-600 mt-1">
														Tom Kim completed "Define target audience"
													</p>
												</div>
											</div>
										</div>
										<div className="p-4">
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
													<Users className="h-5 w-5" />
												</div>
												<div className="flex-1">
													<div className="flex items-center justify-between">
														<div className="font-medium">New Assignment</div>
														<div className="text-xs text-gray-500">
															2 hours ago
														</div>
													</div>
													<p className="text-sm text-gray-600 mt-1">
														You've been assigned to "Create social media posts"
													</p>
												</div>
											</div>
										</div>
										<div className="p-4">
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round">
														<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
														<polyline points="14 2 14 8 20 8"></polyline>
													</svg>
												</div>
												<div className="flex-1">
													<div className="flex items-center justify-between">
														<div className="font-medium">File Shared</div>
														<div className="text-xs text-gray-500">
															Yesterday
														</div>
													</div>
													<p className="text-sm text-gray-600 mt-1">
														Jane Doe shared "Campaign_Assets.zip" with the team
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</section>

			<section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 items-center">
						<div className="space-y-4">
							<h2 className="text-gradient text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								All the tools your team needs in one place
							</h2>
							<p className="text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								TaskMaster brings together task management, team communication,
								and smart notifications in one seamless platform. No more
								switching between different tools or losing track of important
								information.
							</p>
							<div className="flex flex-col gap-2 min-[400px]:flex-row">
								<Link to="/signup">
									<Button className="bg-white text-black hover:bg-gray-200">
										Get started for free
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</Link>
								<Link to="/">
									<Button
										variant="outline"
										className="border-white text-white hover:bg-white/10">
										Request a demo
									</Button>
								</Link>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<Card className="bg-white/10 border-white/20">
								<CardHeader>
									<CheckSquare className="h-8 w-8 mb-2" />
									<CardTitle className="text-white">Task Management</CardTitle>
									<CardDescription className="text-gray-400">
										Organize, assign, and track tasks with customizable boards
										and workflows.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="bg-white/10 border-white/20">
								<CardHeader>
									<MessageSquare className="h-8 w-8 mb-2" />
									<CardTitle className="text-white">Team Chat</CardTitle>
									<CardDescription className="text-gray-400">
										Communicate in real-time with your team through channels and
										direct messages.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="bg-white/10 border-white/20">
								<CardHeader>
									<Bell className="h-8 w-8 mb-2" />
									<CardTitle className="text-white">Notifications</CardTitle>
									<CardDescription className="text-gray-400">
										Stay informed with customizable alerts for tasks, mentions,
										and deadlines.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="bg-white/10 border-white/20">
								<CardHeader>
									<Calendar className="h-8 w-8 mb-2" />
									<CardTitle className="text-white">Calendar</CardTitle>
									<CardDescription className="text-gray-400">
										View deadlines and schedule meetings with integrated
										calendar views.
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</div>
			</section>
		</main>
	</div>
);

export default Feature;
