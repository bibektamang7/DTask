import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8000/api/v1";

export const taskApi = createApi({
	reducerPath: "tasks",
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
	tagTypes: ["Task", "Attachment", "Comment"],
	endpoints: (builder) => ({
		getTask: builder.query({
			query: ({ workspaceId, taskId }) => ({
				url: `/tasks/${workspaceId}?taskId=${taskId}`,
				credentials: "include",
			}),
			providesTags: ["Task"],
		}),
		createTask: builder.mutation({
			query: ({ taskInfo, workspaceId }) => ({
				url: `/tasks/${workspaceId}`,
				method: "POST",
				body: taskInfo,
				credentials: "include",
			}),

			invalidatesTags: ["Task"],
		}),
		updateTask: builder.mutation({
			query: ({ taskId, workspaceId, taskUpdateInfo }) => ({
				url: `/tasks/${workspaceId}/updateTask/${taskId}`,
				method: "PATCH",
				credentials: "include",
				body: taskUpdateInfo,
			}),
			invalidatesTags: ["Task"],
		}),
		deleteTask: builder.mutation({
			query: (deletedTaskInfo) => ({
				url: "/tasks",
				method: "DELETE",
				body: deletedTaskInfo,
				credentials: "include",
			}),
			invalidatesTags: ["Task"],
		}),
		addAttachment: builder.mutation({
			query: ({ workspaceId, taskId, attachmentInfo }) => ({
				url: `/tasks/${workspaceId}/attachments/${taskId}`,
				method: "POST",
				body: attachmentInfo,
				credentials: "include",
			}),
			invalidatesTags: ["Attachment", "Task"],
		}),
		removeAttachment: builder.mutation({
			query: (removedAttachment) => ({
				url: "/tasks/attachments",
				method: "DELETE",
				body: removedAttachment,
				credentials: "include",
			}),
			invalidatesTags: ["Attachment", "Task"],
		}),
		createComment: builder.mutation({
			query: ({ workspaceId, taskId, commentInfo }) => ({
				url: `/tasks/${workspaceId}/${taskId}/comments`,
				method: "POST",
				body: commentInfo,
				credentials: "include",
			}),
			invalidatesTags: ["Comment", "Task"],
		}),
		deleteComment: builder.mutation({
			query: ({ workspaceId, taskId, commentId }) => ({
				url: `/tasks/${workspaceId}/${taskId}/comments?commentId=${commentId}`,
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: ["Comment", "Task"],
		}),
		getTasks: builder.query({
			query: ({ token, workspaceId }) => ({
				url: `/tasks/${workspaceId}/getTasks`,
				headers: {
					Authorization: `Bearer ${token}`,
				},
				credentials: "include",
			}),
			providesTags: ["Task"],
		}),
		updateTaskEditor: builder.mutation({
			query: ({ workspaceId, taskId, editorStateData }) => ({
				method: "PATCH",
				url: `/tasks/${workspaceId}?taskId=${taskId}`,
				body: editorStateData,
				credentials: "include",
			}),
			invalidatesTags: ["Task"],
		}),
	}),
});

export const {
	useAddAttachmentMutation,
	useCreateCommentMutation,
	useCreateTaskMutation,
	useDeleteCommentMutation,
	useDeleteTaskMutation,
	useGetTaskQuery,
	useRemoveAttachmentMutation,
	useGetTasksQuery,
	useUpdateTaskEditorMutation,
	useUpdateTaskMutation,
} = taskApi;
