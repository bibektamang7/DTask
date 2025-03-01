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

const userClient = createClient({ url: "redis://localhost:6379" });
userClient.connect().then(() => console.log("User client is connected"));

const encryptPassword = async (password: string) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	return hashedPassword;
};

const decryptPassword = (password: string, savedPassword: string) => {
	const pass = bcrypt.compare(savedPassword, password);
	return pass;
};

const generateAccessAndRefreshToken = (id: string) => {
	// @ts-ignore
	const accessToken = jwt.sign({ _id: id }, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h",
	});

	// @ts-ignore
	const refreshToken = jwt.sign(
		{ _id: id },
		process.env.REFRESH_TOKEN_SECRET!,
		{ expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
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
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const createdUser = await UserModel.create(
			[
				{
					email: parsedData.data.email,
					username: parsedData.data.username,
					password,
				},
			],
			{ session }
		);
		await userClient.publish(
			"createWorkspace",
			JSON.stringify({
				owner: createdUser[0]._id,
				name: parsedData.data.workspace.name,
				members: parsedData.data.workspace.member,
			})
		);
		const workspaceData = await new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				userClient.unsubscribe("workspace:created");
				userClient.unsubscribe("workspace:failed");
				reject(new Error("Workspace creation timeout"));
			}, 10000);

			userClient.subscribe("workspace:created", (message) => {
				const { workspace } = JSON.parse(message.toString());
				clearTimeout(timeout); // Clear the timeout if workspace creation is successful
				userClient.unsubscribe("workspace:created"); // Unsubscribe after receiving the message
				userClient.unsubscribe("workspace:failed"); // Unsubscribe to prevent further listening
				resolve(workspace); // Resolve the promise with the message
			});

			userClient.subscribe("workspace:failed", () => {
				clearTimeout(timeout); // Clear timeout if creation fails
				userClient.unsubscribe("workspace:created");
				userClient.unsubscribe("workspace:failed");
				console.log("Workspace creation failed.");
				reject(new Error("Workspace creation failed"));
			});

			req.on("close", () => {
				clearTimeout(timeout); // Ensure timeout is cleared if the request is closed
				userClient.unsubscribe("workspace:created");
				userClient.unsubscribe("workspace:failed");
			});
		});

		const updatedUser = await UserModel.findByIdAndUpdate(
			createdUser[0]._id,
			{
				$push: {
					workspaces: workspaceData,
				},
			},
			{ new: true, session: session }
		);
		if (!updatedUser) {
			throw new ApiError(500, "Unable to create user");
		}
		console.log(workspaceData);

		console.log(updatedUser);

		await session.commitTransaction();
		res.status(200).json(new ApiResponse(200, {}, "Signup successfull"));
	} catch (error) {
		await session.abortTransaction();
		res
			.status(500)
			.json(new ApiResponse(500, {}, "Failed to signup, please try again."));
	} finally {
		session.endSession();
	}
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

	const createdUser = await UserModel.findOneAndUpdate(
		{ email: parsedData.data.email },
		{
			$set: {
				username: parsedData.data.username,
			},
		}
	);
	if (!createdUser) {
		throw new ApiError(500, "Failed to register username");
	}
	res
		.status(200)
		.json(new ApiResponse(200, {}, "Username is set successfully"));
});

const userLoginWithEmailAndPassword = asyncHandler(async (req, res) => {
	const parsedData = userLoginWithEmailAndPasswordSchema.safeParse(req.body);
	if (!parsedData.success) {
		throw new ApiError(400, "Validation Error");
	}
	console.log(parsedData.data);

	const user = await UserModel.findOne({
		email: parsedData.data.email,
	});

	if (!user || !user.password) {
		throw new ApiError(400, "User not found!");
	}
	const isPasswordCorrect = decryptPassword(
		parsedData.data.password,
		user.password
	);
	if (!isPasswordCorrect) {
		throw new ApiError(400, "Incorrect password");
	}
	if (!user.username) {
		res.status(200).json(new ApiResponse(200, {}, "Username is not set"));
	}

	const { refreshToken, accessToken } = generateAccessAndRefreshToken(
		user._id.toString()
	);

	const options = {
		secure: true,
		httpOnly: true,
	};
	console.log("accessToekn", accessToken);
	console.log("refreshToken", refreshToken);
	
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
	const { user } = req.user as { user: User };
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
	const options = {
		httpOnly: true,
		secure: true,
		sameSite: true,
	};

	res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(new ApiResponse(200, {}, "Login successfully"));
});

const logout = asyncHandler(async (req: Request, res) => {
	const user = await UserModel.findByIdAndUpdate(
		(req.user as User)._id,
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

export {
	getUser,
	updateUserDetails,
	deleteUser,
	userSignIn,
	logout,
	refreshToken,
	registerUser,
	setUsername,
	userLoginWithEmailAndPassword,
};
