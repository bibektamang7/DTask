import mongoose, {Schema} from "mongoose";

const workspaceMemberSchema = new Schema({
    role: {
        type: String,
        required: true,
        enum: ["Editor", "Member"],
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