import React from "react";
import { Outlet, useLoaderData } from "react-router";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu, PencilIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const WorkspaceLayout = () => {
	const loaderData = useLoaderData();
	const worksapceId = loaderData._id;
	if (worksapceId) {
		localStorage.setItem("workspace", worksapceId);
	}
	return (
		<div className="max-h-screen bg-background dark">
			<div className="flex flex-col md:flex-row">

				{/* Desktop Sidebar */}
				<div className="min-h-screen hidden md:block w-fit border-r">
					<Sidebar workspaceName={loaderData.name} />
				</div>

				{/* Main Content */}
				<ScrollArea className="max-h-screen overflow-y-auto scrollbar-hidden w-full">
					<Outlet />
				</ScrollArea>
			</div>
		</div>
	);
};

export default WorkspaceLayout;
