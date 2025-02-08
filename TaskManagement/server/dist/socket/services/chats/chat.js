"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const user_1 = require("../../user");
class Chat {
    constructor(chatId) {
        this.chatId = chatId;
        this.currentUsers = new Map();
    }
    getNumberOfCurrentUsers() {
        return this.currentUsers.size;
    }
    addUser(user) {
        this.currentUsers.set(user.userId, user);
    }
    getUsers() {
        return Array.from(this.currentUsers.values());
    }
    removeUser(userId) {
        this.currentUsers.delete(userId);
    }
    sendMessage(participants, message, userId) {
        const users = participants.reduce((acc, str) => {
            const user = user_1.userManager.getOnlineUser(str);
            if (user) {
                acc.push(user);
            }
            return acc;
        }, []);
        this.broadcast(users, userId, JSON.stringify({
            type: "received-message", //TODO:make it enumerate
            data: {
                chatId: this.chatId,
                message
            }
        }));
    }
    deleteMessage(deletedMessageId, userId) {
        this.broadcast(Array.from(this.currentUsers.values()), userId, JSON.stringify({
            type: "delete-message",
            data: {
                chatId: this.chatId,
                deletedMessageId,
            }
        }));
    }
    broadcast(users, userId, message) {
        users.forEach(user => {
            if (user.userId !== userId) {
                user.socket.send(message);
            }
        });
    }
}
exports.Chat = Chat;
