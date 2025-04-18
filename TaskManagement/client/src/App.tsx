import React, { Suspense, lazy } from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router";

const Not_Fount = lazy(() => import("@/components/Not_Fount"));

const Error = lazy(() => import("@/components/Error"));
// import Error from "./components/Error";
const RootLayout = lazy(() => import("@/components/RootLayout"));
// import RootLayout from "./components/RootLayout";
const Home = lazy(() => import("@/pages/Home"));
// import Home from "./pages/Home";
const ErrorComponent = lazy(() => import("@/components/ErrorComponent"));
// import ErrorComponent from "./components/ErrorComponent";
const Loader = lazy(() => import("@/components/Loader"));
// import Loader from "./components/Loader";
const Login = lazy(() => import("@/pages/Login"));
// import Login from "./pages/Login";
const Signup = lazy(() => import("@/pages/Signup"));
// import Signup from "./pages/Signup";
const DashboardPage = lazy(() => import("@/components/workspace/Dashboard"));
// import DashboardPage from "./components/workspace/Dashboard";
const BoardView = lazy(() => import("@/pages/Tasks/BoardView"));
// import BoardView from "./pages/Tasks/BoardView";
const WorkspaceChat = lazy(() => import("@/pages/chats/Chat"));

// import WorkspaceChat from "./pages/chats/Chat";
// import WorkspaceLayout from "./components/workspace/WorkspaceLayout";
const WorkspaceLayout = lazy(
	() => import("@/components/workspace/WorkspaceLayout")
);
const TaskLayout = lazy(
	() => import("@/components/workspace/tasks/TaskLayout")
);
// import TaskLayout from "./components/workspace/tasks/TaskLayout";
const ContainerLayout = lazy(() => import("@/components/ContainerLayout"));
// import ContainerLayout from "./components/ContainerLayout";
import OuthSuccess from "./pages/OuthSuccess";

import {
	chatsLoader,
	notificationsLoader,
	taskDataLoader,
	taskLoader,
	workspaceLoader,
} from "./helpers/api";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MobileApp from "./pages/MobileApp";
import Pricing from "./pages/Pricing";
import Feature from "./pages/Feature";
import AuthLayout from "./components/AuthLayout";

const ListView = lazy(() => import("@/pages/Tasks/ListView"));
// import { ListView } from "./pages/Tasks/ListView";
const Task = lazy(() => import("@/pages/Tasks/Task"));
// import Task from "./pages/Tasks/Task";
const CreateWorkspace = lazy(() => import("@/pages/CreateWorkspace"));
// import CreateWorkspace from "./pages/CreateWorkspace";
const SetUsername = lazy(() => import("@/pages/SetUsername"));
// import SetUsername from "./pages/SetUsername";
const Notification = lazy(() => import("@/pages/notifications/Notification"));
// import Notification from "./pages/notifications/Notification";

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
				<Route
					path="/about"
					element={<About />}
				/>
				<Route
					path="/features"
					element={<Feature />}
				/>
				<Route
					path="/pricing"
					element={<Pricing />}
				/>
				<Route
					path="/app"
					element={<MobileApp />}
				/>
				<Route
					path="/contact"
					element={<Contact />}
				/>
			</Route>
			<Route
				path="signup"
				element={<Signup />}
				errorElement={<ErrorComponent />}
			/>
			<Route
				path="login"
				element={
					<AuthLayout>
						<Login />
					</AuthLayout>
				}
			/>

			<Route
				path="/w"
				loader={workspaceLoader}
				element={
					<ContainerLayout>
						<WorkspaceLayout />
					</ContainerLayout>
				}
			>
				<Route
					index
					element={<DashboardPage />}
				/>

				<Route
					path="chats"
					element={<WorkspaceChat />}
					loader={chatsLoader}
				/>
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
						path="boardview"
						element={<BoardView />}
					/>
				</Route>
				{/* <Route
					path="calendar"
					element={< >Not ve</>}
				/> */}
				<Route
					path="task/:taskId"
					element={<Task />}
					loader={taskDataLoader}
				/>
				<Route
					element={<Notification />}
					path="notifications"
					loader={notificationsLoader}
				/>
			</Route>
			<Route
				path="create-workspace"
				element={<CreateWorkspace />}
			/>
			<Route
				path="set-username"
				element={<SetUsername />}
			/>
			<Route
				path="/oauth-success"
				element={<OuthSuccess />}
			/>
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
