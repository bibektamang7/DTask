import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddMember } from "@/hooks/customs/workspace/useAddMember";
import { toast } from "@/hooks/use-toast";
import { useLazyGetUsersByEmailQuery } from "@/redux/services/userApi";
import { RootState } from "@/redux/store";
import { User } from "@/types/user";
import { WorkspaceMember } from "@/types/workspace";
import { Mail, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const MembersContent = () => {
	const token = localStorage.getItem("token");
	const workspaceMembers = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);
	const [searchedUser, setSearchedUser] = useState<User | null>(null);
	const [searchEmail, setSearchQuery] = useState("");
	const [inviteEmail, setInviteEmail] = useState("");
	const [selectedRole, setSelectedRole] =
		useState<WorkspaceMember["role"]>("Member");

	const [getUser, { isLoading }] = useLazyGetUsersByEmailQuery();
	const { handleAddMember, addMemberLoading } = useAddMember();

	const handleSendInvitation = async () => {
		await handleAddMember({
			member: {
				userId: searchedUser?._id,
				role: selectedRole,
				isJoined: false,
			},
		});
	};

	const filteredMembers = workspaceMembers.filter(
		(member) =>
			member.user.username.toLowerCase().includes(searchEmail.toLowerCase()) ||
			member.user.email.toLowerCase().includes(searchEmail.toLowerCase())
	);

	const handleEmailSearch = async () => {
		try {
			if (
				inviteEmail.match(`^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$`)
			) {
				const userResponse = await getUser({
					token,
					email: inviteEmail,
				}).unwrap();
				setSearchedUser(userResponse.data);
			} else {
				toast({ title: "Invalid email", variant: "destructive" });
			}
		} catch (error: any) {}
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold text-gray-100">
					Workspace Members
				</h2>
				<p className="text-sm text-gray-400 mt-1">
					Manage members and their access to the workspace
				</p>
			</div>

			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full sm:max-w-xs">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
					<Input
						placeholder="Search members..."
						value={searchEmail}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-8 bg-gray-800 border-gray-700 text-gray-200 w-full"
					/>
				</div>

				<div className="flex items-center gap-2">
					<Badge className="bg-blue-500/20 text-blue-400">
						{workspaceMembers.length}{" "}
						{workspaceMembers.length === 1 ? "Member" : "Members"}
					</Badge>
				</div>
			</div>

			<div className="space-y-4">
				<div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
					<h3 className="text-sm font-medium text-gray-300 mb-3">
						Invite New Members
					</h3>
					<div className="flex flex-col gap-3 sm:flex-row">
						<div className="relative flex-1">
							<Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
							<Input
								placeholder="Email address"
								type="email"
								value={inviteEmail}
								onChange={(e) => setInviteEmail(e.target.value)}
								className="pl-8 bg-graysearchEmail-700 border-gray-600 text-gray-200 w-full"
							/>
						</div>

						<Button onClick={() => handleEmailSearch()}>Search</Button>
					</div>
					{searchedUser && (
						<div
							key={searchedUser._id}
							className="flex items-start space-x-4 p-3 rounded-lg bg-gray-800/50 mt-4"
						>
							<Avatar>
								<AvatarImage src={searchedUser.avatar} />
								<AvatarFallback className="bg-gray-700 text-gray-200">
									{searchedUser.username
										? searchedUser.username.charAt(0)
										: searchedUser.email.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-1">
								<div className="flex justify-between">
									<p className="font-medium text-gray-200">
										{searchedUser.username || searchedUser.email.split("@")[0]}
									</p>
									<select
										value={selectedRole}
										onChange={(e) =>
											setSelectedRole(e.target.value as WorkspaceMember["role"])
										}
										className="px-3 py-2 rounded-md bg-gray-700 border-gray-600 text-gray-200 text-sm"
									>
										<option value="Editor">Editor</option>
										<option value="Viewer">Member</option>
									</select>{" "}
									<Button onClick={() => handleSendInvitation()}>
										<Plus /> Invite
									</Button>
								</div>
								<p className="text-sm text-gray-400">{searchedUser.email}</p>
							</div>
						</div>
					)}
				</div>

				<div className="rounded-md border border-gray-700 overflow-hidden">
					<div className="grid grid-cols-12 gap-2 p-3 bg-gray-800 text-xs font-medium text-gray-400 border-b border-gray-700">
						<div className="col-span-5">USER</div>
						<div className="col-span-4">EMAIL</div>
						<div className="col-span-2">ROLE</div>
						<div className="col-span-1"></div>
					</div>

					{filteredMembers.length > 0 ? (
						<div className="divide-y divide-gray-700">
							{filteredMembers.map((member) => (
								<div
									key={member._id}
									className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-gray-800/50"
								>
									<div className="col-span-5 flex items-center gap-2">
										<Avatar className="h-8 w-8 rounded-full">
											<AvatarImage
												src={member.user.avatar}
												alt={member.user.username}
												className="rounded-full"
											/>
											<AvatarFallback className="bg-gray-700 text-gray-300 rounded-full flex items-center justify-center text-sm">
												{member.user.username.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm text-gray-200">
											{member.user.username}
										</span>
									</div>
									<div className="col-span-4 text-sm text-gray-400 truncate">
										{member.user.email}
									</div>
									<div className="col-span-2">
										<span className="text-sm text-gray-400 truncate">{member.role}</span>
									</div>
									<div className="col-span-1 flex justify-end">
										<Button
											variant="ghost"
											size="icon"
											className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="p-6 text-center text-gray-500">
							No members found matching your search.
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MembersContent;
