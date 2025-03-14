import { toast } from "@/hooks/use-toast";
import { useCreateCommentMutation } from "@/redux/services/taskApi";

const useMakeComment = () => {
	const workspaceId = localStorage.getItem("workspace");
	const [makeComment, { isLoading: commentLoading }] =
		useCreateCommentMutation();
	const handleMakeComment = async (taskId: string, commentInfo: FormData) => {
		try {
			const response = await makeComment({
				workspaceId,
				taskId,
				commentInfo,
			}).unwrap();
			return response;
		} catch (error: any) {
			toast({
				title: error.data.error,
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return { handleMakeComment, commentLoading };
};

export { useMakeComment };
