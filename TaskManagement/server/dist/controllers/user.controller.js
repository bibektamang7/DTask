"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginWithEmailAndPassword = exports.setUsername = exports.registerUser = exports.refreshToken = exports.logout = exports.userSignIn = exports.deleteUser = exports.updateUserDetails = exports.getUser = void 0;
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validation_1 = require("../helpers/validation");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const encryptPassword = (password) => {
    const hashedPassword = bcryptjs_1.default.hash(password, 10);
    return hashedPassword;
};
const decryptPassword = (password, savedPassword) => {
    const pass = bcryptjs_1.default.compare(savedPassword, password);
    return pass;
};
const generateAccessAndRefreshToken = (id) => {
    // TODO:NOT SURE ABOUT THIS NOW
    // @ts-ignore
    const accessToken = jsonwebtoken_1.default.sign({ _id: id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h",
    });
    // @ts-ignore
    const refreshToken = jsonwebtoken_1.default.sign({ _id: id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" });
    return { accessToken, refreshToken };
};
const registerUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = validation_1.signupSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Invalid credentials");
    }
    const user = yield user_model_1.UserModel.findOne({
        email: parsedData.data.email,
    });
    if (user) {
        throw new ApiError_1.ApiError(400, "Email already exists");
    }
    const password = encryptPassword(parsedData.data.password);
    const createdUser = yield user_model_1.UserModel.create({
        email: parsedData.data.email,
        password,
    });
    if (!createdUser) {
        throw new ApiError_1.ApiError(400, "Failed to register user");
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, "User registered successfully"));
}));
exports.registerUser = registerUser;
const setUsername = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = validation_1.setUsernameSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Validation error");
    }
    const user = yield user_model_1.UserModel.findOne({
        username: parsedData.data.username,
    });
    if (user) {
        throw new ApiError_1.ApiError(400, "Username already exists");
    }
    const createdUser = yield user_model_1.UserModel.findOneAndUpdate({ email: parsedData.data.email }, {
        $set: {
            username: parsedData.data.username,
        },
    });
    if (!createdUser) {
        throw new ApiError_1.ApiError(500, "Failed to register username");
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, "Username is set successfully"));
}));
exports.setUsername = setUsername;
const userLoginWithEmailAndPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = validation_1.userLoginWithEmailAndPasswordSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(400, "Validation Error");
    }
    const user = yield user_model_1.UserModel.findOne({
        email: parsedData.data.email,
    });
    if (!user || !user.password) {
        throw new ApiError_1.ApiError(400, "User not found!");
    }
    const isPasswordCorrect = decryptPassword(parsedData.data.password, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError_1.ApiError(400, "Incorrect password");
    }
    if (!user.username) {
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Username is not set"));
    }
    //TODO: need to extract workspace releted data
    res.status(200).json(new ApiResponse_1.ApiResponse(200, user, "Logged in successfully"));
}));
exports.userLoginWithEmailAndPassword = userLoginWithEmailAndPassword;
const userSignIn = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.user;
    const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id.toString());
    const updateUser = yield user_model_1.UserModel.findByIdAndUpdate(user._id, {
        $set: {
            refreshToken: refreshToken,
        },
    }, {
        new: true,
    });
    if (!updateUser) {
        throw new ApiError_1.ApiError(500, "Failed to login");
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
        .json(new ApiResponse_1.ApiResponse(200, {}, "Login successfully"));
}));
exports.userSignIn = userSignIn;
const logout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined,
        },
    }, {
        new: true,
    });
    if (!user) {
        throw new ApiError_1.ApiError(500, "Failed to logout");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Logout successfully"));
}));
exports.logout = logout;
const refreshToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    if (!token) {
        throw new ApiError_1.ApiError(400, "Unauthorized request");
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (!decodedToken) {
        throw new ApiError_1.ApiError(400, "Invalid token");
    }
    const user = yield user_model_1.UserModel.findById(decodedToken._id);
    if (!user) {
        throw new ApiError_1.ApiError(400, "Invalid token");
    }
    if (token !== user.refreshToken) {
        throw new ApiError_1.ApiError(400, "Token expired or used");
    }
    const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id.toString());
    const updateUser = yield user_model_1.UserModel.findByIdAndUpdate(user._id, {
        $set: {
            refreshToken: refreshToken,
        },
    });
    if (!updateUser) {
        throw new ApiError_1.ApiError(500, "Failed to assign new refresh token");
    }
    const options = {
        httpOnly: true,
        secure: true,
    };
    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse_1.ApiResponse(200, {}, "Fetched new token"));
}));
exports.refreshToken = refreshToken;
const getUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        res.status(400).json(new ApiResponse_1.ApiResponse(400, {}, "User Id required"));
        return;
    }
    const user = yield user_model_1.UserModel.findById(userId).select("-password");
    if (!user) {
        throw new ApiError_1.ApiError(400, "User not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, user));
}));
exports.getUser = getUser;
const updateUserDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.updateUserDetails = updateUserDetails;
const deleteUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        res.status(400).json(new ApiResponse_1.ApiResponse(400, {}, "User Id required"));
        return;
    }
    const user = yield user_model_1.UserModel.findByIdAndDelete(userId);
    if (!user) {
        throw new ApiError_1.ApiError(400, "Failed to delete user");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "User Deleted successfully"));
}));
exports.deleteUser = deleteUser;
//TODO: need to consider this logic
//ether fetch users if leading characters matched
//or fetch user on the basis of full email
const getUsersByEmail = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        throw new ApiError_1.ApiError(400, "Email is required");
    }
}));
