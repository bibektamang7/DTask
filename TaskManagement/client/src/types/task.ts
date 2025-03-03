import { User } from "./user";
import { WorkspaceMember } from "./workspace";

type Status = "Completed" | "Todo" | "In-Progress"

export interface Task {
    _id: string;
   title: string;
   tags: string[]
   description: string;
   status: Status;
   priority: string;
   dueDate: Date; 
   workspaceId: string;
   assignees: WorkspaceMember[], //TODO:need to consider this
   createdBy: User;
   attachments: Attachment[]; 
   comments: Comment[]
   createdAt: string;
}

export interface Comment {
    _id: string;
    message: string;
    taskId: string;
    createdBy: string;
    attachment: Attachment;
    likes: number;    
    createdAt: Date;
}
export interface Attachment {
    _id:string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    taskId: string;
}


export interface Notification {
    _id: string;
    recipient: string[];
    sender: string;
    purpose:string;
    reference: string;
    referenceModal: string;
    message: string;
    isArchived: boolean;
    createdAt: Date
}