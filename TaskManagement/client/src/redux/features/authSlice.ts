import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInitialStateProps {
	user: User;
	workspaces: {}
}
const userInitialState: UserInitialStateProps = {
	user: {
		_id: "",
		avatar: "",
		email: "",
		username: "",
	},
	workspaces: {
		_id: "",
		name: "",
		members: [],
		owner: "",
	}
};
const userSlice = createSlice({
	name: "User",
	initialState: userInitialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
		setCurrentUsername: (state, action) => {
			state.user.username = action.payload
		},
		setWorkspaces: (state, action) => {
			state.workspaces = action.payload
		},
		logout: () => {},
	},
});

export const { setUser, logout, setCurrentUsername, setWorkspaces} = userSlice.actions;
export default userSlice;
