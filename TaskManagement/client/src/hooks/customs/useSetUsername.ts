import { useSetUsernameMutation } from "@/redux/services/userApi";
import { toast } from "../use-toast";
import { useDispatch } from "react-redux";
import { setCurrentUsername } from "@/redux/features/authSlice";
const useSetUsername = () => {
	const token = localStorage.getItem("token");
	const dispatch = useDispatch();
	const [setUsername, { isLoading: setUsernameLoading }] =
		useSetUsernameMutation();
	const handleSetUsername = async (username: string) => {
		try {
			const resposne = await setUsername({ username, token }).unwrap();
			dispatch(setCurrentUsername(resposne.data.username));
			toast({
				title: "Welcome to Donezo",
			});
			window.location.href = "/w";
		} catch (error: any) {
			toast({
				title: error.data.error,
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return { handleSetUsername, setUsernameLoading };
};

export { useSetUsername };
