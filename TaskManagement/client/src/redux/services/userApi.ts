import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = "http://localhost:8000/";
export const userApi = createApi({
	reducerPath: "users",
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	endpoints: (builder) => ({
		getUser: builder.query({
			query: (userInfo) => ({
				url: "/users",
				body: userInfo,
				credentials: "include",
			}),
		}),
		updateUser: builder.mutation({
			query: (updateUserInfo) => ({
				url: "/users",
				method: "PATCH",
				body: updateUserInfo,
				credentials: "include",
			}),
		}),
		deleteUser: builder.mutation({
			query: (deletedUserInfo) => ({
				url: "/users",
				method: "DELETE",
				body: deletedUserInfo,
				credentials: "include",
			}),
		}),
	}),
});

export const { useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation } =
	userApi;
