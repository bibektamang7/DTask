import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
	_id: mongoose.Types.ObjectId;
	googleId: string;
	refreshToken: string;
	username: string;
	avatar: string;
	email: string;
	password?: string;
	workspaces: mongoose.Types.ObjectId[];
	assignedTasks: mongoose.Types.ObjectId[];
	createdTasks: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<User>(
	{
		username: {
			type: String,
			index: true,
		},
		googleId: {
			type: String,
			required: function () {
				return !this.email;
			},
			index: true,
			unique: true,
			sparse: true,
		},
		refreshToken: String,
		avatar: String,
		email: {
			type: String,
			unique: true,
			sparse: true,
			required: function () {
				return !this.googleId;
			},
		},
		password: {
			type: String,
		},
		workspaces: [
			{
				type: Schema.Types.ObjectId,
				ref: "Workspace",
			},
		],
	},
	{ timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
