import { toast } from "@/hooks/use-toast";
import { useAddAttachmentMutation } from "@/redux/services/taskApi";

const useAddAttachments = () => {
	const workspaceId = localStorage.getItem("workspace");
	const [addAttachments, { isLoading: addAttachmentsLoading }] =
		useAddAttachmentMutation();
	const handleAddAttachments = async (attachmentInfo: any, taskId: string) => {
		try {
			const response = await addAttachments({
				attachmentInfo,
				taskId,
				workspaceId,
			}).unwrap();
			toast({
				title: "Attachments Added",
			});
			return response;
		} catch (error: any) {
			toast({
				title: error.data.error,
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return { handleAddAttachments, addAttachmentsLoading };
};

export { useAddAttachments };
