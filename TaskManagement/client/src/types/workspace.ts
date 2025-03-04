import { Task } from "./task";
import { User } from "./user";
export interface WorkspaceMember {
	_id: string;
	user: User;
	role: string;
	isJoined: boolean;
	workspace: string;
    todos: Todo[]
}

export interface Workspace {
	_id: string;
	name: string;
	owner: User;
	members: WorkspaceMember[];
	tasks: Task[];
}

export interface Todo {
	isTick: boolean;
	title: string;
	_id: string;
}
