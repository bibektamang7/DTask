import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { User, userManager } from "./user";
// import { workspaceManager } from "./workspaceManager";
import dotenv from "dotenv";
const wss = new WebSocketServer({ port: 8080 });

import "./workspaceManager";
import "./services/tasks/taskManager";
import "./services/chats/chatManager";

console.log("websocket connection open");

dotenv.config({
	path: "./.env",
});

const validateToken = (token: string) => {
	const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as {
		_id: string;
	};
	console.log(decodedToken);
	return decodedToken._id;
};

wss.on("connection", function connection(ws: WebSocket, req) {
	ws.on("error", console.error);

	try {
		// console.log(req.headers["sec-websocket-protocol"]);
		const token =
			req.headers["sec-websocket-protocol"] || req.headers.authorization;
		if (!token) {
			ws.close(1008, "Unauthorized");
			return;
		}

		const userId = validateToken(token);
		const user = new User(ws, userId);
		userManager.addOnlineUsers(user);

		ws.onmessage = (event) => {
			const message = JSON.parse(event.data.toString());
			callManager.handleCallEvents(message);
		};

		// ws.onmessage = function (e) {
		// 	const message = JSON.parse(e.data.toString());
		// 	const connectionType = message.connectionType;
		// 	if (connectionType === "workspaces") {
		// 		workspaceManager.handleWorkspaceEvents(user, message);
		// 	} else if (connectionType === "chats") {
		// 		workspaceManager.handleWorkspaceChats(user, message);
		// 	} else if (connectionType === "tasks") {
		// 		workspaceManager.handleWorkspaceTasks(user, message);
		// 	}
		// };
		ws.onclose = () => {
			// workspaceManager.removeUser(userId);
			userManager.removeOnlineUser(user.userId);
		};
	} catch (error) {
		console.log("Something went wront while parsing token", error);
		ws.close(1011, "Internal server error");
	}
});

class CallManager {
	private static instance: CallManager;
	chatUserMapping: Map<string, User[]>;
	chatOfferMapping: Map<string, string>;
	constructor() {
		this.chatUserMapping = new Map();
		this.chatOfferMapping = new Map();
	}
	static getInstance() {
		if (CallManager.instance) {
			return CallManager.instance;
		}
		CallManager.instance = new CallManager();
		return CallManager.instance;
	}
	handleCallEvents(message: any) {
		console.log(message.type, "flksdfkj hjai");
		if (message.type === "call-accepted") {
			const chatId = message.data.chatId;
			const callAcceptedBy = message.data.by;
			const callFrom = message.data.callFrom;

			const callerUser = userManager.getOnlineUser(callFrom);

			callerUser?.socket.send(
				JSON.stringify({
					type: "send-offer",
					data: {
						callAcceptedBy,
						chatId,
					},
				})
			);
		} else if (message.type === "call-rejected") {
			const chatId = message.data.chatId;

			const chatUsers = this.chatUserMapping.get(chatId) || [];
			const rejectedBy = message.data.by;

			this.broadcastCall(
				JSON.stringify({
					type: "call-rejectedBy",
					data: {
						by: rejectedBy,
						chatId,
					},
				}),
				chatUsers,
				rejectedBy
			);
		} else if (message.type === "call-members") {
			const chatMembers = message.data.chatMembers;
			const chatId = message.data.chatId;
			const callByUser = message.data.from;
			const currentUser = userManager.getOnlineUser(callByUser)!;

			const onlineUsers = chatMembers
				.map((userId: string) => userManager.getOnlineUser(userId))
				.filter((user: User) => !!user);
			this.chatUserMapping.set(chatId, [currentUser]);

			this.broadcastCall(
				JSON.stringify({
					type: "incoming-call",
					data: {
						callType: message.data.callType,
						callFrom: callByUser,
						chatId,
					},
				}),
				onlineUsers,
				callByUser
			);
		} else if (message.type === "receive-offer") {
			const offer = message.data.offer;
			const reciever = message.data.to;
			const sender = message.data.from;
			const receiverUser = userManager.getOnlineUser(reciever);

			receiverUser?.socket.send(
				JSON.stringify({
					type: "send-answer",
					data: {
						offer,
						to: sender,
					},
				})
			);
		} else if (message.type === "receive-answer") {
			const answer = message.data.answer;
			const receiver = message.data.to;

			const receiverUser = userManager.getOnlineUser(receiver);

			receiverUser?.socket.send(
				JSON.stringify({
					type: "set-answer",
					data: {
						from: message.data.from,
						answer,
					},
				})
			);
		} else if (message.type === "candidate") {
			const receiver = message.data.to;
			const receiverUser = userManager.getOnlineUser(receiver);

			receiverUser?.socket.send(
				JSON.stringify({
					type: "set-candidate",
					data: {
						candidate: message.data.candidate,
						from: message.data.from,
					},
				})
			);
		} else if (message.type === "nego-needed") {
			console.log("mego is need is ana what goin on");
			const offer = message.data.offer;
			const reciever = message.data.to;
			const sender = message.data.from;
			const receiverUser = userManager.getOnlineUser(reciever);

			receiverUser?.socket.send(
				JSON.stringify({
					type: "nego-offer",
					data: {
						offer,
						to: sender,
					},
				})
			);
		} else if (message.type === "nego-answer") {
			const answer = message.data.answer;
			const receiver = message.data.to;

			const receiverUser = userManager.getOnlineUser(receiver);

			receiverUser?.socket.send(
				JSON.stringify({
					type: "set-NegoAnswer",
					data: {
						from: message.data.from,
						answer,
					},
				})
			);
		} else if (message.type === "user-left") {
			const userId = message.data.userId;
			const leftUser = userManager.getOnlineUser(userId);

			if (leftUser) {
				leftUser.socket.send(
					JSON.stringify({
						type: "user-leave",
						data: {
							userId: leftUser.userId,
						},
					})
				);
			}
		}
	}
	broadcastCall(message: string, users: User[], currentUser: string) {
		users.forEach((user) => {
			if (user.userId !== currentUser) {
				user.socket.send(message);
			}
		});
	}
}

export const callManager = CallManager.getInstance();
