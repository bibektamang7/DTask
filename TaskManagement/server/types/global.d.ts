import { User as IUser } from "src/models/user.model";
import { WorkspaceMember } from "../models/workspaces/workspaceMember.model";

declare global {
	namespace Express {
		interface Request {
			workspaceMember?: WorkspaceMember;
			member?: IUser;
		}
	}
}

export {};
