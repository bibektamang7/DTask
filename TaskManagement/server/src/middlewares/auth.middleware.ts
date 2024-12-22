import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError";
import { NextFunction, Request } from "express";

export const authMiddleware = asyncHandler(async (req: Request, _, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer", "");
        if (!token) {
            throw new ApiError(403, "Unauthorized access");
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as {_id: string};
        const user = await UserModel.findById(decodedToken._id);
        if (!user) {
            throw new ApiError(400, "Invalid access Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(403, error?.message || "Invalid Access Token"); 
    }
})