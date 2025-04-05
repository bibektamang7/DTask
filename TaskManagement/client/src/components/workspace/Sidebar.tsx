import { Link } from "react-router";
import { sidebar_account_lists, sideBar_menu_lists } from "@/constants";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Check, ChevronDown, HelpCircle, Settings } from "lucide-react";
import { useLogout } from "@/hooks/customs/useLogout";
import { useEffect, useState } from "react";
import { useLazyGetWorkspacesQuery } from "@/redux/services/workspaceApi";
import { toast } from "@/hooks/use-toast";
import Loader from "../Loader";
import { Workspace } from "@/types/workspace";

interface MySidebarProps {
	workspaceName: string;
	setIsSettingPageOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MySidebar: React.FC<MySidebarProps> = ({
	workspaceName,
	setIsSettingPageOpen,
}) => {
	const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
	const workspaceId = localStorage.getItem("workspace");
	const { handleLogout, isLoading } = useLogout();
	const [getWorkspaces, { isLoading: dropDownWorkspaceLoading }] =
		useLazyGetWorkspacesQuery();

	const handleGetWorkspaces = async () => {
		try {
			const response = await getWorkspaces({ workspaceId }).unwrap();
			setWorkspaces(response.data);
		} catch (error: any) {
			toast({
				title: error.data.error,
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	const handleChangeWorkspace = (clickedWorkspaceId: string) => {
		if (clickedWorkspaceId !== workspaceId) {
			localStorage.setItem("workspace", clickedWorkspaceId);
			localStorage.removeItem("currentChat");
			window.location.reload();
		}
	};

	useEffect(() => {
		handleGetWorkspaces();
	}, []);
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									{workspaceName}
									<ChevronDown className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[--radix-popper-anchor-width]">
								<DropdownMenuLabel className="text-xs text-gray-400">
									Workspaces
								</DropdownMenuLabel>
								<div className="px-2">
									{dropDownWorkspaceLoading ? (
										<Loader />
									) : (
										workspaces.length > 0 &&
										workspaces.map((workspace) => (
											<DropdownMenuItem
												key={workspace._id}
												onClick={() => handleChangeWorkspace(workspace._id)}
												className="hover:cursor-pointer hover:ease-in  hover:bg-muted"
											>
												<div className="flex items-center justify-between w-full">
													<span className="text-sm tracking-tight font-light">
														{workspace.name}
													</span>
													{workspaceId === workspace._id && <Check size={14} />}
												</div>
											</DropdownMenuItem>
										))
									)}
								</div>
								<DropdownMenuItem
									onClick={handleLogout}
									className="hover:cursor-pointer hover:ease-in border-border border-2  hover:bg-muted mt-2"
								>
									<span className="text-sm tracking-tight font-light">
										{isLoading ? <>Loading...</> : "Logout"}
									</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{sideBar_menu_lists.map((ele, index) => (
								<Link
									key={`${ele.title}/${index}`}
									to={ele.redirectTo}
									className="flex w-fit text-sm items-center px-3 py-1 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
								>
									<ele.icon className={cn("mr-3 h-4 w-4")} />
									{ele.title}
								</Link>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Account</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{sidebar_account_lists.map((ele, index) => (
								<Link
									key={`${ele.title}/${index}`}
									to={ele.redirectTo}
									className="flex w-fit text-sm items-center px-3 py-1 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
								>
									<ele.icon className={cn("mr-3 h-4 w-4")} />
									{ele.title}
								</Link>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<div
							onClick={() => setIsSettingPageOpen(true)}
							className="hover:cursor-pointer flex w-fit text-sm items-center px-3 py-1 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground"
						>
							<Settings className={cn("mr-3 h-4 w-4")} />
							Setting
						</div>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<div className="flex w-fit text-sm items-center px-3 py-1 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground">
							<HelpCircle className={cn("mr-3 h-4 w-4")} />
							Help
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};

export default MySidebar;
