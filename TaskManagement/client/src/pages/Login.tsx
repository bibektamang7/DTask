import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { Link } from "react-router";

const Login = () => {
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
					<form action="">
						<div className="flex flex-col flex-1 my-4">
							<label htmlFor="email">Email</label>
							<Input
								placeholder="Enter your email"
								className="my-2 outline-none border-none bg-gray-800 py-6"
							/>
						</div>
						<div className="flex flex-col my-4">
							<label htmlFor="password">Password</label>
							<Input
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
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Remember me
								</label>
							</div>
							<Link className="text-sm" to={`/forgot-password`}>Forgot Password?</Link>
						</div>
						<Button className="w-full mt-12 py-5">Sign In</Button>
					</form>
					<div>
						<Button className="w-full py-5 bg-gray-900 border-2 border-slate-500 my-4">
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
					<p className="text-sm text-gray-500">Don't have an account?
						<Link className="text-white font-normal" to={`/signup`}> Sign Up</Link>
					</p>
				</div>
			</div>
		</section>
	);
};

export default Login;
