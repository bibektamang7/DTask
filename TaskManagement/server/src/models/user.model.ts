import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document{
  _id: mongoose.Types.ObjectId,
  username: string;
  avatar: string;
  email: string;
  password: string;
  workspaces: mongoose.Types.ObjectId[];
  assignedTasks: mongoose.Types.ObjectId[];
  createdTasks: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    avatar: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    workspaces: [
      {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
      },
    ],
    assignedTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    createdTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
