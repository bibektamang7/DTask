import { Workspace } from "./workspace";

export interface User {
    _id: string;
    username: string;
    email: string;
    workspaces: Workspace[];
    avatar: string;
    
    
}