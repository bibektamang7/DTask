import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import {
	CheckSquareIcon,
	ClockIcon,
	FilterIcon,
	LayoutDashboardIcon,
	LayoutListIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLoaderData } from "react-router";
import NewTaskForm from "./NewTaskForm";
import { setTasks } from "@/redux/features/taskSlice";

const TaskLayout = () => {
	// const {_id} = useSelector((state: RootState) => state.Workspaces.workspace)
	const dispatch = useDispatch();
	const tasks = useLoaderData();
	dispatch(setTasks(tasks));

	const [isNewTaskForm, setIsNewTaskForm] = useState<boolean>(false);

	return (
		<>
			{isNewTaskForm && (
				<NewTaskForm
					workspaceId="123"
					onTaskAdded={() => console.log("hello")}
					onClose={() => setIsNewTaskForm(false)}
				/>
			)}
			<div className="w-full flex min-h-screen bg-background">
				<main className="flex-1 p-8">
					<div className="max-w-7xl mx-auto">
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center space-x-2">
								<div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
									<CheckSquareIcon className="h-5 w-5 text-white" />
								</div>
								<h1 className="text-2xl font-semibold">Tasks</h1>
							</div>

							<div className="flex items-center space-x-4">
								<div className="flex items-center rounded-lg border border-border p-1">
									<Link to={``}>
									<Button
										variant="ghost"
										size="sm"
										className="px-3"
									>
										<LayoutListIcon className="h-4 w-4 mr-2" />
										Lists
									</Button>
									</Link>
									<Link to={`boardview`}>
										<Button
											variant="ghost"
											size="sm"
											className="px-3 bg-accent"
										>
											<LayoutDashboardIcon className="h-4 w-4 mr-2" />
											Board
										</Button>
									</Link>
									<Button
										variant="ghost"
										size="sm"
										className="px-3"
									>
										<ClockIcon className="h-4 w-4 mr-2" />
										Timeline
									</Button>
								</div>
								<Button
									variant="ghost"
									size="icon"
								>
									<FilterIcon className="h-5 w-5" />
								</Button>
								<Button onClick={() => setIsNewTaskForm(true)}>New Task</Button>
							</div>
						</div>
						<Outlet />
					</div>
				</main>
			</div>
		</>
	);
};

export default TaskLayout;
