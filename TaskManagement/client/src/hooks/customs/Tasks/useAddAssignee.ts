import { toast } from "@/hooks/use-toast";
import { useAddAssigneeMutation } from "@/redux/services/taskApi";

const useAddAssignee = () => {
	const workspaceId = localStorage.getItem("workspace");
	const [addAssignee, { isLoading: addAssigneeLoading }] =
		useAddAssigneeMutation();

	const handleAddAssigneeInTask = async (taskId: string, memberId: string) => {
		try {
			const response = await addAssignee({
				workspaceId,
				taskId,
				memberId,
			}).unwrap();
			toast({
				title: "Task Assigned",
			});
			return response;
		} catch (error: any) {
			toast({
				title: "Failed to add assignee",
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return { handleAddAssigneeInTask, addAssigneeLoading };
};

export { useAddAssignee };
