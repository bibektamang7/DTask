import { useCreateWorkspaceMutation } from "@/redux/services/workspaceApi";
import { toast } from "../use-toast";
import { User } from "@/types/user";
import { useNavigate } from "react-router";
const useCreateWorkspace = () => {
	const navigate = useNavigate();
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
			navigate("/w");
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
