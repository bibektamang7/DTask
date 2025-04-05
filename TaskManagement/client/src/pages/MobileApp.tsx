import { Download, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const MobileApp = () => {
	return (
		<div className="flex flex-col min-h-screen ">
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
					<div className="container px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
							<div className="space-y-4">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
									Download <span className="text-gradient">Denzo</span> Mobile
									Today
								</h2>
								<p className="text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Join thousands of professionals who use TaskMaster Mobile to
									stay productive on the go.
								</p>
								<div className="flex flex-col gap-2 min-[400px]:flex-row">
									<Link to="/">
										<Button className="bg-white text-black hover:bg-gray-200">
											<Download className="mr-2 h-4 w-4" />
											Download for iOS
										</Button>
									</Link>
									<Link to="/">
										<Button
											variant="outline"
											className="border-white text-white hover:bg-white/10">
											<Download className="mr-2 h-4 w-4" />
											Download for Android
										</Button>
									</Link>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Star className="h-5 w-5 fill-current text-yellow-400" />
										<span className="font-medium">App Store Rating</span>
									</div>
									<p className="text-3xl font-bold">4.8/5</p>
									<p className="text-sm text-gray-400">
										Based on 5,000+ reviews
									</p>
								</div>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Star className="h-5 w-5 fill-current text-yellow-400" />
										<span className="font-medium">Google Play Rating</span>
									</div>
									<p className="text-3xl font-bold">4.7/5</p>
									<p className="text-sm text-gray-400">
										Based on 8,000+ reviews
									</p>
								</div>
								<div className="col-span-2 space-y-2">
									<div className="flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="h-5 w-5">
											<path d="M17 6.1H3"></path>
											<path d="M21 12.1H3"></path>
											<path d="M15.1 18H3"></path>
										</svg>
										<span className="font-medium">User Testimonial</span>
									</div>
									<p className="italic text-gray-300">
										"The TaskMaster mobile app has completely changed how I work
										on the go. I can manage my team's tasks, chat with
										colleagues, and stay updated with notifications all from my
										phone."
									</p>
									<p className="text-sm text-gray-400">
										— Sarah J., Marketing Director
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

export default MobileApp;
