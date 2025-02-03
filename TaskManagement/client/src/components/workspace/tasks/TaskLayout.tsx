import { Button } from "@/components/ui/button";
import {
	CheckSquareIcon,
	ClockIcon,
	FilterIcon,
	LayoutDashboardIcon,
	LayoutListIcon,
} from "lucide-react";
import React from "react";
import { Outlet } from "react-router";

const TaskLayout = () => {
	return (
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
								<Button
									variant="ghost"
									size="sm"
									className="px-3">
									<LayoutListIcon className="h-4 w-4 mr-2" />
									Lists
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="px-3 bg-accent">
									<LayoutDashboardIcon className="h-4 w-4 mr-2" />
									Board
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="px-3">
									<ClockIcon className="h-4 w-4 mr-2" />
									Timeline
								</Button>
							</div>
							<Button
								variant="ghost"
								size="icon">
								<FilterIcon className="h-5 w-5" />
							</Button>
							<Button>New Task</Button>
						</div>
					</div>
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default TaskLayout;
