import { Task } from "@/types/task";
import { toast } from "../use-toast";
import { useNavigate } from "react-router";
import { useCreateChatMutation } from "@/redux/services/chatApi";

const useCreateChat= () => {
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
			return response;
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return { handleCreateChat, isLoading };
};

export default useCreateChat;
