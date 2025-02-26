import { createSlice } from "@reduxjs/toolkit";
import { Workspace } from "@/types/workspace";
interface WorkspaceInitialStateProps {
    workspace: Workspace
}


const workspaceInitialState: WorkspaceInitialStateProps = {
    workspace: {
        _id: "",
        name: "",
        members: [],
        owner: "",
        tasks: []
    }
}
const workspaceSlice = createSlice({
    name: "Workspace",
    initialState: workspaceInitialState,
    reducers: {
        setWorkspace: (state, action) => {
            state.workspace = action.payload;
        }
    }
}) 

export const {setWorkspace} = workspaceSlice.actions;

export default workspaceSlice;