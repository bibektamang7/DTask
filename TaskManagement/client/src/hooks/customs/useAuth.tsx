import { setUser } from "@/redux/features/authSlice";
import { useLoginUserMutation } from "@/redux/services/authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useToast } from "../use-toast";

export const useAuth = () => {
	const [loginUser, { isLoading }] = useLoginUserMutation();
	const { toast } = useToast();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const login = async (email: string, password: string) => {
		try {
			const response = await loginUser({ email, password }).unwrap();
			toast({
				title: "Login Successful",
				variant: "default",
			});
			const { data } = response;
			localStorage.setItem("token", data.token);
			dispatch(setUser(data.user));
			navigate("/w");
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
