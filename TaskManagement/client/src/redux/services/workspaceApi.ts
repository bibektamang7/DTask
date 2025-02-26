import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = "http://localhost:8000/api/v1/";

export const workspaceApi = createApi({
	reducerPath: "workspaces",
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	endpoints: (builder) => ({
		getWorkspace: builder.query({
			query: (token: string) => ({
				url: "/workspaces",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				credentials: "include",
			}),
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
		}),
		removeMemberFromWorkspace: builder.mutation({
			query: (removedMemberInfo) => ({
				url: "/workspaces/members",
				method: "DELETE",
				body: removedMemberInfo,
				credentials: "include",
			}),
		}),
	}),
});

export const {
	useRemoveMemberFromWorkspaceMutation,
	useGetWorkspaceQuery,
	useDeleteWorkspaceMutation,
	useCreateWorkspaceMutation,
	useAddMemberInWorkspaceMutation,
} = workspaceApi;
