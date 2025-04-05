import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link } from "react-router";
// import { useRegisterWithGoogleMutation } from "@/redux/services/authApi";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/customs/useAuth";

const Login = () => {
	const [isRemember, setIsRemember] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { login, isLoading } = useAuth();
	// const [loginWithGoogle] = useRegisterWithGoogleMutation();

	const handleLogin = async (e: any) => {
		e.preventDefault();
		try {
			await login(email, password);
			if (isRemember) {
				localStorage.setItem("email", email);
			}
		} catch (err) {
			console.error("Login failed:", err);
		}
	};
	const handleSignInWithGoogle = async () => {
		try {
			window.location.href = import.meta.env.VITE_GOOGLE_CONSOLE;

			// const resposne = await loginWithGoogle({}).unwrap();
		} catch (error) {
			console.log("something went wrong");
		}
	};
	useEffect(() => {
		const savedEmail = localStorage.getItem("email");
		if (savedEmail) {
			setEmail(savedEmail?.toString());
			setIsRemember(true);
		}
	}, []);

	return (
		<section className="w-full max-h-screen h-screen overflow-hidden">
			<div className="flex h-full">
				<div className="lg:w-[50%] w-full py-12 pb-12  h-full flex flex-col items-center justify-center">
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
										id="email"
										placeholder="Enter your email"
										defaultValue={email}
										onChange={(e) => setEmail(e.target.value)}
										className="my-2 outline-none border-none bg-gray-800 py-6"
									/>
								</div>
								<div className="flex flex-col my-4">
									<label htmlFor="password">Password</label>
									<Input
										id="password"
										placeholder="Enter your password"
										type="password"
										onChange={(e) => setPassword(e.target.value)}
										className="my-2 outline-none border-none bg-gray-800 py-6"
									/>
								</div>
								<div className="flex items-center justify-between">
									<div
										onClick={() => setIsRemember((prev) => !prev)}
										className="flex items-center space-x-2"
									>
										<input
											checked={isRemember}
											type="checkbox"
											onChange={() => setIsRemember((prev) => !prev)}
										/>
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
										"w-full mt-4 py-5",
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
				<div className="flex-1 h-full">
					<img
						src="/images/taskPerson.png"
						className="w-full h-full object-contain "
						alt="task clock image"
						loading="lazy"
					/>
				</div>
			</div>
		</section>
	);
};

export default Login;
