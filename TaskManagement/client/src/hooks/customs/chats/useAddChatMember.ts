import { toast } from "@/hooks/use-toast";
import { useAddMemberMutation } from "@/redux/services/chatApi";

const useAddChatMember = () => {
	const workspaceId = localStorage.getItem("workspace");
	const [addChatMember, { isLoading: addChatMemberLoading }] =
		useAddMemberMutation();

	const handleAddChatMember = async (chatId: string, memberId: string) => {
		try {
			const addResponse = await addChatMember({
				chatId,
				workspaceId,
				memberId,
			}).unwrap();
			toast({
				title: "Member Added",
			});
		} catch (error: any) {
			toast({
				title: error.data.errro,
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return { handleAddChatMember, addChatMemberLoading };
};

export { useAddChatMember };
