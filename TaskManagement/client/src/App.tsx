import React, { Suspense } from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router";
import Not_Fount from "./components/Not_Fount";

import Error from "./components/Error";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import ErrorComponent from "./components/ErrorComponent";
import Loader from "./components/Loader";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardPage from "./components/workspace/Dashboard";
import BoardView from "./pages/Tasks/BoardView";
import WorkspaceChat from "./pages/chats/Chat";
import WorkspaceLayout from "./components/workspace/WorkspaceLayout";
import ChatLayout from "./components/workspace/chats/ChatLayout";
import TaskLayout from "./components/workspace/tasks/TaskLayout";
import { Calendar } from "./components/ui/calendar";
import AuthLayout from "./components/AuthLayout";

import { taskLoader, workspaceLoader } from "./helpers/api";
import { ListView } from "./pages/Tasks/ListView";

const router = createBrowserRouter(
	createRoutesFromElements(
		<React.Fragment>
			<Route
				path="/"
				element={<RootLayout />}
				errorElement={<Error />}
			>
				<Route
					index
					element={<Home />}
					errorElement={<ErrorComponent />}
				/>
			</Route>
			<Route
				path="signup"
				element={<Signup />}
				errorElement={<ErrorComponent />}
			/>
			<Route
				path="login"
				element={<Login />}
			/>

			<Route
				path="/w"
				loader={workspaceLoader}
				element={
					<AuthLayout>
						<WorkspaceLayout />
					</AuthLayout>
				}
			>
				<Route
					index
					element={<DashboardPage />}
				/>
				<Route
					path="chats"
					element={<ChatLayout />}
				>
					<Route
						index
						element={<WorkspaceChat />}
					/>
				</Route>
				<Route
					path="tasks"
					element={<TaskLayout />}
					loader={taskLoader}
				>
					<Route
						index
						element={<ListView />}
					/>
					<Route
						index
						path="boardview"
						element={<BoardView />}
					/>
				</Route>
				<Route
					path="calendar"
					element={<Calendar />}
				/>
			</Route>

			<Route
				path="*"
				element={<Not_Fount />}
			/>
		</React.Fragment>
	)
);

const App = () => {
	return (
		<Suspense fallback={<Loader />}>
			<RouterProvider router={router} />
		</Suspense>
	);
};

export default App;
