import { Chat } from "./chat";
import { User } from "../../user";
import { workspaceChatEvent } from "../../../constant";

export class ChatManager {
  private static instance: ChatManager;
  chats: Chat[];
  constructor() {
    this.chats = [];
  }
  static getInstance() {
    if (ChatManager.instance) {
      return ChatManager.instance;
    }
    ChatManager.instance = new ChatManager();
    return ChatManager.instance;
  }
  handleEvents(message: any, user: User) {
    switch (message.type) {
      case workspaceChatEvent.JOIN_CHAT: {
        const chatId = message.data.chatId;
        const chat = this.getOrCreateChat(chatId);
        chat.addUser(user);
        break;
      }
      case workspaceChatEvent.LEAVE_CHAT: {
        const chatId = message.data.chatId;
        const chat = this.getOrCreateChat(chatId);
        chat.removeUser(user.userId);
        if (chat.getNumberOfCurrentUsers() < 1) {
          this.chats.filter(chat => chat.chatId !== chatId);
        }
        break;
      }
    }
  }
  getOrCreateChat(chatId: string) {
    let chat = this.chats.find((chat) => chat.chatId === chatId);
    if (!chat) {
      chat = new Chat(chatId);
      this.chats.push(chat);
    }
    return chat;
  }

  deleteChat(chatId: string) {
    this.chats.filter((chat) => chat.chatId !== chatId);
  }

  removeUserFromAllChats(userId: string) {
    this.chats.filter((chat) => {
      chat.removeUser(userId);
      if (chat.getNumberOfCurrentUsers() > 0) return chat;
    });
  }
}
export const chatManager = ChatManager.getInstance();
