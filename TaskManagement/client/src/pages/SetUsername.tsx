import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Clock, Calendar, ListTodo } from "lucide-react";
import { useSetUsername } from "@/hooks/customs/useSetUsername";

const SetUsername = () => {
	const [username, setUsername] = useState("");
	const { handleSetUsername, setUsernameLoading } = useSetUsername();
	const handleContinue = async () => {
		await handleSetUsername(username);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
			<Card className="w-full max-w-md overflow-hidden bg-gray-900 border-gray-800">
				<div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
					<div className="absolute inset-0 flex items-center justify-center opacity-20">
						<div className="grid grid-cols-3 gap-4 transform rotate-12 scale-150">
							{Array.from({ length: 9 }).map((_, i) => (
								<div
									key={i}
									className={`rounded-lg ${
										i % 3 === 0
											? "bg-blue-300"
											: i % 3 === 1
											? "bg-purple-300"
											: "bg-pink-300"
									} h-16 w-16`}
								/>
							))}
						</div>
					</div>

					{/* Floating icons */}
					<CheckCircle className="absolute top-12 left-12 h-8 w-8 text-white opacity-80" />
					<Clock className="absolute top-24 right-16 h-6 w-6 text-white opacity-70" />
					<Calendar className="absolute bottom-10 left-20 h-7 w-7 text-white opacity-75" />
					<ListTodo className="absolute top-20 right-40 h-5 w-5 text-white opacity-65" />

					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 h-16" />
				</div>

				<CardHeader>
					<CardTitle className="text-2xl font-bold text-gray-100">
						Welcome to TaskFlow
					</CardTitle>
					<CardDescription className="text-gray-400">
						Let's personalize your task management experience
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label
							htmlFor="user-name"
							className="text-gray-300"
						>
							What should we call you?
						</Label>
						<Input
							id="user-name"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Enter your name"
							className="bg-gray-800 border-gray-700 text-gray-200"
							autoComplete="name"
						/>
						<p className="text-sm text-gray-500">
							This will be displayed on your profile and tasks
						</p>
					</div>
				</CardContent>

				<CardFooter className="flex flex-col space-y-4 border-t border-gray-800 pt-4">
					<Button
						onClick={handleContinue}
						disabled={!username.trim() || setUsernameLoading}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white"
					>
						{setUsernameLoading ? "Setting up..." : "Continue to Dashboard"}
					</Button>

					<p className="text-center text-xs text-gray-500">
						By continuing, you agree to our Terms of Service and Privacy Policy
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default SetUsername;
