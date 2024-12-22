import { Router } from "express";
import {
  getUser,
  deleteUser,
  updateUserDetails,
} from "../controllers/user.controller";

const router = Router();

// still need to consider login and signup route



router.route("/").get(getUser).patch(updateUserDetails).delete(deleteUser);

export default router;
