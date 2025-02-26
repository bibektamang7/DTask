import { HelpCircle, SidebarClose, Settings } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { sidebar_account_lists, sideBar_menu_lists } from "@/constants";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const Sidebar: React.FC<{ workspaceName: string }> = ({ workspaceName }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
	console.log(isSidebarOpen);

	return (
		<div
			className={cn(
				"w-full h-full p-6 bg-background",
				!isSidebarOpen ? "w-fit" : ""
			)}
		>
			<div className="h-full flex flex-col items-start justify-between">
				<div className="w-full">
					<div className="flex items-center justify-between mb-8">
						{isSidebarOpen && (
							<h2 className="text-lg font-semibold line-clamp-1">
								{workspaceName}
							</h2>
						)}
						<SidebarClose
							onClick={() => setIsSidebarOpen((prev) => !prev)}
							className="h-6 w-6 hover:cursor-pointer text-slate-300 "
						/>
					</div>

					<div className={cn("space-y-6", !isSidebarOpen ? "hidden" : "")}>
						<div className="space-y-2">
							{isSidebarOpen && (
								<h3 className="text-sm font-medium text-muted-foreground">
									Menu
								</h3>
							)}
							<nav className={cn("space-y-1", !isSidebarOpen ? "flex gap-2 flex-1 flex-col" : "")}>
								{sideBar_menu_lists.map((ele, index) => (
									<Link
										key={`${ele.title}/${index}`}
										to={ele.redirectTo}
										className="flex w-fit text-sm items-center px-3 py-1 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
									>
										<ele.icon
											className={cn(
												"mr-3 h-4 w-4",
												!isSidebarOpen ? "h-6 w-6" : ""
											)}
										/>
										{isSidebarOpen && ele.title}
									</Link>
								))}
							</nav>
						</div>

						<div className="space-y-2">
							{isSidebarOpen && (
								<h3 className="text-sm font-medium text-muted-foreground">
									Account
								</h3>
							)}
							<nav className="space-y-1">
								{sidebar_account_lists.map((ele, index) => (
									<Link
										key={`${ele.title}/${index}`}
										to={ele.redirectTo}
										className="flex items-center px-3 text-sm py-1 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
									>
										<ele.icon className="mr-3 h-4 w-4" />
										{isSidebarOpen && ele.title}
									</Link>
								))}
							</nav>
						</div>
					</div>
				</div>
				<div className={cn("pt-6 space-y-1", !isSidebarOpen ? "hidden" : '')}>
					<Link
						to="#"
						className="flex text-sm items-center px-3 py-1 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
					>
						<Settings className="mr-3 h-4 w-4" />
						Setting
					</Link>
					<Link
						to="#"
						className="flex text-sm items-center px-3 py-1 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
					>
						<HelpCircle className="mr-3 h-4 w-4" />
						Help
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
