import { Router } from "express";

import {
  createWorkspace,
  deleteWorkspace,
  updateWorkspace,
  getWorkspace,
  addMemeberInWorkspace,
  getAllMembersFromWorkspace,
  deleteMemberFromWorkspace,
} from "../controllers/workspace.controller";

const router = Router();

//still need to consider getAllmembers routes


router
  .route("/")
  .post(createWorkspace)
  .delete(deleteWorkspace)
  .patch(updateWorkspace)
  .get(getWorkspace);

router
  .route("/members")
  .post(addMemeberInWorkspace)
  .delete(deleteMemberFromWorkspace);

export default router;
