import { MapPin, Phone, Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const Contact = () => {
	return (
		<div className="flex flex-col min-h-screen ">
			<main className="flex-1">
				<section className="w-full py-12 md:py-8 lg:py-16 ">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gradient">
									Get in Touch
								</h1>
								<p className="max-w-[900px] text-gray-500">
									Have questions or need help? We're here for you. Reach out to
									our team and we'll get back to you as soon as possible.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="w-full pb-12">
					<div className="container px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
							<div className="space-y-8">
								<div>
									<h2 className="text-2xl font-bold mb-4">
										Contact Information
									</h2>
									<p className="text-gray-500 mb-6">
										Our team is ready to assist you with any questions or
										concerns you may have about TaskMaster.
									</p>
								</div>

								<div className="space-y-4">
									<div className="flex items-start gap-4">
										<div className="rounded-full p-2">
											<MapPin className="h-5 w-5" />
										</div>
										<div>
											<h3 className="font-medium">Headquarters</h3>
											<p className="text-gray-500">
												Dallu-15
												<br />
												Kathmandu, 44600
												<br />
												Nepal
											</p>
										</div>
									</div>
									<div className="flex items-start gap-4">
										<div className="rounded-full p-2">
											<Phone className="h-5 w-5" />
										</div>
										<div>
											<h3 className="font-medium">Phone</h3>
											<p className="text-gray-500">
												+977 9812345678
												<br />
												Monday - Friday, 9am - 6pm PT
											</p>
										</div>
									</div>
									<div className="flex items-start gap-4">
										<div className="rounded-full p-2">
											<Mail className="h-5 w-5" />
										</div>
										<div>
											<h3 className="font-medium">Email</h3>
											<p className="text-gray-500">
												tmgbibek777@gmail.com
												<br />
												bibek7here@gmail.com
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="space-y-8">
								<div>
									<h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
									<p className="text-gray-500 mb-6">
										Fill out the form below and we'll get back to you as soon as
										possible.
									</p>
								</div>

								<form className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<label
												htmlFor="first-name"
												className="text-sm font-medium">
												First Name
											</label>
											<Input
												id="first-name"
												placeholder="Bibek"
												required
											/>
										</div>
										<div className="space-y-2">
											<label
												htmlFor="last-name"
												className="text-sm font-medium">
												Last Name
											</label>
											<Input
												id="last-name"
												placeholder="Tamang"
												required
											/>
										</div>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="email"
											className="text-sm font-medium">
											Email
										</label>
										<Input
											id="email"
											type="email"
											placeholder="Enter your email"
											required
										/>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="phone"
											className="text-sm font-medium">
											Phone (Optional)
										</label>
										<Input
											id="phone"
											type="tel"
											placeholder="Enter your phone number"
										/>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="subject"
											className="text-sm font-medium">
											Subject
										</label>
										<Select>
											<SelectTrigger id="subject">
												<SelectValue placeholder="Select a subject" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="general">General Inquiry</SelectItem>
												<SelectItem value="support">
													Technical Support
												</SelectItem>
												<SelectItem value="sales">Sales Question</SelectItem>
												<SelectItem value="billing">Billing Issue</SelectItem>
												<SelectItem value="other">Other</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="message"
											className="text-sm font-medium">
											Message
										</label>
										<Textarea
											id="message"
											placeholder="How can we help you?"
											className="min-h-[120px]"
											required
										/>
									</div>
									<Button
										type="submit"
										className="w-full text-black bg-gray-100">
										<Send className="mr-2 h-4 w-4" />
										Send Message
									</Button>
								</form>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};
export default Contact;
