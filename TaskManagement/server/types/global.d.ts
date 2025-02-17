import { User as IUser } from "src/models/user.model";
import { WorkspaceProps } from "../models/workspaces/workspaceMember.model";

declare global {
	namespace Express {
		interface Request {
			workspaceMember?: WorkspaceProps;
			member?: IUser;
		}
	}
}

export {};
