import { toast } from "@/hooks/use-toast";
import { useDeleteMessageMutation } from "@/redux/services/chatApi";

const useDeleteChatMessage = () => {
	const workspaceId = localStorage.getItem("workspace");
	const [deleteMessage] = useDeleteMessageMutation();

	const handleDeleteChatMessage = async (chatId: string, messageId: string) => {
		try {
			await deleteMessage({
				chatId,
				workspaceId,
				messageId,
			}).unwrap();

			toast({
				title: "Message deleted",
			});
		} catch (error: any) {
			toast({
				title: error.data.error,
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return { handleDeleteChatMessage };
};

export { useDeleteChatMessage };
