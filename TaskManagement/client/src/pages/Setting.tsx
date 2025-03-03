import { AvatarFallback } from "@/components/ui/avatar";
import { Workspace } from "@/types/workspace";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

interface SettingProps {
	onSettingPageClose: () => void;
	workspace: Workspace;
}

const SettingSideBar = () => {
	return (
		<section>
			<div>
				<div>
					<p className="text-sm font-light">Account</p>
					<div className="flex items-center justify-start gap-4">
						<Avatar>
							<AvatarImage
								src=""
								alt=""
							/>
							<AvatarFallback>B</AvatarFallback>
						</Avatar>
						<span className="text-sm">Bibek Tamang</span>
					</div>
					<div className="flex items-center justify-center gap-4">
						
					</div>
				</div>
				<div>
					<p className="text-sm font-light">Workspace</p>
				</div>
				<div></div>
			</div>
		</section>
	);
};

const SettingMainContent = () => {
	return <section>Setting main content</section>;
};

const Setting: React.FC<SettingProps> = ({ onSettingPageClose, workspace }) => {
	return (
		<section className="fixed top-0 left-0 h-screen w-screen overflow-hidden backdrop-blur-sm z-[10]">
			<div className="w-full h-full flex items-center justify-center">
				<div className="relative w-[70%] h-[80%] bg-muted rounded-md">
					<span
						onClick={onSettingPageClose}
						className="hover:cursor-pointer hover:scale-110 absolute right-3 text-muted-foreground"
					>
						x
					</span>
					<div className="w-full h-full flex">
						<div className="relative w-60 h-full p-4">
							<SettingSideBar />
						</div>
						<div className="flex-1 p-4 bg-black/30">
							<SettingMainContent />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Setting;
