import Loader from "@/components/Loader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAddChatMember } from "@/hooks/customs/chats/useAddChatMember";
import { useDeleteChat } from "@/hooks/customs/chats/useDeleteChat";
import { RootState } from "@/redux/store";
import { ChatSchema } from "@/types/chat";
import { WorkspaceMember } from "@/types/workspace";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

interface ChatHeaderProps {
	onBack?: () => void;
	currentChat: ChatSchema;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onBack, currentChat }) => {
	const [isAddChatMember, setIsAddChatMember] = useState<boolean>(false);
	const [addingMember, setAddingMember] = useState<string>("");
	const { handleDeleteChat } = useDeleteChat();
	const { handleAddChatMember, addChatMemberLoading } = useAddChatMember();
	const workspaceMembers = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);
	console.log(addingMember);
	const handleAddMemberInChat = () => {
		handleAddChatMember(currentChat._id, addingMember);
		setAddingMember("");
		setIsAddChatMember(false);
	};
	return (
		<>
			{isAddChatMember && (
				<div className="fixed top-0 left-0 backdrop-blur-md  w-full h-full z-20">
					<div className="flex items-center justify-center h-full">
						<Card className="w-1/2">
							<CardHeader>Add Member</CardHeader>
							<CardContent>
								<div className="flex flex-col space-y-1.5">
									<CardTitle className="text-xs text-gray-400 mb-2">
										members
									</CardTitle>
									<Select onValueChange={(value) => setAddingMember(value)}>
										<SelectTrigger id="chatMembers">
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent
											position="popper"
											className="z-30"
										>
											{workspaceMembers
												.filter(
													(member) =>
														!currentChat.members.find(
															(chatMember) => chatMember === member._id
														)
												)
												.map((workspaceMember: WorkspaceMember) => (
													<SelectItem
														value={workspaceMember._id}
														key={workspaceMember._id}
													>
														<div className="flex items-center gap-2">
															<Avatar className="h-8 w-8">
																<AvatarFallback>
																	{workspaceMember.user.username.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<p className="text-xs">
																{workspaceMember.user.username}
															</p>
														</div>
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</div>
							</CardContent>
							<CardFooter className="flex items-center justify-end gap-4">
								<Button
									onClick={() => setIsAddChatMember(false)}
									className="bg-red-500/85 hover:bg-red-500 text-white/70"
								>
									Cancel
								</Button>
								<Button
									disabled={addChatMemberLoading}
									onClick={handleAddMemberInChat}
								>
									{addChatMemberLoading ? <Loader /> : "Add"}
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			)}
			<div className="flex items-center justify-between p-4 border-b border-border">
				<div className="flex items-center gap-3">
					{onBack && (
						<Button
							variant="ghost"
							size="icon"
							onClick={onBack}
							className="md:hidden"
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>
					)}
					<Avatar className="h-10 w-10">
						<AvatarFallback>
							{currentChat.name.split(" ").map((a) => a.charAt(0).slice(0, 2))}
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="font-semibold">{currentChat.name}</h2>
						<p className="text-sm text-muted-foreground">
							{currentChat.members.length} members
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="hidden md:inline-flex"
					>
						<Phone className="h-5 w-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="hidden md:inline-flex"
					>
						<Video className="h-5 w-5" />
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger className="px-2">
							<MoreVertical
								size={16}
								type="icon"
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="px-4 mr-2 mt-2">
							<DropdownMenuLabel>{currentChat.name}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => setIsAddChatMember(true)}
								className="text-xs text-gray-400 hover:text-inherit hover:cursor-pointer"
							>
								Add Member
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									handleDeleteChat(currentChat._id);
								}}
								className="text-xs text-gray-400 hover:text-inherit hover:cursor-pointer"
							>
								Delete Chat
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</>
	);
};
export default ChatHeader;
