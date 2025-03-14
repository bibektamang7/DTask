import { toast } from "@/hooks/use-toast";
import { useDeleteChatMutation } from "@/redux/services/chatApi";

const useDeleteChat = () => {
	const workspaceId = localStorage.getItem("workspace");
	const [deleteChat] = useDeleteChatMutation();

	const handleDeleteChat = async (chatId: string) => {
		try {
			await deleteChat({ workspaceId, chatId }).unwrap();
			toast({
				title: "Chat delete",
			});
			localStorage.removeItem("currentChat");
			return true;
		} catch (error: any) {
			toast({
				title: error.data.error,
				description: "Please try again",
				variant: "destructive",
			});
			return false;
		}
	};
	return { handleDeleteChat };
};

export { useDeleteChat };
