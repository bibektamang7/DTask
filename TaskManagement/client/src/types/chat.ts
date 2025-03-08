import { Attachment } from "./task";
import { WorkspaceMember } from "./workspace";

export interface ChatSchema {
	_id: string;
	workspaceId: string;
	creator: string;
	lastMessage: MessageSchema;
	messages: MessageSchema[];
	members: WorkspaceMember[];
	unreadCounts: Record<string, number>;
	name: string;
}
export interface MessageSchema {
	_id: string;
	sender: string;
	content: string;
	attachments: Attachment[];
	createdAt: Date,
}
