import { useCreateTaskMutation } from "@/redux/services/taskApi";
import { Task } from "@/types/task";
import { toast } from "../use-toast";
import { useNavigate } from "react-router";

const useCreateTask = () => {
	const [task, { isLoading }] = useCreateTaskMutation();
	const workspaceId = localStorage.getItem("workspace");
	const navigate = useNavigate()
	const createTask = async (taskInfo: Task) => {
		try {	
			const response = await task({ taskInfo, workspaceId }).unwrap();
			if (response.success) {
				toast({
					title: "Task created successfully",
				});
			}
			return response;
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return { createTask, isLoading };
};

export default useCreateTask;
