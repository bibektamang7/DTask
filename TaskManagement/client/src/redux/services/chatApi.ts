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
			query: (chatInfo) => ({
				url: "/chats/delete-chat",
				method: "DELETE",
				body: chatInfo,
				credentials: "include",
			}),
		}),

		sendMessage: builder.mutation({
			query: ({ workspaceId, chatId, messageInfo }) => ({
				url: `/chats/${workspaceId}/${chatId}/messages`,
				method:"POST",
				body: messageInfo,
				credentials: "include",
			}),
			invalidatesTags: ["Message"],
		}),
		deleteMessage: builder.mutation({
			query: (deletedMessageInfo) => ({
				url: "/chats/delete-message",
				body: deletedMessageInfo,
				credentials: "include",
			}),
			invalidatesTags: ["Message"],
		}),
		addMember: builder.mutation({
			query: (memeberInfo) => ({
				url: "/chats/add-member",
				body: memeberInfo,
				credentials: "include",
			}),
		}),
		removeMemeber: builder.mutation({
			query: (removedMemberInfo) => ({
				url: "/chats/send-message",
				body: removedMemberInfo,
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
			query: ({workspaceId, chatId}) => ({
				url: `/chats/${workspaceId}/${chatId}/messages`,
				credentials: "include"
			}),
			providesTags: ["Message"]
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
