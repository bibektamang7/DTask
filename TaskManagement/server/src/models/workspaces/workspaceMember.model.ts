import mongoose, {Schema, Document} from "mongoose";

type Role = "Member" | "Editor" | "Admin"

export interface WorkspaceMember extends Document{
    _id: mongoose.Types.ObjectId,
    role: Role;
    isJoined: boolean;
    workspace: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId
}

const workspaceMemberSchema = new Schema<WorkspaceMember>({
    role: {
        type: String,
        required: true,
        enum: ["Editor", "Member", "Admin"],
        default: "Member",
    },
    isJoined: {
        type: Boolean,
        default: false,
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

export const WorkspaceMemberModel = mongoose.model("WorkspaceMember", workspaceMemberSchema);