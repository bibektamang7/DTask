import { UserModel } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getUser = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    if (!userId) {
        res.status(400).json(new ApiResponse(400, {}, "User Id required"));
        return;
    }
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
        throw new ApiError(400, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user));
})

const updateUserDetails = asyncHandler(async (req, res) => {
    
})

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
})

export { getUser, updateUserDetails, deleteUser };
