import { useUpdateTaskMutation } from "@/redux/services/taskApi";
import { toast } from "../use-toast";

const useTaskUpdate = () => {
	const [updateTask, { isLoading: taskUpdateLoading }] =
		useUpdateTaskMutation();
	const workspaceId = localStorage.getItem("workspace");
	const handleUpdate = async (taskId: string, taskUpdateInfo: any) => {
		try {
			const updateTaskResponse = await updateTask({
				taskId,
				workspaceId,
				taskUpdateInfo,
			}).unwrap();
			return updateTaskResponse.data;
		} catch (error: any) {
			toast({
				title: "Failed to update task",
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return {handleUpdate, taskUpdateLoading}
};

export {useTaskUpdate}