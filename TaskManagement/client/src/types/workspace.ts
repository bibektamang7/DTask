import { Task } from "./task";
import { User } from "./user";
export interface WorkspaceMember {
    _id: string;
    user: User;
    role: string;
    isJoined: boolean;
    workspace: string;
}

export interface Workspace {
    _id: string;
    name: string;
    owner: string;
    members: WorkspaceMember[],
    tasks: Task[];
}