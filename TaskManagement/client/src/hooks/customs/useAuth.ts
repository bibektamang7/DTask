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
			localStorage.setItem("token", data.token);
			if (!data.user.username) {
				console.log("yeta set user name aayo")
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
