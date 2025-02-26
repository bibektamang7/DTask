import { User } from "./user";

export interface Task {
    _id: string;
   title: string;
   tags: string[]
   description: string;
   status: string;
   priority: string;
   dueDate: Date; 
   workspaceId: string;
   assignees: User[], //TODO:need to consider this
   createdBy: User;
   attachments: Attachment[]; 
   comments: Comment[]
}

interface Comment {
    _id: string;
    message: string;
    taskId: string;
    createdBy: User;
    attachment: Attachment;
    likes: number;    
}
interface Attachment {
    _id:string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    taskId: string;
}