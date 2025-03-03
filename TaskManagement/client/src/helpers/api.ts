import { toast } from "@/hooks/use-toast";
import { workspaceApi } from "@/redux/services/workspaceApi";
import { store } from "@/redux/store";
import { redirect } from "react-router";
import { taskApi } from "@/redux/services/taskApi";

export const workspaceLoader = async () => {
	const token = localStorage.getItem("token");

	if (!token) return redirect("/login");

	try {
		const workspaceResult = await store
			.dispatch(workspaceApi.endpoints.getWorkspace.initiate(token))
			.unwrap();
		const taskResult = await store
			.dispatch(
				taskApi.endpoints.getTasks.initiate({
					token,
					workspaceId: workspaceResult.data._id,
				})
			)
			.unwrap();

		if (workspaceResult.error || taskResult.error) return redirect("/login");
		return workspaceResult.data;
	} catch (error) {
		console.log(error);

		toast({
			title: "Something went wrong while fetching workspace",
			description: "Please try again",
		});
		return redirect("/login");
	}
};
export const taskLoader = async () => {
	const token = localStorage.getItem("token");
	if (!token) return redirect("/login");
	const workspace = store.getState().Workspaces.workspace;
	try {
		const result = await store
			.dispatch(
				taskApi.endpoints.getTasks.initiate({
					token,
					workspaceId: workspace._id,
				})
			)
			.unwrap();
		return result.data.data;
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
