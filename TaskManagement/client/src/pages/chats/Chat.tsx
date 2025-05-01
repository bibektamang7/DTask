import { Input } from "@/components/ui/input";
import { Search, CirclePlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { ChatSchema, MessageSchema } from "@/types/chat";
import NewChatForm from "@/components/workspace/chats/NewChatForm";
import { useDispatch } from "react-redux";
import { useGetChatMessageQuery } from "@/redux/services/chatApi";
import { ChatEvent } from "@/constants";
import ChatRoomList from "@/components/workspace/chats/ChatRoomList";
import { AppDispatch } from "@/redux/store";
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

	const [selectedChat, setSelectedChat] = useState<ChatSchema | null>(null);
	const [messages, setMessages] = useState<MessageSchema[]>([]);

	// This is to store files from chat message input
	const [files, setFiles] = useState<File[]>([]);
	const { data: fetchedMessage } = useGetChatMessageQuery(
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

	const onMessageReceived = useCallback(
		(event: CustomEvent<{ message: MessageSchema }>) => {
			if (event.detail.message.chat === selectedChat?._id) {
				alert(selectedChat);
				setMessages((prev) => [...prev, event.detail.message]);
			}

			setChats((prev) =>
				prev
					.map((chat) =>
						chat._id === event.detail.message.chat
							? { ...chat, lastMessage: event.detail.message }
							: chat
					)
					.sort((a) => (a._id === event.detail.message.chat ? -1 : 1))
			);
		},
		[selectedChat, chats]
	);

	const onNewChat = useCallback((event: CustomEvent<{ chat: ChatSchema }>) => {
		setChats((prev) => [event.detail.chat, ...prev]);
	}, []);

	const onMessageDelete = useCallback(
		(event: CustomEvent<{ chatId: string; messageId: string }>) => {
			if (event.detail.chatId === selectedChat?._id) {
				selectedChat.messages.filter(
					(message) => message._id !== event.detail.messageId
				);
				if (selectedChat.lastMessage._id === event.detail.messageId) {
					selectedChat.lastMessage.content = "Messsage Deleted";
				}
			}
		},
		[selectedChat, chats, messages]
	);
	const onChatMemberAdded = useCallback(
		(event: CustomEvent<{ chatId: string; member: WorkspaceMember }>) => {
			dispatch(
				workspaceApi.util.updateQueryData(
					"getWorkspace",
					undefined,
					(draft: Workspace) => {
						draft.members.push(event.detail.member);
					}
				)
			);
			if (selectedChat?._id === event.detail.chatId) {
				selectedChat.members.push(event.detail.member._id);
			}
			setChats((prev) => {
				const index = prev.findIndex(
					(chat) => chat._id === event.detail.chatId
				);
				if (index !== -1) {
					const updatedChats = [...prev];
					updatedChats[index] = {
						...prev[index],
						members: [...prev[index].members, event.detail.member._id],
					};
					return updatedChats;
				}
				return prev;
			});
		},
		[selectedChat, chats]
	);
	const onChatMemberRemoved = useCallback(
		(event: CustomEvent<{ chatId: string; memberId: string }>) => {
			dispatch(
				workspaceApi.util.updateQueryData(
					"getWorkspace",
					undefined,
					(draft: Workspace) => {
						draft.members = draft.members.filter(
							(member) => member._id === event.detail.memberId
						);
					}
				)
			);
			setChats((prev) => {
				const index = prev.findIndex(
					(chat) => chat._id === event.detail.chatId
				);
				if (index !== -1) {
					const updatedChats = [...prev];
					updatedChats[index] = {
						...prev[index],
						members: [
							...prev[index].members.filter(
								(member) => member === event.detail.memberId
							),
						],
					};
					return updatedChats;
				}
				return prev;
			});
		},
		[chats, selectedChat]
	);

	const deleteChat = useCallback(
		(event: CustomEvent<{ chatId: string }>) => {
			if (event.detail.chatId === selectedChat?._id) {
				setSelectedChat(null);
			}
			setChats((prev) =>
				prev.filter((chat) => chat._id !== event.detail.chatId)
			);
		},
		[chats]
	);

	useEffect(() => {
		if (fetchedMessage) setMessages(fetchedMessage.data);
	}, [fetchedMessage]);

	useEffect(() => {
		const localCurrentChat = JSON.parse(localStorage.getItem("currentChat")!);
		if (localCurrentChat) {
			setSelectedChat(localCurrentChat);
		}
	}, []);

	useEffect(() => {
		window.addEventListener(
			ChatEvent.ADD_MEMBER,
			onChatMemberAdded as EventListener
		);
		window.addEventListener(ChatEvent.NEW_CHAT, onNewChat as EventListener);
		window.addEventListener(ChatEvent.DELETE_CHAT, deleteChat as EventListener);
		window.addEventListener(
			ChatEvent.ADD_MESSAGE,
			onMessageReceived as EventListener
		);
		window.addEventListener(
			ChatEvent.DELETE_MESSAGE,
			onMessageDelete as EventListener
		);
		window.addEventListener(
			ChatEvent.REMOVE_MEMBER,
			onChatMemberRemoved as EventListener
		);

		return () => {
			window.removeEventListener(
				ChatEvent.ADD_MEMBER,
				onChatMemberAdded as EventListener
			);
			window.removeEventListener(
				ChatEvent.NEW_CHAT,
				onNewChat as EventListener
			);
			window.removeEventListener(
				ChatEvent.DELETE_CHAT,
				deleteChat as EventListener
			);
			window.removeEventListener(
				ChatEvent.ADD_MESSAGE,
				onMessageReceived as EventListener
			);
			window.removeEventListener(
				ChatEvent.DELETE_MESSAGE,
				onMessageDelete as EventListener
			);
			window.removeEventListener(
				ChatEvent.REMOVE_MEMBER,
				onChatMemberRemoved as EventListener
			);
		};
	}, []);

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
