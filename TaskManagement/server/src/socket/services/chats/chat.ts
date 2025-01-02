import { User } from "../../user";
import { userManager } from "../../user";

class Chat {
  chatId: string;
  private currentUsers: Map<string, User>;
  constructor(chatId: string) {
    this.chatId = chatId;
    this.currentUsers = new Map();
  }
  getNumberOfCurrentUsers() {
    return this.currentUsers.size
  }
  addUser(user: User) {
    this.currentUsers.set(user.userId, user); 
  }
  getUsers() {
    return Array.from(this.currentUsers.values());
  }
  removeUser(userId: string) {
    this.currentUsers.delete(userId);
  }
  sendMessage(participants: string[], message: string, userId: string) {
    const users = participants.reduce<User[]>((acc, str) => {
      const user = userManager.getOnlineUser(str);
      if (user) {
        acc.push(user);
      }
      return acc;
    }, []);
    this.broadcast(users, userId, JSON.stringify({
      type: "received-message",//TODO:make it enumerate
      data: {
        chatId: this.chatId,
        message
      }
    }));    
  }

  deleteMessage(deletedMessageId: string, userId: string) {
    this.broadcast(Array.from(this.currentUsers.values()), userId, JSON.stringify({
      type: "delete-message",
      data: {
        chatId: this.chatId,
        deletedMessageId,
      }
    }));
  }

  broadcast(users: User[], userId: string, message: string) {
    users.forEach(user => {
      if (user.userId !== userId) {
        user.socket.send(message);
      }
    })
  }
}
export { Chat };
