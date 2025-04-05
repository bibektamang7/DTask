import { useCreateWorkspaceMutation } from "@/redux/services/workspaceApi";
import { toast } from "../use-toast";
import { User } from "@/types/user";
const useCreateWorkspace = () => {
	const [createWorkspace, { isLoading: createWorkspaceLoading }] =
		useCreateWorkspaceMutation();

	const handleCreateWorkpsace = async (members: User[], name: string) => {
		try {
			await createWorkspace({
				workspaceInfo: { members, name },
			}).unwrap();
			toast({
				title: "Workspace created",
			});

			window.location.href = "/set-username";
		} catch (error: any) {
			toast({
				title: error.data.error,
				description: "Please try again.",
				variant: "destructive",
			});
		}
	};
	return { handleCreateWorkpsace, createWorkspaceLoading };
};

export { useCreateWorkspace };
