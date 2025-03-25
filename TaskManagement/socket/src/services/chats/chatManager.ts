import { User, userManager } from "../../user";
import { workspaceChatEvent } from "../../constants";
import { socketBroadcast } from "../../helpers";

import { socketClient } from "../../helpers/redisConnection";
import { Chat } from "./chat";

function chatSocketBroadcaster(type: string, data: any) {
	const message = JSON.parse(data.toString());
	const members = message.members;
	const workspaceMembers = members
		.map((member: { _id: string }) => userManager.getOnlineUser(member._id))
		.filter(Boolean); // Removes undefined/null values

	socketBroadcast(
		workspaceMembers,
		JSON.stringify({
			type,
			data: {
				...message,
			},
		}),
		message.userId
	);
}

socketClient.subscribe("chatCreated", (data) => {
	chatSocketBroadcaster(workspaceChatEvent.NEW_CHAT, data);
});

socketClient.subscribe("deletedChat", (data) => {
	chatSocketBroadcaster(workspaceChatEvent.DELETE_CHAT, data);
});

socketClient.subscribe("sendMessage", (data) => {
	chatSocketBroadcaster(workspaceChatEvent.ADD_MESSAGE, data);
});

socketClient.subscribe("deleteMessage", (data) => {
	chatSocketBroadcaster(workspaceChatEvent.DELETE_MESSAGE, data);
});
socketClient.subscribe("addMember", (data) => {
	chatSocketBroadcaster(workspaceChatEvent.ADD_MEMBER, data);
});
socketClient.subscribe("removeMember", (data) => {
	chatSocketBroadcaster(workspaceChatEvent.REMOVE_MEMBER, data);
});

// export class ChatManager {
// 	private static instance: ChatManager;
// 	chats: Chat[];
// 	userChatMapping: Map<string, string>;
// 	constructor() {
// 		this.chats = [];
// 		this.userChatMapping = new Map();
// 	}
// 	static getInstance() {
// 		if (ChatManager.instance) {
// 			return ChatManager.instance;
// 		}
// 		ChatManager.instance = new ChatManager();
// 		return ChatManager.instance;
// 	}

// 	getOrCreateChat(chatId: string) {
// 		let chat = this.chats.find((chat) => chat.chatId === chatId);
// 		if (!chat) {
// 			chat = new Chat(chatId);
// 			this.chats.push(chat);
// 		}
// 		return chat;
// 	}

// 	deleteChat(chatId: string) {
// 		this.chats.filter((chat) => chat.chatId !== chatId);
// 	}
// 	addUserInChat(chatId: string, user: User[]) {
// 		const chat = this.getOrCreateChat(chatId);
// 		if (chat) {
// 			user.forEach((chatUser) => {
// 				this.userChatMapping.set(chatUser.userId, chatId);
// 				chat.addUser(chatUser);
// 			});
// 		}
// 	}
// 	removeUserFromChat(chatId: string, user: User) {
// 		const chat = this.chats.find((chat) => chat.chatId === chatId);
// 		if (chat) {
// 			chat.removeUser(user);
// 		}
// 	}
// 	removeUserFromAllChats(user: User) {
// 		const chats = this.userChatMapping.get(user.userId);
		
// 	}
// }
// export const chatManager = ChatManager.getInstance();
