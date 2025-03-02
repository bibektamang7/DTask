import { toast } from "@/hooks/use-toast";
import { workspaceApi } from "@/redux/services/workspaceApi";
import { RootState, store } from "@/redux/store";
import { redirect } from "react-router";
import { taskApi } from "@/redux/services/taskApi";
import { Description } from "@radix-ui/react-toast";

export const workspaceLoader = async () => {
	const token = localStorage.getItem("token");

	if (!token) return redirect("/login");

	try {
		const result = await store.dispatch(
			workspaceApi.endpoints.getWorkspace.initiate(token)
		);

		if (result.error) return redirect("/login");
		return result.data.data;
	} catch (error) {
		toast({
			title: "Something went wrong while fetching workspace",
			description: "Please try again",
		});
		return redirect("/login");
	}
};
export const taskLoader = async () => {
	const token = localStorage.getItem("token");
	// const dispatch = useDispatch();

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
		// dispatch(setTasks(result.data.data));
		// if (result.error) return redirect("/login");
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
