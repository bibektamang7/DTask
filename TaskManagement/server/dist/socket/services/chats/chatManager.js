"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatManager = exports.ChatManager = void 0;
const chat_1 = require("./chat");
const constant_1 = require("../../../constant");
class ChatManager {
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
    handleEvents(message, user) {
        switch (message.type) {
            case constant_1.workspaceChatEvent.JOIN_CHAT: {
                const chatId = message.data.chatId;
                const chat = this.getOrCreateChat(chatId);
                chat.addUser(user);
                break;
            }
            case constant_1.workspaceChatEvent.LEAVE_CHAT: {
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
    getOrCreateChat(chatId) {
        let chat = this.chats.find((chat) => chat.chatId === chatId);
        if (!chat) {
            chat = new chat_1.Chat(chatId);
            this.chats.push(chat);
        }
        return chat;
    }
    deleteChat(chatId) {
        this.chats.filter((chat) => chat.chatId !== chatId);
    }
    removeUserFromAllChats(userId) {
        this.chats.filter((chat) => {
            chat.removeUser(userId);
            if (chat.getNumberOfCurrentUsers() > 0)
                return chat;
        });
    }
}
exports.ChatManager = ChatManager;
exports.chatManager = ChatManager.getInstance();
