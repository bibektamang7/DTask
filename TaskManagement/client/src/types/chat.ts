import { Attachment } from "./task";

export interface ChatSchema {
	_id: string;
	workspaceId: string;
	creator: string;
	lastMessage: MessageSchema;
	messages: MessageSchema[];
	members: string[];
	unreadCounts: Record<string, number>;
	name: string;
}
export interface MessageSchema {
	_id: string;
	chat: string;
	sender: string;
	content: string;
	attachments: Attachment[];
	createdAt: Date;
}
