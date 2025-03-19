import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeleteChatMessage } from "@/hooks/customs/chats/useDeleteChatMessage";
import { RootState } from "@/redux/store";
import { MessageSchema } from "@/types/chat";
import { WorkspaceMember } from "@/types/workspace";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface ChatMessagesProps {
	currentMember: WorkspaceMember;
	messages: MessageSchema[];
}
const ChatMessages: React.FC<ChatMessagesProps> = ({
	messages,
	currentMember,
}) => {
	console.log(messages, currentMember, "hsdghdsjkgds");
	const workspaceMembers = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);
	const messageEndRef = useRef<HTMLDivElement | null>(null);

	const { handleDeleteChatMessage } = useDeleteChatMessage();
	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "instant" });
	}, [messages]);
	return (
		<ScrollArea className="flex-1 p-4">
			<div className="space-y-4">
				{messages.map((message) => (
					<div
						key={message._id}
						className={`flex ${
							message.sender === currentMember?._id
								? "justify-end"
								: "justify-start"
						}`}
					>
						<div
							className={`flex mt-2 gap-2 max-w-[60%] ${
								message.sender === currentMember?._id ? "flex-row-reverse" : ""
							}`}
						>
							<Avatar className="h-8 w-8">
								<AvatarFallback>
									{workspaceMembers
										.find((member) => member._id === message.sender)
										?.user.username.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<span className="text-sm font-medium">
										{
											workspaceMembers.find(
												(member) => member._id === message.sender
											)?.user.username
										}
									</span>
									<span className="text-xs text-muted-foreground">
										{new Date(message.createdAt).toDateString()}
									</span>
								</div>
								<div className="flex gap-2 w-full relative">
									{currentMember._id === message.sender && (
										<DropdownMenu>
											<DropdownMenuTrigger className="p-0 bg-inherit h-fit border-none outline-none focus:outline-none">
												<MoreVertical size={16} />
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem
													onClick={() =>
														handleDeleteChatMessage(message.chat, message._id)
													}
												>
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									)}
									{message.content.length > 0 ? (
										<div
											className={`rounded-lg p-2 w-full  ${
												message.sender === currentMember?._id
													? "bg-primary text-primary-foreground"
													: "bg-muted"
											}`}
										>
											{message.content}
										</div>
									) : (
										<div>
											{message.attachments.length > 0 &&
												message.attachments.map((attachment) => (
													<div key={attachment._id}>
														<img
															src={attachment.fileUrl}
															alt={attachment.fileName}
														/>
													</div>
												))}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
				<div ref={messageEndRef}></div>
			</div>
		</ScrollArea>
	);
};

export default ChatMessages;
