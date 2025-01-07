import { Request } from "express";
import { User, UserModel } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = (id: string) => {
  const accessToken = jwt.sign({ _id: id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign(
    { _id: id },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  return { accessToken, refreshToken };
};

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
};
