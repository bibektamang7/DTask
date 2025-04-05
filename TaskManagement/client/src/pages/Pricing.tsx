import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Link } from "react-router";

const Pricing = () => {
	return (
		<div className="flex flex-col min-h-screen ">
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
							{/* Free Plan */}
							<Card>
								<CardHeader>
									<CardTitle className="text-2xl">Free</CardTitle>
									<CardDescription>
										For individuals and small teams getting started
									</CardDescription>
									<div className="mt-4">
										<span className="text-4xl font-bold">$0</span>
										<span className="text-gray-500 ml-2">/ month</span>
									</div>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3">
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Up to 5 team members</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Basic task management</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Limited chat functionality</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Basic notifications</span>
										</li>
										<li className="flex items-center">
											<X className="h-5 w-5 text-gray-300 mr-2" />
											<span className="text-gray-500">Advanced reporting</span>
										</li>
										<li className="flex items-center">
											<X className="h-5 w-5 text-gray-300 mr-2" />
											<span className="text-gray-500">Custom fields</span>
										</li>
										<li className="flex items-center">
											<X className="h-5 w-5 text-gray-300 mr-2" />
											<span className="text-gray-500">Priority support</span>
										</li>
									</ul>
								</CardContent>
								<CardFooter>
									<Link
										to="/signup"
										className="w-full">
										<Button
											variant="outline"
											className="w-full text-black bg-gray-100">
											Get Started
										</Button>
									</Link>
								</CardFooter>
							</Card>

							{/* Pro Plan */}
							<Card>
								<div className="absolute top-0 right-0 rounded-bl-lg rounded-tr-lg bg-black px-3 py-1 text-xs font-medium text-white">
									Most Popular
								</div>
								<CardHeader>
									<CardTitle className="text-2xl">Pro</CardTitle>
									<CardDescription>
										For growing teams that need more features
									</CardDescription>
									<div className="mt-4">
										<span className="text-4xl font-bold">$12</span>
										<span className="text-gray-500 ml-2">/ user / month</span>
									</div>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3">
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Unlimited team members</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Advanced task management</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Full chat functionality</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Advanced notifications</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Basic reporting</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Custom fields</span>
										</li>
										<li className="flex items-center">
											<X className="h-5 w-5 text-gray-300 mr-2" />
											<span className="text-gray-500">Priority support</span>
										</li>
									</ul>
								</CardContent>
								<CardFooter>
									<Link
										to="/signup"
										className="w-full">
										<Button
											variant="outline"
											className="w-full bg-gray-100 text-black">
											Start Free Trial
										</Button>
									</Link>
								</CardFooter>
							</Card>

							{/* Enterprise Plan */}
							<Card>
								<CardHeader>
									<CardTitle className="text-2xl">Enterprise</CardTitle>
									<CardDescription>
										For large organizations with specific needs
									</CardDescription>
									<div className="mt-4">
										<span className="text-4xl font-bold">$29</span>
										<span className="text-gray-500 ml-2">/ user / month</span>
									</div>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3">
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Unlimited team members</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Enterprise-grade security</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Advanced task management</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Full chat functionality</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Advanced reporting</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>Custom fields & workflows</span>
										</li>
										<li className="flex items-center">
											<Check className="h-5 w-5 text-green-500 mr-2" />
											<span>24/7 priority support</span>
										</li>
									</ul>
								</CardContent>
								<CardFooter>
									<Link
										to="/contact"
										className="w-full">
										<Button
											variant="outline"
											className="w-full bg-gray-100 text-black">
											Contact Sales
										</Button>
									</Link>
								</CardFooter>
							</Card>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

export default Pricing;
