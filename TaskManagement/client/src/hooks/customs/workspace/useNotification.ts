import { toast } from "@/hooks/use-toast";
import { useAcceptInvitaionMutation } from "@/redux/services/workspaceApi";

const useAcceptInvitation = () => {
	const [acceptInvitation, { isLoading: acceptInvitaionLoading }] =
		useAcceptInvitaionMutation();
	const handleAcceptInvitation = async (notificationId: string) => {
		try {
			await acceptInvitation({ notificationId }).unwrap();
			toast({
				title: "Accepted Invitation",
			});
		} catch (error: any) {
			toast({
				title: error.data.error,
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return { handleAcceptInvitation, acceptInvitaionLoading };
};

const useDeclineInvitation = () => {};

export { useAcceptInvitation, useDeclineInvitation };
