import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SettingsIcon, Users } from "lucide-react";

type SettingView = "profile" | "members";

const SettingSidebar = ({
	activeView,
	setActiveView,
}: {
	activeView: SettingView;
	setActiveView: (view: SettingView) => void;
}) => {
	return (
		<section className="h-full flex flex-col">
			<div className="flex-1">
				<div>
					<p className="text-sm font-light text-gray-400">Account</p>
					<div
						className={`flex items-center justify-start gap-4 mt-2 px-2 py-2 rounded-md ${
							activeView === "profile" ? "bg-gray-800" : "hover:bg-gray-800/50"
						} cursor-pointer transition-colors`}
						onClick={() => setActiveView("profile")}
					>
						<Avatar className="h-8 w-8 rounded-full">
							<AvatarImage
								src=""
								alt="Bibek Tamang"
								className="rounded-full"
							/>
							<AvatarFallback className="bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
								B
							</AvatarFallback>
						</Avatar>
						<span className="text-sm text-gray-300">Bibek Tamang</span>
					</div>
				</div>
				<div className="mt-6">
					<p className="text-sm font-light text-gray-400">Workspace</p>
					<div className="px-2">
						<ul className="flex flex-col gap-2 mt-2">
							<li
								className={`text-sm text-gray-300 px-2 py-2 rounded-md flex items-center gap-2 ${
									activeView === "members"
										? "bg-gray-800"
										: "hover:bg-gray-800/50"
								} cursor-pointer transition-colors`}
								onClick={() => setActiveView("members")}
							>
								<Users className="h-4 w-4" />
								Members
							</li>
							<li className="text-sm text-gray-300 px-2 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800/50 cursor-pointer transition-colors">
								<SettingsIcon className="h-4 w-4" />
								General
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="mt-auto pb-4">
				<Button className="w-full">Leave Workspace</Button>
			</div>
		</section>
	);
};

export default SettingSidebar;
