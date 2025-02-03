import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PencilIcon } from "lucide-react";

const teamMembers = [
	{ name: "Bipin Tamang", image: "/placeholder.svg" },
	{ name: "John Doe", image: "/placeholder.svg" },
	{ name: "Jane Smith", image: "/placeholder.svg" },
];

export default function DashboardPage() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const formattedDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	return (
		<>
			<main className="flex-1">
				<div className="container mx-auto p-4 md:p-8 space-y-8">
					<div>
						<div className="text-muted-foreground">{formattedDate}</div>
						<h1 className="text-3xl md:text-4xl font-medium">
							<span className="text-muted-foreground">Good Morning,</span>{" "}
							<span>Bibek</span>
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
									className="w-full justify-start text-muted-foreground mb-4">
									+ click to add
								</Button>
								<div className="space-y-3">
									<div className="flex items-start gap-2">
										<Checkbox id="task1" />
										<label
											htmlFor="task1"
											className="text-sm leading-none">
											Finish making this application
										</label>
									</div>
									<div className="flex items-start gap-2">
										<Checkbox id="task2" />
										<label
											htmlFor="task2"
											className="text-sm leading-none">
											Have dinner before 8
										</label>
									</div>
									<div className="flex items-start gap-2">
										<Checkbox id="task3" />
										<label
											htmlFor="task3"
											className="text-sm leading-none">
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
										className="text-blue-500 hover:text-blue-600">
										View
									</Button>
								</div>
								<p className="text-muted-foreground text-sm">
									"Success is not measured by money, it is measured by
									happiness."
								</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardContent className="p-6">
							<h2 className="text-xl font-semibold mb-4">Overview</h2>
							<Tabs defaultValue="upcoming">
								<TabsList>
									<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
									<TabsTrigger value="overdue">Overdue</TabsTrigger>
									<TabsTrigger value="completed">Completed</TabsTrigger>
								</TabsList>
								<TabsContent
									value="upcoming"
									className="space-y-4">
									{[1, 2, 3].map((item) => (
										<div
											key={item}
											className="flex items-center gap-4 p-4 bg-muted rounded-lg">
											<div className="h-10 w-10 bg-muted-foreground/20 rounded-full" />
											<div className="text-sm">New ideas for developments</div>
										</div>
									))}
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			</main>

			<aside className="w-full md:w-80 border-t md:border-l md:border-t-0">
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
								variant="ghost"
								className="text-blue-500 hover:text-blue-600">
								View All
							</Button>
						</div>
						<div className="space-y-4">
							<div className="h-32 bg-muted rounded-lg" />
							<div className="h-32 bg-muted rounded-lg" />
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">Team Member</h2>
							<Button
								variant="ghost"
								className="text-blue-500 hover:text-blue-600">
								View All
							</Button>
						</div>
						<div className="space-y-4">
							{teamMembers.map((member, index) => (
								<div
									key={index}
									className="flex items-center gap-3">
									<Avatar>
										<AvatarImage
											src={member.image}
											alt={member.name}
										/>
										<AvatarFallback>
											{member.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div className="text-sm">{member.name}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</aside>
		</>
	);
}
