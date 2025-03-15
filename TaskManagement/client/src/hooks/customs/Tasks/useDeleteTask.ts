import { toast } from "@/hooks/use-toast";
import { useDeleteTaskMutation } from "@/redux/services/taskApi";

const useDeleteTask = () => {
	const workspaceId = localStorage.getItem("workspace");
	const [deleteTask, { isLoading: deleteTaskLoading }] =
		useDeleteTaskMutation();

	const handleTaskDelete = async (taskId: string) => {
		try {
			const response = await deleteTask({ workspaceId, taskId }).unwrap();
			toast({
				title: "Task Deleted",
			});
			return response;
		} catch (error: any) {
			toast({
				title: "Failed to detete task",
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return { handleTaskDelete, deleteTaskLoading };
};

export { useDeleteTask };
