import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = "http://localhost:8000/api/v1";
export const chatApi = createApi({
	reducerPath: "chats",
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
	tagTypes: ["Chat", "Message"],
	endpoints: (builder) => ({
		createChat: builder.mutation({
			query: ({ workspaceId, chatInfo }) => ({
				url: `/chats/${workspaceId}`,
				body: chatInfo,
				method: "POST",
				credentials: "include",
			}),
			invalidatesTags: ["Chat"],
		}),
		deleteChat: builder.mutation({
			query: ({ workspaceId, chatId }) => ({
				url: `/chats/${workspaceId}?chatId=${chatId}`,
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: ["Chat"],
		}),

		sendMessage: builder.mutation({
			query: ({ workspaceId, chatId, messageInfo }) => ({
				url: `/chats/${workspaceId}/${chatId}/messages`,
				method: "POST",
				body: messageInfo,
				credentials: "include",
			}),
			invalidatesTags: ["Message"],
		}),
		deleteMessage: builder.mutation({
			query: ({ workspaceId, chatId, messageId }) => ({
				url: `/chats/${workspaceId}/${chatId}/messages?messageId=${messageId}`,
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: ["Message"],
		}),
		addMember: builder.mutation({
			query: ({ workspaceId, chatId, memberId }) => ({
				url: `/chats/${workspaceId}/${chatId}/members/${memberId}`,
				method: "POST",
				credentials: "include",
			}),
		}),
		removeMemeber: builder.mutation({
			query: ({ workspaceId, chatId, memberId }) => ({
				url: `/chats/${workspaceId}/${chatId}/members/${memberId}`,
				method: "DELETE",
				credentials: "include",
			}),
		}),
		getChats: builder.query({
			query: ({ workspaceId }) => ({
				url: `/chats/${workspaceId}/getChats`,
				credentials: "include",
			}),
			providesTags: ["Chat"],
		}),
		getChat: builder.query({
			query: ({ workspaceId, chatId }) => ({
				url: `/chats/${workspaceId}?chatId=${chatId}`,
				credentials: "include",
			}),
			providesTags: ["Message"],
		}),
		getChatMessage: builder.query({
			query: ({ workspaceId, chatId }) => ({
				url: `/chats/${workspaceId}/${chatId}/messages`,
				credentials: "include",
			}),
			providesTags: ["Message"],
		}),
	}),
});

export const {
	useCreateChatMutation,
	useDeleteChatMutation,
	useAddMemberMutation,
	useDeleteMessageMutation,
	useGetChatsQuery,
	useGetChatQuery,
	useSendMessageMutation,
	useGetChatMessageQuery,
} = chatApi;
