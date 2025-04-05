import { toast } from "@/hooks/use-toast";
import { useAddMemberInWorkspaceMutation } from "@/redux/services/workspaceApi";

const useAddMember = () => {
	const workspaceId = localStorage.getItem("workspace");
	const [addMember, { isLoading: addMemberLoading }] =
		useAddMemberInWorkspaceMutation();

	const handleAddMember = async (memberInfo: any) => {
		try {
			 await addMember({ workspaceId, memberInfo }).unwrap();
			toast({
				title: "Send Invitation",
			});
		} catch (error: any) {
			toast({
				title: error.data.error,
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return { handleAddMember, addMemberLoading };
};

export { useAddMember };
