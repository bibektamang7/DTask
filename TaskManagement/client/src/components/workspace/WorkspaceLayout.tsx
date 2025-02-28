import React from "react";
import { Outlet, useLoaderData } from "react-router";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu, PencilIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

const WorkspaceLayout = () => {
	const loaderData = useLoaderData();
	const worksapceId = loaderData._id;
	if (worksapceId) {
		localStorage.setItem("workspace", worksapceId);
	}
	return (
		<div className="max-h-screen bg-background dark">
			<div className="flex flex-row">
				<SidebarProvider
					className="transition-all duration-300  w-fit z-0"
				>
					<Sidebar
						workspaceName={loaderData.name}
					/>
					<SidebarTrigger />
				</SidebarProvider>

				<ScrollArea className="max-h-screen overflow-y-auto scrollbar-hidden flex-1">
					<Outlet />
				</ScrollArea>
			</div>
		</div>
	);
};

export default WorkspaceLayout;
