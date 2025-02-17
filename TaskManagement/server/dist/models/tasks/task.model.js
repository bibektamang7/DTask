"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Done", "In-Progress", "Todo"],
        required: true,
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    workspaceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    assignees: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "WorkspaceMember",
        }
    ],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "WorkspaceMember",
        required: true,
    },
    attachments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Attachment",
        }
    ],
    comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
}, { timestamps: true });
exports.TaskModel = mongoose_1.default.model("Task", taskSchema);
