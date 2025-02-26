import React from "react";
import { Outlet, useLoaderData } from "react-router";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu, PencilIcon } from "lucide-react";

const WorkspaceLayout = () => {
	const loaderData = useLoaderData();
	const worksapceId = loaderData._id;
	if(worksapceId) {
		localStorage.setItem("workspace", worksapceId);
	}
	return (
		<div className="min-h-screen bg-background dark">
			<div className="flex flex-col md:flex-row">
				{/* Mobile Header */}
				<div className="md:hidden flex items-center justify-between p-4 border-b">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
							>
								<Menu className="h-6 w-6" />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="left"
							className="w-64 p-0"
						>
							<Sidebar workspaceName={loaderData.name} />
						</SheetContent>
					</Sheet>
					<h1 className="text-lg font-semibold">Dashboard</h1>
					<Button
						variant="ghost"
						size="icon"
					>
						<PencilIcon className="h-6 w-6" />
					</Button>
				</div>

				{/* Desktop Sidebar */}
				<div className="min-h-screen hidden md:block w-fit border-r">
					<Sidebar workspaceName={loaderData.name} />
				</div>

				{/* Main Content */}
				<Outlet />
			</div>
		</div>
	);
};

export default WorkspaceLayout;
