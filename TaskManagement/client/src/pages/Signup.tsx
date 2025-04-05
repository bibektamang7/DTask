import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setUser } from "@/redux/features/authSlice";
import { Link, useNavigate } from "react-router";
import { useRegisterUserMutation } from "@/redux/services/authApi";
import { cn } from "@/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";

const Signup = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			email: "" as string,
			password: "" as string,
		},
	});
	const [register, { isLoading }] = useRegisterUserMutation();

	const handleRegister = async (data: { email: string; password: string }) => {
		try {
			const response = await register(data).unwrap();
			dispatch(setUser(response.data.user));
			console.log(response);

			localStorage.setItem("token", response.data.token);
			toast({
				title: response.message,
			});
			navigate("/w");
		} catch (error: any) {
			toast({
				title: error.data.error,
				description: "Please try again",
				variant: "destructive",
			});
		}
	};

	return (
		<section className="w-full max-h-screen h-screen p-8">
			<div className="lg:w-[50%] w-full h-full flex flex-col items-center justify-center">
				<div className="lg:mx-20 h-full flex flex-col items-center justify-center">
					<h2 className="text-4xl my-4 text-center">Create an account</h2>
					<div className="flex flex-col">
						<p className="text-sm font-extralight mb-6  text-center text-gray-400">
							Embrace productivity and efficiency by optimizing your tasks
						</p>
						<FormProvider {...form}>
							<form
								onSubmit={form.handleSubmit(handleRegister)}
								className="flex flex-col gap-4">
								<FormField
									control={form.control}
									name="email"
									rules={{ required: "Email is required" }}
									render={({ field, fieldState }) => (
										<FormItem>
											<FormLabel htmlFor="email">Email</FormLabel>
											<FormControl>
												<Input
													id="email"
													placeholder="Enter your email"
													className="my-2 outline-none border-none bg-gray-800 py-6"
													{...field}
												/>
											</FormControl>
											{form.formState.errors.email && (
												<span className="text-red-500 text-sm">
													{fieldState.error?.message}
												</span>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									rules={{ required: "Password is required" }}
									render={({ field, fieldState }) => (
										<FormItem>
											<FormLabel htmlFor="password">password</FormLabel>
											<FormControl>
												<Input
													id="password"
													placeholder="Enter your password"
													className="my-2 outline-none border-none bg-gray-800 py-6"
													type="password"
													{...field}
												/>
											</FormControl>
											{form.formState.errors.password && (
												<span className="text-red-500 text-sm">
													{fieldState.error?.message}
												</span>
											)}
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className={cn(
										"w-full mt-4 py-5",
										isLoading ? "bg-red-600" : ""
									)}>
									Get Started
								</Button>
							</form>
						</FormProvider>
						<div>
							<Button className="w-full py-5 bg-gray-900 text-white border-2 border-slate-500 my-4 hover:bg-slate-700">
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

					<p className="text-sm text-gray-500">
						Already have an account?
						<Link
							className="text-white font-normal"
							to={`/login`}>
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
