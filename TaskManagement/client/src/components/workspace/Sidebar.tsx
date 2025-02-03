import React from "react";
import {
	BellIcon,
	CalendarIcon,
	CheckSquareIcon,
	HelpCircle,
	LayoutDashboardIcon,
	MessageSquareIcon,
	PencilIcon,
	Settings,
	UserIcon,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";

const Sidebar = () => {
	return (
		<div className="w-full h-full p-6 bg-background">
			<div className="h-full flex flex-col items-start justify-between">
				<div>
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-xl font-semibold">Bibek Tamang</h2>
						<Button
							variant="ghost"
							size="icon"
							className="md:flex">
							<PencilIcon className="h-5 w-5" />
						</Button>
					</div>

					<div className="space-y-6">
						<div className="space-y-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Menu
							</h3>
							<nav className="space-y-1">
								<Link
									to="/w"
									className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground">
									<LayoutDashboardIcon className="mr-3 h-5 w-5" />
									Dashboard
								</Link>
								<Link
									to="/w/tasks"
									className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground">
									<CheckSquareIcon className="mr-3 h-5 w-5" />
									Tasks
								</Link>
								<Link
									to="/w/calendar"
									className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground">
									<CalendarIcon className="mr-3 h-5 w-5" />
									Calendar
								</Link>
							</nav>
						</div>

						<div className="space-y-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Account
							</h3>
							<nav className="space-y-1">
								<Link
									to="#"
									className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground">
									<UserIcon className="mr-3 h-5 w-5" />
									User
								</Link>
								<Link
									to="/w/chats"
									className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground">
									<MessageSquareIcon className="mr-3 h-5 w-5" />
									Chat
								</Link>
								<Link
									to="#"
									className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground">
									<BellIcon className="mr-3 h-5 w-5" />
									Notifications
								</Link>
							</nav>
						</div>
					</div>
				</div>
				<div className="pt-6 space-y-1">
					<Link
						to="#"
						className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground">
						<Settings className="mr-3 h-5 w-5" />
						Setting
					</Link>
					<Link
						to="#"
						className="flex items-center px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground">
						<HelpCircle className="mr-3 h-5 w-5" />
						Help
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
