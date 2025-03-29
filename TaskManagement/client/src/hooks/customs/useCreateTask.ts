import { useCreateTaskMutation } from "@/redux/services/taskApi";
import { toast } from "../use-toast";

const useCreateTask = () => {
	const [task, { isLoading }] = useCreateTaskMutation();
	const workspaceId = localStorage.getItem("workspace");
	const createTask = async (taskInfo: any) => {
		try {
			
			const response = await task({ taskInfo, workspaceId }).unwrap();
			if (response.success) {
				toast({
					title: "Task created successfully",
				});
			}
			return response;
		} catch (error: any) {
			toast({
				title: "something went wrong",
				description: "Please try again",
				variant: "destructive",
			});
		}
	};

	return { createTask, isLoading };
};

export default useCreateTask;
