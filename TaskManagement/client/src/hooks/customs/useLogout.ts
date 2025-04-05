import { useLogoutUserMutation } from "@/redux/services/authApi";
import { toast } from "../use-toast";

const useLogout = () => {
	const token = localStorage.getItem("token");

	const [makeLogout, { isLoading }] = useLogoutUserMutation();
	const handleLogout = async () => {
		try {
			await makeLogout({ token }).unwrap();
			localStorage.removeItem("token");
			localStorage.removeItem("workspace");
			window.location.href = "/";
			toast({
				title: "Logout Successfull",
			});
		} catch (error: any) {
			toast({
				title: "Failed to logout",
				description: "Please try again.",
				variant: "destructive",
			});
		}
	};
	return { handleLogout, isLoading };
};
export { useLogout };
