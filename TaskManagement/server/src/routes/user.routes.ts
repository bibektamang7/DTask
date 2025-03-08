import { Router } from "express";
import {
	getUser,
	deleteUser,
	updateUserDetails,
	userSignIn,
	logout,
	refreshToken,
	registerUser,
	setUsername,
	userLoginWithEmailAndPassword,
	getUserByEmail,
} from "../controllers/user.controller";
import password from "../helpers/googleAuth";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// still need to consider login and signup route

router
	.route("/google")
	.get(password.authenticate("google", { scope: ["profile", "email"] }));
router.route("/auth/google/callback").get(
	password.authenticate("google", {
		failureRedirect: "/login",
		session: false,
	}),
	userSignIn
);
router
	.route("/")
	.get(authMiddleware, getUser)
	.patch(authMiddleware, updateUserDetails)
	.delete(authMiddleware, deleteUser);

router.route("/getUser").get(authMiddleware, getUserByEmail);

router.route("/login").post(userLoginWithEmailAndPassword);
router.route("/signup").post(registerUser);
router.route("/username").patch(authMiddleware, setUsername);
router.route("/logout").post(authMiddleware, logout);
router.route("/refresh-token").get(authMiddleware, refreshToken);

export default router;
