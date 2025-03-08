import { useGetTasksQuery } from "@/redux/services/taskApi";
import { redirect } from "react-router";

const useTask = () => {
	const token = localStorage.getItem("token");
	const workspaceId = localStorage.getItem("workspace");
	if (!token || !workspaceId) redirect("/login");
	const { data, isLoading } = useGetTasksQuery({
		token: token,
		workspaceId: workspaceId,
	});
	return { taskData: data?.data, isLoading };
};
export { useTask };

// bibektamang0.3818773796279711@gmail.com
