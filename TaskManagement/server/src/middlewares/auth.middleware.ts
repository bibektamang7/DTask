import jwt, { JwtPayload } from "jsonwebtoken";
import { User, UserModel } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { NextFunction, Request } from "express";

interface AuthPayload extends JwtPayload {
	_id: string;
}

export const authMiddleware = asyncHandler(
	async (req: Request, _, next: NextFunction) => {
		try {
			const token =
				req.cookies?.accessToken ||
				req.header("Authorization")?.split("Bearer")[1].trim();
			if (!token) {
				throw new ApiError(401, "Unauthorized access");
			}
			const decodedToken = jwt.verify(
				token,
				process.env.ACCESS_TOKEN_SECRET!
			) as AuthPayload;
			const user = await UserModel.findById(decodedToken._id);
			if (!user) {
				throw new ApiError(400, "Invalid access Token");
			}

			req.member = user;
			next();
		} catch (error: any) {
			throw new ApiError(401, error?.message || "Invalid Access Token");
		}
	}
);
