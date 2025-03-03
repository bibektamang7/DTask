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
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, HelpCircle, Settings } from "lucide-react";
import { useLogout } from "@/hooks/customs/useLogout";

interface  MySidebarProps{
	workspaceName: string;
	setIsSettingPageOpen: React.Dispatch<React.SetStateAction<boolean>>
}



const MySidebar: React.FC<MySidebarProps> = ({ workspaceName , setIsSettingPageOpen}) => {
	const {handleLogout, isLoading} = useLogout();
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
									<DropdownMenuItem onClick={handleLogout}  className="hover:cursor-pointer hover:ease-in  hover:bg-muted">
										<span className="text-sm tracking-tight font-light">{isLoading ? <>Loading...</>: "Logout"}</span>
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
										<SidebarMenuBadge>5</SidebarMenuBadge>
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
										<SidebarMenuBadge>5</SidebarMenuBadge>
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
