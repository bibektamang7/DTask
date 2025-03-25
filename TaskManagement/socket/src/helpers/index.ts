import { User } from "../user";

export function socketBroadcast(
	users: User[],
	message: string,
	userId: string
) {
	if (users.length > 0) {
		users.forEach((user) => {
			if (user.userId !== userId) {
				user.socket.send(message);
			}
		});
	}
}
