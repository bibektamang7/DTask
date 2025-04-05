import { toast } from "../use-toast";
import { useCreateChatMutation } from "@/redux/services/chatApi";

const useCreateChat = () => {
	const [createChat, { isLoading }] = useCreateChatMutation();
	const workspaceId = localStorage.getItem("workspace");
	const handleCreateChat = async (chatInfo: any) => {
		try {
			const response = await createChat({ chatInfo, workspaceId }).unwrap();
			if (response.success) {
				toast({
					title: "Task created successfully",
				});
			}
			toast({
				title: "Chat Created",
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

	return { handleCreateChat, isLoading };
};

export default useCreateChat;
