import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = "http://localhost:8000/api/v1/";
export const authApi = createApi({
	reducerPath: "authentication",
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	endpoints: (builder) => ({
		registerUser: builder.mutation({
			query: (registerData) => ({
				url: "/users/signup",
				method: "POST",
				body: registerData,
			}),
		}),
		loginUser: builder.mutation({
			query: (loginInfo) => ({
				url: "/users/login",
				method: "POST",
				body: loginInfo,
			}),
		}),
		registerWithGoogle: builder.mutation({
			query: () => ({
				url: "/users/google",
				redirect: "follow",
				method: "GET",
			}),
		}),
		logoutUser: builder.mutation({
			query: ({ token }) => ({
				url: "/users/logout",
				method: "POST",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
	}),
});

export const {
	useRegisterUserMutation,
	useLogoutUserMutation,
	useRegisterWithGoogleMutation,
	useLoginUserMutation,
} = authApi;
