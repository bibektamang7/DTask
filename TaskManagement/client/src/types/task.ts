import { User } from "./user";
import { Workspace, WorkspaceMember } from "./workspace";

export type Status = "Completed" | "Todo" | "In-Progress";

export interface Task {
	_id: string;
	title: string;
	tags: string[];
	description: string;
	status: Status;
	startDate: Date;
	priority: string;
	dueDate: Date;
	workspaceId: string;
	assignees: WorkspaceMember[]; //TODO:need to consider this
	createdBy: User;
	attachments: Attachment[];
	comments: Comment[];
	createdAt: string;
}

export interface Comment {
	_id: string;
	message: string;
	taskId: string;
	createdBy: string;
	attachments: Attachment[];
	likes: number;
	createdAt: Date;
}
export interface Attachment {
	_id: string;
	fileName: string;
	fileType: string;
	fileUrl: string;
	taskId: string;
}

type Referece = Task | Workspace | Comment;

export interface Notification {
	_id: string;
	recipient: User[];
	sender: string;
	purpose: string;
	reference: Referece;
	referenceModal: string;
	message: string;
	isArchived: boolean;
	createdAt: Date;
	metadata: Record<string, string>;
}
