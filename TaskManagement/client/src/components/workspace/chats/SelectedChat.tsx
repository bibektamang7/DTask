import { useSendMessage } from "@/hooks/customs/useSendMessage";
import { ChatSchema, MessageSchema } from "@/types/chat";
import { WorkspaceMember } from "@/types/workspace";
import { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import { Paperclip, SendHorizonal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SelectedChatProps {
	selectedChat: ChatSchema;
	onDeleteChat: (chatId: string) => void;
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
	onDeleteChat,
}) => {
	const { handleSendMessage } = useSendMessage(selectedChat._id);
	const handleMessageSend = async () => {
		const formData = new FormData();
		formData.append("content", messageInput);
		if (files.length > 0) {
			files.forEach((file) => formData.append("chatFiles", file));
		}
		const response = await handleSendMessage(formData);
	};
	useEffect(() => {
		return () => {
			files.forEach((file) => URL.revokeObjectURL(String(file)));
		};
	}, [files]);

	return (
		<div className="flex-1 flex flex-col max-h-screen">
			<ChatHeader
				currentChat={selectedChat!}
				onBack={() => setShowMobileChatList(true)}
				onDeleteChat={onDeleteChat}
			/>
			<ChatMessages
				currentMember={currentMember!}
				messages={messages}
			/>
			<div className="p-4 border-t border-border flex flex-col gap-4">
				{files.length > 0 && (
					<div className="flex items-center gap-4">
						{files.length > 0 &&
							files.map((file) => (
								<div
									key={file.name}
									className="relative w-16 h-12">
									<span
										onClick={() =>
											setFiles((prev) =>
												prev.filter(
													(selectedFile) => selectedFile.name !== file.name
												)
											)
										}
										className="absolute right-0 -top-2 text-xs hover:cursor-pointer hover:scale-110">
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
				<div className="flex gap-4  items-center ">
					<Paperclip
						className="hover:cursor-pointer"
						onClick={() => document.getElementById("chatFiles")?.click()}
						size={20}
					/>
					<div className="flex-1">
						<Input
							placeholder="Type a message..."
							className="bg-muted"
							value={messageInput}
							onChange={(e) => setMessageInput(e.target.value)}
							accept=".jpg, .jpeg, .pdf, .doc, .docx"
						/>
						<Input
							id="chatFiles"
							type="file"
							multiple
							className="hidden"
							max={5}
							onChange={(e) =>
								setFiles((prev) => [
									...prev,
									...Array.from(e.target.files || []),
								])
							}
						/>
					</div>
					{(messageInput.length > 0 || files.length > 0) && (
						<SendHorizonal
							onClick={handleMessageSend}
							className={cn("hover:cursor-pointer")}
							size={20}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default SelectedChat;
