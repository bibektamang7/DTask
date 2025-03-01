import { User as IUser } from "src/models/user.model";
import { WorkspaceProps } from "../models/workspaces/workspaceMember.model";
import { WorkspaceMember } from "../models/workspaces/workspaceMember.model";

declare global {
	namespace Express {
		interface Request {
			workspaceMember?: WorkspaceMember;
			member?: IUser;
			workspace?: WorkspaceProps
		}
	}
}

export {};
