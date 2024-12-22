import { WorkspaceMemberModel } from "../models/workspaceMember.model";
import { WorkspaceModel } from "../models/workspace.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const createWorkspace = asyncHandler(async (req, res) => {});

const deleteWorkspace = asyncHandler(async (req, res) => {});

const updateWorkspace = asyncHandler(async (req, res) => {});

const getWorkspace = asyncHandler(async (req, res) => {});

const addMemeberInWorkspace = asyncHandler(async (req, res) => {});

const getAllMembersFromWorkspace = asyncHandler(async (req, res) => {});

const deleteMemberFromWorkspace = asyncHandler(async (req, res) => {
    
})



export {
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
    getWorkspace,
    addMemeberInWorkspace,
    getAllMembersFromWorkspace,
    deleteMemberFromWorkspace
}