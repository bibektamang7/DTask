import { User } from "../../user";
import { userManager } from "../../user";

class Chat {
	chatId: string;
	private currentUsers: Set<User>;
	constructor(chatId: string) {
		this.chatId = chatId;
		this.currentUsers = new Set();
	}

	addUser(user: User) {
		this.currentUsers.add(user);
	}
	removeUser(user: User) {
		this.currentUsers.delete(user);
	}
}
export { Chat };
