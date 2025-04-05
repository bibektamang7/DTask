import { useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import Sidebar from "./Sidebar";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import Setting from "@/pages/Setting";

const WorkspaceLayout = () => {
	const loaderData = useLoaderData();
	const worksapceId = loaderData._id;
	if (worksapceId) {
		localStorage.setItem("workspace", worksapceId);
	}
	const [isSettingPageOpen, setIsSettingPageOpen] = useState<boolean>(false);
	return (
		<>
			{isSettingPageOpen && (
				<Setting
					workspace={loaderData}
					onSettingPageClose={() => setIsSettingPageOpen(false)}
				/>
			)}
			<div className="max-h-screen bg-background dark">
				<div className="flex flex-row">
					<SidebarProvider className="transition-all duration-300  w-fit z-0">
						<Sidebar
							workspaceName={loaderData.name}
							setIsSettingPageOpen={setIsSettingPageOpen}
						/>
						<SidebarTrigger />
					</SidebarProvider>

					<ScrollArea className="max-h-screen overflow-y-auto scrollbar-hidden flex-1">
						<Outlet />
					</ScrollArea>
				</div>
			</div>
		</>
	);
};

export default WorkspaceLayout;
