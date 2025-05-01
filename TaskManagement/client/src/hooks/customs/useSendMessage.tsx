import { useSendMessageMutation } from "@/redux/services/chatApi";
import { toast } from "../use-toast";

const useSendMessage = (chatId: string) => {
	const workspaceId = localStorage.getItem("workspace");
	const [sendMessage, { isLoading: sendMessageLoading }] =
		useSendMessageMutation();
	const handleSendMessage = async (messageInfo: any) => {
		try {
			const messageResponse = await sendMessage({
				chatId,
				workspaceId,
				messageInfo,
			}).unwrap();
			return messageResponse.data;
		} catch (error: any) {
			toast({
				title: "Something went while sending message",
				description: "Please try again",
				variant: "destructive",
			});
			return null
		}
	};
	return { handleSendMessage, sendMessageLoading };
};

export { useSendMessage };
