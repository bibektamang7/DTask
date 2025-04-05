import { useSetUsernameMutation } from "@/redux/services/userApi";
import { toast } from "../use-toast";

const useSetUsername = () => {
	const token = localStorage.getItem("token");
	const [setUsername, { isLoading: setUsernameLoading }] =
		useSetUsernameMutation();
	const handleSetUsername = async (username: string) => {
		try {
			await setUsername({ username, token }).unwrap();
			// dispatch(setCurrentUsername(resposne.data.username));
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
