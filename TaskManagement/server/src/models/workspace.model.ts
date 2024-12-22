import mongoose, {Schema} from "mongoose";

const workspaceSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    description: String,
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
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Task",
        }
    ],

}, { timestamps: true });


export const WorkspaceModel = mongoose.model("Workspace", workspaceSchema);