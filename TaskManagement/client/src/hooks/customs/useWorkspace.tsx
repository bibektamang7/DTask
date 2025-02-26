import { useGetWorkspaceQuery } from "@/redux/services/workspaceApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWorkspace } from "@/redux/features/workspaceSlice";

export const useWorkspace = () => {
	const dispatch = useDispatch();
	const token = localStorage.getItem("token");
	const { data, isLoading } = useGetWorkspaceQuery(token!);

	useEffect(() => {
		if (data) {
			dispatch(setWorkspace(data.data));
		}
	}, [data]);

	return { workspaceData: data.data, isLoading };
};
