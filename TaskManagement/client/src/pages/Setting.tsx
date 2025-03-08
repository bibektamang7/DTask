import React from "react";
import { useState } from "react";
import type { Workspace } from "@/types/workspace";
import { X } from "lucide-react";
import SettingSidebar from "./settings/SettingSidebar";
import ProfileContent from "./settings/Profile";
import MembersContent from "./settings/Members";

interface SettingProps {
	onSettingPageClose: () => void;
	workspace: Workspace;
}

type SettingView = "profile" | "members";

const SettingMainContent = ({ activeView }: { activeView: SettingView }) => {
	return (
		<section className="h-full overflow-y-auto scrollbar-hidden">
			{activeView === "profile" && <ProfileContent />}
			{activeView === "members" && <MembersContent />}
		</section>
	);
};

const Setting: React.FC<SettingProps> = ({ onSettingPageClose }) => {
	const [activeView, setActiveView] = useState<SettingView>("profile");

	return (
		<section className="fixed top-0 left-0 h-screen w-screen overflow-hidden backdrop-blur-sm z-[10]">
			<div className="w-full h-full flex items-center justify-center p-4">
				<div className="relative w-full max-w-5xl h-[80%] bg-gray-900 rounded-md border border-gray-800 shadow-xl">
					<button
						onClick={onSettingPageClose}
						className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
						aria-label="Close settings"
					>
						<X className="h-5 w-5" />
					</button>
					<div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
						<div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-gray-800 p-4">
							<SettingSidebar
								activeView={activeView}
								setActiveView={setActiveView}
							/>
						</div>
						<div className="flex-1 p-6 bg-black/20 overflow-y-auto">
							<SettingMainContent activeView={activeView} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Setting;
