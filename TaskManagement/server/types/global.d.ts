import { User } from "../src/models/user.model";
// import "express";
import { WorkspaceMember } from "../models/workspaces/workspaceMember.model";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      workspaceMember?: WorkspaceMember
    }
  }
}

export {};
