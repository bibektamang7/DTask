import mongoose, {Schema} from "mongoose";

export interface WorkspaceProps {
    name: string;
    owner: mongoose.Types.ObjectId,
    members: [mongoose.Types.ObjectId], 
    tasks: [mongoose.Types.ObjectId], 
}


const workspaceSchema = new Schema<WorkspaceProps>({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "WorkspaceMember",
        }
    ],
  
}, { timestamps: true });


export const WorkspaceModel = mongoose.model("Workspace", workspaceSchema);