import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Link } from "react-router";
import {  useRegisterWithGoogleMutation } from "@/redux/services/authApi";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/customs/useAuth";

const Login = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const {login, isLoading} = useAuth()
	const [loginWithGoogle] = useRegisterWithGoogleMutation();

	const handleLogin = async (e: any) => {
		e.preventDefault();
		try {
			await login(email, password)
			
		} catch (err) {
			console.error("Login failed:", err);
		}
	};
	const handleSignInWithGoogle = async () => {
		try {
		const resposne = await loginWithGoogle({}).unwrap();
		console.log(resposne);
		
		} catch (error) {
			console.log("something went wrong")
		}
	}


	return (
		<section className="w-full min-h-screen h-full p-8">
			<div className="hidden lg:w-[50%]">hello</div>
			<div className="lg:w-[50%] w-full h-full flex flex-col items-center justify-between">
				<h1 className="text-2xl text-center mb-16">Denzo</h1>
				<div className="lg:mx-20 flex flex-col items-center justify-between">
					<h2 className="text-4xl my-4 text-center">Welcome Back</h2>
					<div className="flex flex-col">
						<p className="text-sm font-extralight text-center text-gray-400">
							Enter you email and password to access your account
						</p>
						<form
							action=""
							onSubmit={handleLogin}
						>
							<div className="flex flex-col flex-1 my-4">
								<label htmlFor="email">Email</label>
								<Input
									placeholder="Enter your email"
									onChange={(e) => setEmail(e.target.value)}
									className="my-2 outline-none border-none bg-gray-800 py-6"
								/>
							</div>
							<div className="flex flex-col my-4">
								<label htmlFor="password">Password</label>
								<Input
									placeholder="Enter your password"
									type="password"
									onChange={(e) => setPassword(e.target.value)}
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
										Remember me
									</label>
								</div>
								<Link
									className="text-sm"
									to={`/forgot-password`}
								>
									Forgot Password?
								</Link>
							</div>
							<Button
								className={cn(
									"w-full mt-12 py-5",
									isLoading ? "bg-red-600" : ""
								)}
								type="submit"
							>
								Sign In
							</Button>
						</form>
						<div>
							<Button
								className="w-full py-5 text-white hover:bg-slate-700 outline-none bg-gray-900 border-2 border-slate-500 my-4"
								onClick={handleSignInWithGoogle}
							>
								<img
									width={20}
									height={20}
									src="/logos/google.svg"
									alt="Google logo"
								/>
								Sign in with Google
							</Button>
						</div>
					</div>
				</div>
				<div className="flex">
					<p className="text-sm text-gray-500">
						Don't have an account?
						<Link
							className="text-white font-normal"
							to={`/signup`}
						>
							{" "}
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
};

export default Login;
