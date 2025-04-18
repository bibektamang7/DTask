import { Request } from "express";
import { User, UserModel } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import {
	setUsernameSchema,
	signupSchema,
	userLoginWithEmailAndPasswordSchema,
} from "../helpers/validation";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { createClient } from "redis";

const userClient = createClient({ url: process.env.REDIS_URL });
userClient.connect().then(() => console.log("User client is connected"));

const encryptPassword = async (password: string) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	return hashedPassword;
};

const decryptPassword = async (password: string, savedPassword: string) => {
	const pass = await bcrypt.compare(password, savedPassword);
	return pass;
};

const generateAccessAndRefreshToken = (id: string) => {
	const accessToken = jwt.sign({ _id: id }, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: "1h",
	});

	const refreshToken = jwt.sign(
		{ _id: id },
		process.env.REFRESH_TOKEN_SECRET!,
		{ expiresIn: "7d" }
	);
	return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
	const parsedData = signupSchema.safeParse(req.body);
	if (!parsedData.success) {
		throw new ApiError(400, "Invalid credentials");
	}
	const user = await UserModel.findOne({
		email: parsedData.data.email,
	});

	if (user) {
		throw new ApiError(400, "Email already exists");
	}

	const password = await encryptPassword(parsedData.data.password);

	const createdUser = await UserModel.create({
		email: parsedData.data.email,
		// username: parsedData.data.username,
		password,
	});
	if (!createdUser) {
		throw new ApiError(500, "Failed to signup");
	}
	const { refreshToken, accessToken } = generateAccessAndRefreshToken(
		createdUser._id.toString()
	);

	const options = {
		secure: true,
		httpOnly: true,
	};
	res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					token: accessToken,
					user: {
						avatar: createdUser.avatar,
						email: createdUser.email,
						_id: createdUser._id,
						username: createdUser.username,
					},
				},
				"Signup Successfull"
			)
		);
});

const setUsername = asyncHandler(async (req, res) => {
	const parsedData = setUsernameSchema.safeParse(req.body);
	if (!parsedData.success) {
		throw new ApiError(400, "Validation error");
	}
	const user = await UserModel.findOne({
		username: parsedData.data.username,
	});
	if (user) {
		throw new ApiError(400, "Username already exists");
	}

	const createdUser = await UserModel.findByIdAndUpdate(req.member._id, {
		$set: {
			username: parsedData.data.username,
		},
	});
	if (!createdUser) {
		throw new ApiError(500, "Failed to register username");
	}

	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ username: createdUser.username },
				"Username is set successfully"
			)
		);
});

const userLoginWithEmailAndPassword = asyncHandler(async (req, res) => {
	const parsedData = userLoginWithEmailAndPasswordSchema.safeParse(req.body);
	if (!parsedData.success) {
		throw new ApiError(400, "Validation Error");
	}
	const user = await UserModel.findOne({
		email: parsedData.data.email,
	});

	if (!user || !user.password) {
		throw new ApiError(400, "User not found!");
	}
	const isPasswordCorrect = await decryptPassword(
		parsedData.data.password,
		user.password
	);
	if (!isPasswordCorrect) {
		throw new ApiError(400, "Incorrect password");
	}

	const { refreshToken, accessToken } = generateAccessAndRefreshToken(
		user._id.toString()
	);

	const options = {
		secure: true,
		httpOnly: true,
	};
	res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					token: accessToken,
					user: {
						avatar: user.avatar,
						email: user.email,
						_id: user._id,
						username: user.username,
					},
				},
				"Logged in successfully"
			)
		);
});

const userSignIn = asyncHandler(async (req, res) => {
	console.log("this is user signin", req.user);
	const user = req.user as User;
	const { accessToken, refreshToken } = generateAccessAndRefreshToken(
		user._id.toString()
	);
	const updateUser = await UserModel.findByIdAndUpdate(
		user._id,
		{
			$set: {
				refreshToken: refreshToken,
			},
		},
		{
			new: true,
		}
	);

	if (!updateUser) {
		throw new ApiError(500, "Failed to login");
	}
	const frontendUrl = `${process.env.AUTH_SUCCESS}/oauth-success?token=${accessToken}&userId=${user._id}`;
	res.redirect(`${frontendUrl}`);
});

const logout = asyncHandler(async (req: Request, res) => {
	const user = await UserModel.findByIdAndUpdate(
		req.member._id,
		{
			$set: {
				refreshToken: undefined,
			},
		},
		{
			new: true,
		}
	);

	if (!user) {
		throw new ApiError(500, "Failed to logout");
	}
	res.status(200).json(new ApiResponse(200, {}, "Logout successfully"));
});

const refreshToken = asyncHandler(async (req, res) => {
	const token = req.cookies.refreshToken;
	if (!token) {
		throw new ApiError(400, "Unauthorized request");
	}
	const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
		_id: string;
	};
	if (!decodedToken) {
		throw new ApiError(400, "Invalid token");
	}
	const user = await UserModel.findById(decodedToken._id);
	if (!user) {
		throw new ApiError(400, "Invalid token");
	}

	if (token !== user.refreshToken) {
		throw new ApiError(400, "Token expired or used");
	}

	const { accessToken, refreshToken } = generateAccessAndRefreshToken(
		user._id.toString()
	);

	const updateUser = await UserModel.findByIdAndUpdate(user._id, {
		$set: {
			refreshToken: refreshToken,
		},
	});
	if (!updateUser) {
		throw new ApiError(500, "Failed to assign new refresh token");
	}
	const options = {
		httpOnly: true,
		secure: true,
	};

	res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(new ApiResponse(200, {}, "Fetched new token"));
});

const getUser = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	if (!userId) {
		res.status(400).json(new ApiResponse(400, {}, "User Id required"));
		return;
	}
	const user = await UserModel.findById(userId).select("-password");
	if (!user) {
		throw new ApiError(400, "User not found");
	}
	res.status(200).json(new ApiResponse(200, user));
});

const updateUserDetails = asyncHandler(async (req, res) => {});

const deleteUser = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	if (!userId) {
		res.status(400).json(new ApiResponse(400, {}, "User Id required"));
		return;
	}
	const user = await UserModel.findByIdAndDelete(userId);
	if (!user) {
		throw new ApiError(400, "Failed to delete user");
	}
	res.status(200).json(new ApiResponse(200, {}, "User Deleted successfully"));
});

//TODO: need to consider this logic
//ether fetch users if leading characters matched
//or fetch user on the basis of full email

const getUsersByEmail = asyncHandler(async (req, res) => {
	const { email } = req.body;
	if (!email) {
		throw new ApiError(400, "Email is required");
	}
});

const getUserByEmail = asyncHandler(async (req, res) => {
	const { email } = req.query;
	const user = await UserModel.findOne({
		email: email,
	}).select("-password");
	if (!user) {
		throw new ApiError(400, "User not found");
	}
	res.status(200).json(new ApiResponse(200, user));
});

export {
	getUser,
	getUserByEmail,
	updateUserDetails,
	deleteUser,
	userSignIn,
	logout,
	refreshToken,
	registerUser,
	setUsername,
	userLoginWithEmailAndPassword,
};
