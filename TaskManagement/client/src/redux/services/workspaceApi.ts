import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = "http://localhost:8000/api/v1/";

export const workspaceApi = createApi({
	reducerPath: "workspaces",
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		prepareHeaders: (headers) => {
			const token = localStorage.getItem("token");
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	}),
	tagTypes: ["Todo", "Workspace"],
	endpoints: (builder) => ({
		getWorkspace: builder.query({
			query: (token: string) => ({
				url: "/workspaces",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				credentials: "include",
			}),
			providesTags: ["Workspace", "Todo"],
		}),
		createWorkspace: builder.mutation({
			query: (workspaceInfo) => ({
				url: "/workspaces",
				method: "POST",
				body: workspaceInfo,
				credentials: "include",
			}),
		}),
		deleteWorkspace: builder.mutation({
			query: (deletedWorkspaceInfo) => ({
				url: "/worksaces",
				method: "DELETE",
				body: deletedWorkspaceInfo,
				credentials: "include",
			}),
		}),
		addMemberInWorkspace: builder.mutation({
			query: (memberInfo) => ({
				url: "/workspaces/members",
				method: "POST",
				body: memberInfo,
				credentials: "include",
			}),
			invalidatesTags: ["Workspace"],
		}),
		removeMemberFromWorkspace: builder.mutation({
			query: (removedMemberInfo) => ({
				url: "/workspaces/members",
				method: "DELETE",
				body: removedMemberInfo,
				credentials: "include",
			}),
			invalidatesTags: ["Workspace"],
		}),
		addTodo: builder.mutation({
			query: ({ title, workspaceId }) => ({
				url: `/workspaces/members/${workspaceId}/todos`,
				method: "POST",
				body: {
					title,
				},
				credentials: "include",
			}),
			invalidatesTags: ["Todo", "Workspace"],
		}),
		deleteTodo: builder.mutation({
			query: ({ todoId, workspaceId }) => ({
				url: `/workspaces/members/${workspaceId}/todos?todoId=${todoId}`,
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: ["Workspace", "Todo"],
		}),
		updateTodo: builder.mutation({
			query: ({ todoId, workspaceId, isTick }) => ({
				url: `/workspaces/members/${workspaceId}/todos`,
				method: "PATCH",
				body: {
					todoId,
					isTick,
				},
			}),
			invalidatesTags: ["Workspace", "Todo"],
		}),
	}),
});

export const {
	useRemoveMemberFromWorkspaceMutation,
	useGetWorkspaceQuery,
	useDeleteWorkspaceMutation,
	useCreateWorkspaceMutation,
	useAddMemberInWorkspaceMutation,
	useAddTodoMutation,
	useDeleteTodoMutation,
	useUpdateTodoMutation,
} = workspaceApi;
