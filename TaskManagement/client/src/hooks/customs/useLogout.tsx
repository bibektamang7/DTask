import { useLogoutUserMutation } from "@/redux/services/authApi";
import { Navigate, redirect } from "react-router";
import { toast } from "../use-toast";

const useLogout = () => {
	const token = localStorage.getItem("token");
	
	const [makeLogout, { isLoading }] = useLogoutUserMutation();
	const handleLogout = async () => {
		try {
			const response = await makeLogout({ token }).unwrap();
			localStorage.clear();
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
