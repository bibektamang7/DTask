import { Input } from "@/components/ui/input";
import { Search, CirclePlus } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { ChatSchema, MessageSchema } from "@/types/chat";
import NewChatForm from "@/components/workspace/chats/NewChatForm";
import { useDispatch, useSelector } from "react-redux";
import { useGetChatMessageQuery } from "@/redux/services/chatApi";
import { useSocket } from "@/context/SocketContex";
import { ChatEvent } from "@/constants";
import ChatRoomList from "@/components/workspace/chats/ChatRoomList";
import { AppDispatch, RootState } from "@/redux/store";
import { Workspace, WorkspaceMember } from "@/types/workspace";
import SelectedChat from "@/components/workspace/chats/SelectedChat";
import { workspaceApi } from "@/redux/services/workspaceApi";

const WorkspaceChat = () => {
	const dispatch = useDispatch<AppDispatch>();

	const workspaceId = localStorage.getItem("workspace");
	const chatsFromLoader = useLoaderData();
	const currentUserId = localStorage.getItem("currentUser");
	const storedCurrentWorkspaceMembers = JSON.parse(
		localStorage.getItem("workspaceMembers")!
	);
	const currentMember = storedCurrentWorkspaceMembers.find(
		(member: WorkspaceMember) => member.user._id === currentUserId
	);

	const [isNewChat, setIsNewChat] = useState<boolean>(false);
	const [chats, setChats] = useState<ChatSchema[]>(chatsFromLoader || []);
	const [showMobileChatList, setShowMobileChatList] = useState(true);

	const [messageInput, setMessageInput] = useState<string>("");
	const socket = useSocket();

	const [selectedChat, setSelectedChat] = useState<ChatSchema | null>(null);
	const [messages, setMessages] = useState<MessageSchema[]>([]);

	// This is to store files from chat message input
	const [files, setFiles] = useState<File[]>([]);
	const { data: fetchedMessage, isLoading } = useGetChatMessageQuery(
		{
			workspaceId,
			chatId: selectedChat?._id,
		},
		{
			skip: !Boolean(selectedChat),
		}
	);

	const onChatDelete = useCallback((chatId: string) => {
		if (chatId === selectedChat?._id) {
			setSelectedChat(null);
		}
		setChats((prev) => prev.filter((chat) => chat._id !== chatId));
	}, []);

	const onMessageReceived = useCallback((message: MessageSchema) => {
		if (message.chat === selectedChat?._id) {
			setMessages((prev) => [...prev, message]);
		}

		setChats((prev) =>
			prev
				.map((chat) =>
					chat._id === message.chat ? { ...chat, lastMessage: message } : chat
				)
				.sort((a, b) => (a._id === message.chat ? -1 : 1))
		);
	}, []);

	const onNewChat = useCallback((chat: ChatSchema) => {
		setChats((prev) => [chat, ...prev]);
	}, []);

	const onMessageDelete = useCallback((chatId: string, messageId: string) => {
		if (chatId === selectedChat?._id) {
			selectedChat.messages.filter((message) => message._id !== messageId);
			if (selectedChat.lastMessage._id === messageId) {
				selectedChat.lastMessage.content = "Messsage Deleted";
			}
		}
	}, []);
	const onChatMemberAdded = useCallback(
		(chatId: string, member: WorkspaceMember) => {
			dispatch(
				workspaceApi.util.updateQueryData(
					"getWorkspace",
					undefined,
					(draft: Workspace) => {
						draft.members.push(member);
					}
				)
			);
			if (selectedChat?._id === chatId) {
				selectedChat.members.push(member._id);
			}
			setChats((prev) => {
				const index = prev.findIndex((chat) => chat._id === chatId);
				if (index !== -1) {
					const updatedChats = [...prev];
					updatedChats[index] = {
						...prev[index],
						members: [...prev[index].members, member._id],
					};
					return updatedChats;
				}
				return prev;
			});
		},
		[]
	);
	const onChatMemberRemoved = useCallback(
		(chatId: string, memberId: string) => {
			dispatch(
				workspaceApi.util.updateQueryData(
					"getWorkspace",
					undefined,
					(draft: Workspace) => {
						draft.members = draft.members.filter(
							(member) => member._id === memberId
						);
					}
				)
			);
			setChats((prev) => {
				const index = prev.findIndex((chat) => chat._id === chatId);
				if (index !== -1) {
					const updatedChats = [...prev];
					updatedChats[index] = {
						...prev[index],
						members: [
							...prev[index].members.filter((member) => member === memberId),
						],
					};
					return updatedChats;
				}
				return prev;
			});
		},
		[]
	);

	useEffect(() => {
		const localCurrentChat = JSON.parse(localStorage.getItem("currentChat")!);
		if (localCurrentChat) {
			setSelectedChat(localCurrentChat);
		}
	}, []);
	useEffect(() => {
		if (fetchedMessage) setMessages(fetchedMessage.data);
	}, [fetchedMessage]);

	useEffect(() => {
		if (!socket) return;

		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			switch (message.type) {
				case ChatEvent.NEW_CHAT:
					onNewChat(message.data.chat);
					break;
				case ChatEvent.DELETE_CHAT:
					onChatDelete(message.data.chatId);
					break;
				case ChatEvent.ADD_MESSAGE:
					onMessageReceived(message.data.message);
					break;
				case ChatEvent.DELETE_MESSAGE:
					onMessageDelete(message.data.chatId, message.data.messageId);
					break;
				case ChatEvent.ADD_MEMBER:
					onChatMemberAdded(message.data.chatId, message.data.member);
					break;
				case ChatEvent.REMOVE_MEMBER:
					onChatMemberRemoved(message.data.chatId, message.data.memberId);
					break;
			}
		};
		return () => {
			if (socket) {
				socket.onmessage = null;
			}
		};
	}, [socket]);

	return (
		<>
			{isNewChat && <NewChatForm onClose={() => setIsNewChat(false)} />}
			<div className="w-full flex bg-background">
				<div className="md:hidden flex flex-col w-full">
					{showMobileChatList ? (
						<>
							<div className="p-4 border-b border-border flex items-center justify-between">
								<h1 className="text-xl font-semibold">Workspaces</h1>
							</div>
							<div className="p-4">
								<div className="relative">
									<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search"
										className="pl-9 bg-muted"
									/>
								</div>
							</div>
							<ChatRoomList
								chats={chats}
								setSelectedChat={setSelectedChat}
								setShowMobileChatList={setShowMobileChatList}
							/>
						</>
					) : selectedChat ? (
						<SelectedChat
							onDeleteChat={onChatDelete}
							currentMember={currentMember!}
							messages={messages}
							selectedChat={selectedChat}
							setShowMobileChatList={setShowMobileChatList}
							files={files}
							setFiles={setFiles}
							messageInput={messageInput}
							setMessageInput={setMessageInput}
						/>
					) : (
						<div className="flex items-center justify-center w-full h-full">
							No chat is selected
						</div>
					)}
				</div>

				<div className="hidden md:flex w-full">
					<div className="w-80 max-h-screen scrollbar-hidden overflow-scroll border-r border-border">
						<div className="p-4 border-b border-borderi flex items-center justify-between">
							<h1 className="text-xl font-semibold">Workspaces</h1>
							<CirclePlus
								type="icon"
								onClick={() => setIsNewChat(true)}
							/>
						</div>
						<div className="p-4">
							<div className="relative">
								<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search"
									className="pl-9 bg-muted"
								/>
							</div>
						</div>
						<ChatRoomList
							setSelectedChat={setSelectedChat}
							chats={chats}
							setShowMobileChatList={setShowMobileChatList}
						/>
					</div>

					{selectedChat ? (
						<SelectedChat
							onDeleteChat={onChatDelete}
							currentMember={currentMember!}
							messages={messages}
							selectedChat={selectedChat}
							setShowMobileChatList={setShowMobileChatList}
							files={files}
							setFiles={setFiles}
							messageInput={messageInput}
							setMessageInput={setMessageInput}
						/>
					) : (
						<div className="flex items-center justify-center w-full h-full">
							No chat is selected
						</div>
					)}
				</div>
			</div>
		</>
	);
};
export default WorkspaceChat;
