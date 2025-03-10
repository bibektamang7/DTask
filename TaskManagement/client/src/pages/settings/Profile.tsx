import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/redux/store";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";

const ProfileContent = () => {
	const currentUser = localStorage.getItem("currentUser");
	const workspaceMembers = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);
	const currentWorkspaceMember = workspaceMembers.find(
		(member) => member.user._id === currentUser
	);
	return (
		<div className="space-y-6">
			<div className="flex items-start gap-4">
				<Avatar className="h-16 w-16 rounded-full">
					<AvatarImage
						src=""
						alt={currentWorkspaceMember?.user.username}
						className="rounded-full"
					/>
					<AvatarFallback className="rounded-full flex items-center justify-center text-xl">
						{currentWorkspaceMember?.user.username.charAt(0)}
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className="text-xl font-semibold text-gray-100">
						{currentWorkspaceMember?.user.username}
					</h2>
					<p className="text-sm text-gray-400">
						{currentWorkspaceMember?.user.email}
					</p>
					<div className="flex items-center gap-2 mt-1">
						<Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
							{currentWorkspaceMember?.role}
						</Badge>
					</div>
				</div>
			</div>

			<div className="space-y-4 pt-4 border-t border-gray-800">
				<h3 className="text-md font-medium text-gray-200">
					Profile Information
				</h3>

				<div className="space-y-3">
					<div className="space-y-1">
						<Label
							htmlFor="display-name"
							className="text-gray-300"
						>
							Display Name
						</Label>
						<Input
							id="display-name"
							defaultValue={currentWorkspaceMember?.user.username}
							className="bg-gray-800 border-gray-700 text-gray-200"
						/>
					</div>

					<div className="space-y-1">
						<Label
							htmlFor="email"
							className="text-gray-300"
						>
							Email
						</Label>
						<Input
							id="email"
							defaultValue={currentWorkspaceMember?.user.email}
							className="bg-gray-800 border-gray-700 text-gray-200"
						/>
					</div>
				</div>

				<div className="pt-4">
					<Button>Save Changes</Button>
				</div>
			</div>

			<div className="space-y-4 pt-4 border-t border-gray-800">
				<h3 className="text-md font-medium text-gray-200">Password</h3>

				<div className="space-y-3">
					<div className="space-y-1">
						<Label
							htmlFor="current-password"
							className="text-gray-300"
						>
							Current Password
						</Label>
						<Input
							id="current-password"
							type="password"
							className="bg-gray-800 border-gray-700 text-gray-200"
						/>
					</div>

					<div className="space-y-1">
						<Label
							htmlFor="new-password"
							className="text-gray-300"
						>
							New Password
						</Label>
						<Input
							id="new-password"
							type="password"
							className="bg-gray-800 border-gray-700 text-gray-200"
						/>
					</div>

					<div className="space-y-1">
						<Label
							htmlFor="confirm-password"
							className="text-gray-300"
						>
							Confirm New Password
						</Label>
						<Input
							id="confirm-password"
							type="password"
							className="bg-gray-800 border-gray-700 text-gray-200"
						/>
					</div>
				</div>

				<div className="pt-2">
					<Button>Update Password</Button>
				</div>
			</div>
		</div>
	);
};

export default ProfileContent;
