import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Link } from "react-router";
import { useRegisterUserMutation } from "@/redux/services/authApi";
import { cn } from "@/lib/utils";

const Signup = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [register, { isLoading }] = useRegisterUserMutation();

	const handleRegister = async (e: any) => {
		e.preventDefault()
		try {
			const response = await register({ email, password }).unwrap();
		} catch (error) {
			// alert("something went wrong");
		}
	};

	return (
		<section className="w-full min-h-screen h-full p-8">
			<div className="hidden lg:w-[50%]">hello</div>
			<div className="lg:w-[50%] w-full h-full flex flex-col items-center justify-between">
				{/* <h1 className="text-2xl text-center mb-16">Denzo</h1> */}
				<div className="lg:mx-20 flex flex-col items-center justify-between">
					<h2 className="text-4xl my-4 text-center">Create an account</h2>
					<div className="flex flex-col">
						<p className="text-sm font-extralight text-center text-gray-400">
							Embrace productivity and efficiency by optimizing your tasks
						</p>
						<form
							action=""
							onSubmit={handleRegister}
						>
							<div className="flex flex-col flex-1 my-4">
								<label htmlFor="email">Email</label>
								<Input
									placeholder="Enter your email"
									className="my-2 outline-none border-none bg-gray-800 py-6"
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="flex flex-col my-4">
								<label htmlFor="password">Password</label>
								<Input
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your password"
									type="password"
									className="my-2 outline-none border-none bg-gray-800 py-6"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<input type="checkbox" />
									<label
										htmlFor="terms"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										I agree to the{" "}
										<Link
											className="underline text-indigo-500"
											to={`/terms`}
										>
											Terms & conditions
										</Link>
									</label>
								</div>
							</div>
							<Button
								type="submit"
								className={cn(
									"w-full mt-12 py-5",
									isLoading ? "bg-red-600" : ""
								)}
							>
							Get Started	
							</Button>
						</form>
						<div>
							<Button className="w-full py-5 bg-gray-900 border-2 border-slate-500 my-4">
								<img
									width={20}
									height={20}
									src="/logos/google.svg"
									alt="Google logo"
								/>
								Sign up with Google
							</Button>
						</div>
					</div>
				</div>
				<div className="flex">
					<p className="text-sm text-gray-500">
						Already have an account?
						<Link
							className="text-white font-normal"
							to={`/login`}
						>
							{" "}
							Login
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
};

export default Signup;
