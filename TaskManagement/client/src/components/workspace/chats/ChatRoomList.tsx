import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSchema } from "@/types/chat";
import React from "react";

interface ChatRoomListProps {
	chats: ChatSchema[];
	setSelectedChat: React.Dispatch<React.SetStateAction<ChatSchema | null>>;
	setShowMobileChatList: React.Dispatch<React.SetStateAction<boolean>>;
}
const ChatRoomList: React.FC<ChatRoomListProps> = ({
	chats,
	setSelectedChat,
	setShowMobileChatList,
}) => {
	const handelOnChatSelect = (chat: ChatSchema) => {
		localStorage.setItem("currentChat", JSON.stringify(chat));
		setSelectedChat(chat);
		setShowMobileChatList(false);
	};
	return (
		<ScrollArea className="h-[calc(100vh-5rem)]">
			{chats.length > 0 ? (
				chats.map((chat) => (
					<div
						key={chat._id}
						className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer"
						onClick={() => handelOnChatSelect(chat)}
					>
						<Avatar className="h-10 w-10">
							<AvatarFallback>
								{chat.name
									.split(" ")
									.map((a) => a.charAt(0))
									.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between">
								<h3 className="font-medium truncate">{chat.name}</h3>
								<span className="text-xs text-muted-foreground">
									{chat.lastMessage &&
										chat.lastMessage.createdAt &&
										new Date(chat.lastMessage.createdAt).toDateString()}
								</span>
							</div>
							<p className="text-sm text-muted-foreground truncate line-clamp-1">
								{chat.lastMessage &&
								chat.lastMessage.attachments &&
								chat.lastMessage.attachments.length > 0
									? "Attachments"
									: chat.lastMessage && chat.lastMessage.content.length > 0
									? `${chat.lastMessage.content}`
									: "No messages yet."}
							</p>
						</div>
					</div>
				))
			) : (
				<div className="text-sm text-center mt-[100%]">No chats yet.</div>
			)}
		</ScrollArea>
	);
};

export default ChatRoomList;
