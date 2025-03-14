import { toast } from "@/hooks/use-toast";
import { useDeleteCommentMutation } from "@/redux/services/taskApi";

const useDeleteComment = () => {
	const workspaceId = localStorage.getItem("workspace");
	const [deleteComment, { isLoading: deleteCommentLoading }] =
		useDeleteCommentMutation();

	const handleDeleteComment = async (commentId: string, taskId: string) => {
		try {
			const response = await deleteComment({
				workspaceId,
				commentId,
				taskId,
			}).unwrap();
			return response;
		} catch (error: any) {
			toast({
				title: "Failed to delete comment",
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return { handleDeleteComment, deleteCommentLoading };
};

export { useDeleteComment};
