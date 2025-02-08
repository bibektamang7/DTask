"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const googleAuth_1 = __importDefault(require("../helpers/googleAuth"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// still need to consider login and signup route
router
    .route("/google")
    .get(googleAuth_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.route("/auth/google/callback").get(googleAuth_1.default.authenticate("google", {
    failureRedirect: "/login",
    session: false,
}), user_controller_1.userSignIn);
router
    .route("/")
    .get(user_controller_1.getUser)
    .patch(auth_middleware_1.authMiddleware, user_controller_1.updateUserDetails)
    .delete(user_controller_1.deleteUser);
router.route("/login").post(user_controller_1.userLoginWithEmailAndPassword);
router.route("/signup").post(user_controller_1.registerUser);
router.route("/username").post(user_controller_1.setUsername);
router.route("/logout").post(auth_middleware_1.authMiddleware, user_controller_1.logout);
router.route("/refresh-token").get(auth_middleware_1.authMiddleware, user_controller_1.refreshToken);
exports.default = router;
