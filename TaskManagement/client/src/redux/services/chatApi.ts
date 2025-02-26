import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = "http://localhost:8000/";
export const chatApi = createApi({
	reducerPath: "chats",
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	endpoints: (builder) => ({
		createChat: builder.mutation({
			query: (chatInfo) => ({
				url: "/chats/create-chat",
				body: chatInfo,
				credentials: "include",
			}),
		}),
		deleteChat: builder.query({
			query: (chatInfo) => ({
				url: "/chats/delete-chat",
				body: chatInfo,
				credentials: "include",
			}),
		}),
		sendMessage: builder.mutation({
			query: (messageInfo) => ({
				url: "/chats/send-message",
				body: messageInfo,
				credentials: "include",
			}),
		}),
		deleteMessage: builder.mutation({
			query: (deletedMessageInfo) => ({
				url: "/chats/delete-message",
				body: deletedMessageInfo,
				credentials: "include",
			}),
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
	}),
});

export const {
	useDeleteChatQuery,
	useCreateChatMutation,
	useAddMemberMutation,
	useDeleteMessageMutation,
	useLazyDeleteChatQuery,
} = chatApi;
