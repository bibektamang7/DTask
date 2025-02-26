import { useCreateTaskMutation } from "@/redux/services/taskApi";
import { Task } from "@/types/task";
import { toast } from "../use-toast";

const useCreateTask = () => {
	const [task, { isLoading }] = useCreateTaskMutation();
	const workspaceId = localStorage.getItem("workspace");

	const createTask = async (taskInfo: Task) => {
		try {	
			const response = await task({ taskInfo, workspaceId }).unwrap();
			if (response.error) {
				toast({
					title: "Something went wrong!",
					description: "Please try again",
					variant: "destructive",
				});
			}
			if (response.success) {
				toast({
					title: "Task created successfully",
				});
			}
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return { createTask, isLoading };
};

export default useCreateTask;
