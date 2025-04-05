import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const userApi = createApi({
	reducerPath: "users",
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	tagTypes: ["User"],
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
		getUsersByEmail: builder.query({
			query: ({ email, token }) => ({
				url: `/users/getUser?email=${email}`,
				credentials: "include",
				headers: {
					authorization: `Bearer ${token}`,
				},
			}),
		}),
		setUsername: builder.mutation({
			query: ({ username, token }) => ({
				url: "/users/username",
				method: "PATCH",
				body: { username },
				headers: {
					authorization: `Bearer ${token}`,
				},
				credentials: "include",
			}),
			invalidatesTags: ["User"],
		}),
	}),
});

export const {
	useGetUserQuery,
	useUpdateUserMutation,
	useDeleteUserMutation,
	useLazyGetUsersByEmailQuery,
	useSetUsernameMutation,
} = userApi;
