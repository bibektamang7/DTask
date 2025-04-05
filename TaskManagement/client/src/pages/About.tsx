import { Calendar, CheckCircle, Users } from "lucide-react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const About = () => {
	return (
		<div className="flex flex-col min-h-screen dark">
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 border-b ">
					<div className="container px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="space-y-4">
								<h1 className="text-gradient text-3xl font-bold tracking-tighter sm:text-5xl">
									Simplifying Task Management Since 2025
								</h1>
								<p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									TaskMaster was founded with a simple mission: to help teams
									work more efficiently by providing a powerful yet intuitive
									task management solution.
								</p>
							</div>
							<div className="flex justify-center">
								<img
									src="/images/task.jpg"
									width={400}
									height={400}
									alt="About TaskMaster"
									className="rounded-lg object-cover border border-gray-200"
								/>
							</div>
						</div>
					</div>
				</section>

				<section className="gradient w-full py-8 mb-12 rounded-lg">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className=" text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
									Our Core Values
								</h2>
								<p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									These principles guide everything we do at TaskMaster, from
									product development to customer support.
								</p>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 mt-8">
							<Card className="border-black/10">
								<CardHeader>
									<CheckCircle className="h-8 w-8 mb-2" />
									<CardTitle>Simplicity</CardTitle>
									<CardDescription>
										We believe powerful tools don't need to be complicated.
										TaskMaster is designed to be intuitive and easy to use.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="border-black/10">
								<CardHeader>
									<Users className="h-8 w-8 mb-2" />
									<CardTitle>Collaboration</CardTitle>
									<CardDescription>
										Great work happens when teams work together seamlessly. We
										build features that enhance team collaboration.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="border-black/10">
								<CardHeader>
									<Calendar className="h-8 w-8 mb-2" />
									<CardTitle>Reliability</CardTitle>
									<CardDescription>
										Your tasks are important. Our platform is built to be
										reliable, secure, and available when you need it.
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

export default About;
