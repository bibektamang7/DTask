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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAddChatMember } from "@/hooks/customs/chats/useAddChatMember";
import { useDeleteChat } from "@/hooks/customs/chats/useDeleteChat";
import { ChatSchema } from "@/types/chat";
import { Workspace, WorkspaceMember } from "@/types/workspace";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Call from "./Call";
import { useSocket } from "@/context/SocketContex";
import IncomingCall from "./IncomingCall";
import React from "react";

interface ChatHeaderProps {
	onBack?: () => void;
	currentChat: ChatSchema;
	onDeleteChat: (chatId: string) => void;
}
interface IncomingCallProps {
	callType: string;
	callFrom: string;
	chatId: string;
}

type CallOpen = "Video" | "Audio" | "None";

const ChatHeader: React.FC<ChatHeaderProps> = React.memo(
	({ onBack, currentChat, onDeleteChat }) => {
		const currentUser = localStorage.getItem("currentUser");
		const [callOpen, setCallOpen] = useState<CallOpen>("None");

		const [incomingCall, setIncomingCall] = useState<IncomingCallProps | null>(
			null
		);
		const socket = useSocket();

		const [isAddChatMember, setIsAddChatMember] = useState<boolean>(false);
		const [addingMember, setAddingMember] = useState<string>("");
		const { handleDeleteChat } = useDeleteChat();
		const { handleAddChatMember, addChatMemberLoading } = useAddChatMember();
		const workspaceMembers = JSON.parse(
			localStorage.getItem("workspaceMembers")!
		);

		const chatUsers = workspaceMembers
			.filter((member: WorkspaceMember) =>
				currentChat.members.find((chatMember) => chatMember === member._id)
			)
			.map((chatUser: WorkspaceMember) => chatUser.user._id);

		const handleAddMemberInChat = useCallback(() => {
			handleAddChatMember(currentChat._id, addingMember);
			setAddingMember("");
			setIsAddChatMember(false);
		}, []);
		const handleChatDelete = useCallback(async () => {
			const result = await handleDeleteChat(currentChat._id);
			if (result) {
				onDeleteChat(currentChat._id);
			}
		}, [currentChat]);

		const handleCallRejected = useCallback(() => {
			socket?.send(
				JSON.stringify({
					type: "call-rejected",
					data: {
						by: currentUser,
						chatId: incomingCall?.chatId,
					},
				})
			);
			setCallOpen("None");
			setIncomingCall(null);
		}, [currentUser, incomingCall, socket]);

		const handleIncomingCallAccepted = useCallback(async () => {
			if (incomingCall) {
				socket?.send(
					JSON.stringify({
						type: "call-accepted",
						data: {
							chatId: incomingCall.chatId,
							by: currentUser,
							callFrom: incomingCall.callFrom,
						},
					})
				);
				setCallOpen(incomingCall.callType as CallOpen);
				setIncomingCall(null);
			}
		}, [socket, incomingCall, currentUser]);

		const handleCall = useCallback(
			(callType: CallOpen) => {
				socket?.send(
					JSON.stringify({
						type: "call-members",
						data: {
							callType,
							from: currentUser,
							chatMembers: chatUsers,
							chatId: currentChat._id,
						},
					})
				);
				setCallOpen(callType);
			},
			[socket]
		);

		useEffect(() => {
			if (!socket) return;
			socket.onmessage = (event) => {
				const message = JSON.parse(event.data);

				if (message.type === "incoming-call") {
					setIncomingCall({
						callFrom: message.data.callFrom,
						callType: message.data.callType,
						chatId: message.data.chatId,
					});
				} else if (message.type === "call-accepted") {
				}
			};
			return () => {
				socket.onmessage = null;
			};
		}, [socket]);

		return (
			<>
				{incomingCall && (
					<IncomingCall
						callDetails={incomingCall}
						onDecline={() => handleCallRejected()}
						onAccept={() => handleIncomingCallAccepted()}
					/>
				)}

				{callOpen && callOpen !== "None" && (
					<Call
						callFrom={currentUser!}
						callType={callOpen}
						chatId={currentChat._id}
						chatMembers={chatUsers}
						onHangUp={() => {
							setCallOpen("None");
						}}
					/>
				)}
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
														(member: Workspace) =>
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
								{currentChat.name
									.split(" ")
									.map((a) => a.charAt(0).slice(0, 2))}
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
							onClick={() => handleCall("Audio")}
							variant="ghost"
							size="icon"
							className="hidden md:inline-flex"
						>
							<Phone className="h-5 w-5" />
						</Button>
						<Button
							onClick={() => handleCall("Video")}
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
									onClick={() => handleChatDelete()}
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
	}
);
export default ChatHeader;
