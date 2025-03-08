import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { chatApi } from "./services/chatApi";
import { workspaceApi } from "./services/workspaceApi";
import { userApi } from "./services/userApi";
import userSlice from "./features/authSlice";
import chatSlice from "./features/chatSlice";
import taskSlice from "./features/taskSlice";
import workspaceSlice from "./features/workspaceSlice";
import { taskApi } from "./services/taskApi";

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[chatApi.reducerPath]: chatApi.reducer,
		[workspaceApi.reducerPath]: workspaceApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
		[taskApi.reducerPath]: taskApi.reducer,
		Users: userSlice.reducer,
		Workspaces: workspaceSlice.reducer,
		Chats: chatSlice.reducer,
		Tasks: taskSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authApi.middleware,
			workspaceApi.middleware,
			taskApi.middleware,
			chatApi.middleware,
		),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
