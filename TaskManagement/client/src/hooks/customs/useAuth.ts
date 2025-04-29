import { useLoginUserMutation } from "@/redux/services/authApi";
import { useNavigate } from "react-router";
import { useToast } from "../use-toast";

export const useAuth = () => {
	const [loginUser, { isLoading }] = useLoginUserMutation();
	const { toast } = useToast();
	const navigate = useNavigate();
	const login = async (email: string, password: string) => {
		try {
			const response = await loginUser({ email, password }).unwrap();
			toast({
				title: "Login Successful",
				variant: "default",
			});
			const { data } = response;
			localStorage.setItem("currentUser", data.user._id);

			localStorage.setItem(
				"token",
				JSON.stringify({
					value: data.token,
					expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
				})
			);
			if (!data.user.username) {
				navigate("/set-username");
			} else {
				navigate("/w");
			}
		} catch (err: any) {
			toast({
				title: "Login Failed",
				description: "Please check your credentails.",
				variant: "destructive",
			});
			throw err;
		}
	};
	return { login, isLoading };
};
