import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Search,
	Phone,
	Video,
	MoreVertical,
	ArrowLeft,
	CirclePlus,
	SendHorizonal,
	Paperclip,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Form, useLoaderData } from "react-router";
import { ChatSchema, MessageSchema } from "@/types/chat";
import NewChatForm from "@/components/workspace/chats/NewChatForm";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";
import { WorkspaceMember } from "@/types/workspace";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField } from "@/components/ui/form";

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
			{chats.map((chat, index) => (
				<div
					key={chat._id}
					className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer"
					onClick={() => handelOnChatSelect(chat)}
				>
					<Avatar className="h-10 w-10">
						<AvatarFallback>DC</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between">
							<h3 className="font-medium truncate">{chat.name}</h3>
							<span className="text-xs text-muted-foreground">
								{chat.lastMessage.createdAt &&
									new Date(chat.lastMessage.createdAt).getUTCHours().toString()}
							</span>
						</div>
						<p className="text-sm text-muted-foreground truncate">
							{chat.lastMessage.content ||
							(chat.lastMessage.attachments &&
								chat.lastMessage.attachments.length > 0)
								? "Attachments"
								: "No messages yet."}
						</p>
					</div>
				</div>
			))}
		</ScrollArea>
	);
};

interface ChatHeaderProps {
	onBack?: () => void;
	currentChat: ChatSchema;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onBack, currentChat }) => {
	return (
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
					<AvatarFallback>DC</AvatarFallback>
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
				<Button
					variant="ghost"
					size="icon"
				>
					<MoreVertical className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
};

interface ChatMessagesProps {
	currentMember: WorkspaceMember;
	messages: MessageSchema[];
}
const ChatMessages: React.FC<ChatMessagesProps> = ({
	messages,
	currentMember,
}) => {
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
							className={`flex gap-2 max-w-[70%] ${
								message.sender === currentMember?._id ? "flex-row-reverse" : ""
							}`}
						>
							<Avatar className="h-8 w-8">
								<AvatarFallback>
									{message.sender
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div>
								<div className="flex items-center gap-2 mb-1">
									<span className="text-sm font-medium">{message.sender}</span>
									<span className="text-xs text-muted-foreground">
										{new Date(message.createdAt).toDateString()}
									</span>
								</div>
								<div
									className={`rounded-lg p-2 ${
										message.sender === currentMember?._id
											? "bg-primary text-primary-foreground"
											: "bg-muted"
									}`}
								>
									{message.content}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</ScrollArea>
	);
};
interface SelectedChatProps {
	selectedChat: ChatSchema;
	setShowMobileChatList: React.Dispatch<React.SetStateAction<boolean>>;
	currentMember: WorkspaceMember;
	messages: MessageSchema[];
	files: File[];
	setFiles: React.Dispatch<React.SetStateAction<File[]>>;
	messageInput: string;
	setMessageInput: React.Dispatch<React.SetStateAction<string>>;
}

const SelectedChat: React.FC<SelectedChatProps> = ({
	selectedChat,
	setShowMobileChatList,
	currentMember,
	messages,
	files,
	setFiles,
	messageInput,
	setMessageInput,
}) => {
	const form = useForm({
		defaultValues: {
			content: "",
			chatFiles: [] as File[],
		},
	});
	console.log(form);

	useEffect(() => {
		return () => {
			form.watch("chatFiles").forEach((file) => {
				URL.revokeObjectURL(String(file));
			});
		};
	}, [form.watch("chatFiles")]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			console.log(e.target.files);
			const selectedFiles = Array.from(e.target.files).slice(0, 5);
			const currentFiles = form.getValues("chatFiles");
			const updatedFiles = [...currentFiles, ...selectedFiles].slice(0, 5);
			form.setValue("chatFiles", updatedFiles);
		}
	};

	const handleFileRemove = (file: File) => {
		setFiles((prev) =>
			prev.filter((selectedFile) => selectedFile.name !== file.name)
		);
	};

	return (
		<div className="flex-1 flex flex-col max-h-screen">
			<ChatHeader
				currentChat={selectedChat!}
				onBack={() => setShowMobileChatList(true)}
			/>
			<ChatMessages
				currentMember={currentMember!}
				messages={messages}
			/>
			<div className="p-4 border-t border-border flex flex-col gap-4">
				{form.getValues("chatFiles").length > 0 && (
					<div className="flex items-center gap-4">
						{form.getValues("chatFiles").map((file) => (
							<div
								key={file.name}
								className="relative w-16 h-12"
							>
								<span
									onClick={() => handleFileRemove(file)}
									className="absolute right-0 -top-2 text-xs hover:cursor-pointer hover:scale-110"
								>
									x
								</span>
								<img
									src={URL.createObjectURL(file)}
									className="w-full h-full object-cover"
								/>
							</div>
						))}
					</div>
				)}

				<div className="flex gap-4 items-center">
					<Paperclip
						className="hover:cursor-pointer"
						onClick={() => document.getElementById("chatFiles")?.click()}
						size={20}
					/>
					<FormProvider {...form}>
						<Form
							{...form}
							className="flex-1"
						>
							<form>
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormControl>
											<Input
												placeholder="Type a message..."
												className="bg-muted"
												{...field}
											/>
										</FormControl>
									)}
								/>
								<FormField
									control={form.control}
									name="chatFiles"
									render={() => (
										<FormControl>
											<Input
												id="chatFiles"
												type="file"
												multiple
												className="hidden"
												max={5}
												onChange={handleFileChange}
											/>
										</FormControl>
									)}
								/>
							</form>
						</Form>
					</FormProvider>

					{(form.getValues("content").length > 0 ||
						form.getValues("chatFiles").length > 0) && (
						<SendHorizonal
							className={cn("hover:cursor-pointer")}
							size={20}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default function WorkspaceChat() {
	const chatsFromLoader = useLoaderData();
	const currentUserId = useSelector((state: RootState) => state.Users.user._id);
	const currentMember = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	).find((member) => member.user._id === currentUserId);

	const [isNewChat, setIsNewChat] = useState<boolean>(false);
	const [chats, setChats] = useState<ChatSchema[]>(chatsFromLoader || []);
	const [showMobileChatList, setShowMobileChatList] = useState(true);

	const [selectedChat, setSelectedChat] = useState<ChatSchema | null>(null);
	const [messages, setMessages] = useState<MessageSchema[]>([]);
	const [files, setFiles] = useState<File[]>([]);

	const [messageInput, setMessageInput] = useState<string>("");

	useEffect(() => {
		const localCurrentChat = localStorage.getItem("currentChat");
		if (localCurrentChat) {
		}
	}, []);

	return (
		<>
			{isNewChat && <NewChatForm onClose={() => setIsNewChat(false)} />}
			<div className="w-full flex bg-background">
				{/* Mobile view */}
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

				{/* Desktop view */}
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
}
