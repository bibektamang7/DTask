import { useLogoutUserMutation } from "@/redux/services/authApi";
import { toast } from "../use-toast";
import { useNavigate } from "react-router";

const useLogout = () => {
	const { value: token } = JSON.parse(localStorage.getItem("token")!);
	const navigate = useNavigate();

	const [makeLogout, { isLoading }] = useLogoutUserMutation();
	const handleLogout = async () => {
		try {
			await makeLogout({ token }).unwrap();
			localStorage.removeItem("token");
			localStorage.removeItem("workspace");
			toast({
				title: "Logout Successfull",
			});
			navigate("/");
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
