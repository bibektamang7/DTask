import { toast } from "@/hooks/use-toast";
import { workspaceApi } from "@/redux/services/workspaceApi";
import { store } from "@/redux/store";
import { redirect } from "react-router";
import { taskApi } from "@/redux/services/taskApi";
import { chatApi } from "@/redux/services/chatApi";

export const workspaceLoader = async () => {
	const token = localStorage.getItem("token");
	const workspaceId = localStorage.getItem("workspace");
	if (!token) return redirect("/login");

	try {
		const workspaceResult = await store
			.dispatch(
				workspaceApi.endpoints.getWorkspace.initiate({ token, workspaceId })
			)
			.unwrap();

		localStorage.setItem(
			"workspaceMembers",
			JSON.stringify(workspaceResult.data.members)
		);
		const taskResult = await store
			.dispatch(
				taskApi.endpoints.getTasks.initiate({
					token,
					workspaceId: workspaceResult.data._id,
				})
			)
			.unwrap();

		// const workspacesResult = await store.dispatch(
		// 	workspaceApi.endpoints.getWorkspaces.initiate({ workspaceId })
		// );

		if (workspaceResult.error || taskResult.error) return redirect("/login");
		return workspaceResult.data;
	} catch (error: any) {

		toast({
			title: error.data.error,
		});
		if (error.status === 404) return redirect("/create-workspace");
		return redirect("/login");
	}
};
export const taskLoader = async () => {
	const token = localStorage.getItem("token");
	const workspaceId = localStorage.getItem("workspace");
	if (!token) return redirect("/login");

	try {
		const result = await store
			.dispatch(
				taskApi.endpoints.getTasks.initiate({
					token,
					workspaceId,
				})
			)
			.unwrap();
		return result.data;
	} catch (error) {
		toast({
			title: "Something went wrong while fetching tasks",
			description: "Please try again",
		});
		return redirect("/w");
	}
};

export const taskDataLoader = async ({ params }: { params: any }) => {
	const workspaceId = localStorage.getItem("workspace");
	if (!workspaceId) {
		redirect("/login");
	}
	const { taskId } = params;
	try {
		const result = await store
			.dispatch(taskApi.endpoints.getTask.initiate({ workspaceId, taskId }))
			.unwrap();
		return result.data;
	} catch (error) {
		toast({
			title: "Failed to fetch task.",
			description: "please try again!",
			variant: "destructive",
		});
	}
};

export const chatsLoader = async () => {
	const workspaceId = localStorage.getItem("workspace");
	try {
		const chatResponse = await store
			.dispatch(chatApi.endpoints.getChats.initiate({ workspaceId }))
			.unwrap();

		return chatResponse.data;
	} catch (error: any) {
		toast({
			title: "Failed to fetch chats.",
			description: "please try again!",
			variant: "destructive",
		});
	}
};

export const notificationsLoader = async () => {
	try {
		const notificationResponse = await store
			.dispatch(workspaceApi.endpoints.getNotifications.initiate({}))
			.unwrap();

		return notificationResponse.data;
	} catch (error: any) {
		toast({
			title: error.data.error,
			description: "please try again!",
			variant: "destructive",
		});
	}
};
