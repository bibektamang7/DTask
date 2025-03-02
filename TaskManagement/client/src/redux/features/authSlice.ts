import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInitialStateProps {
	user: User
}
const userInitialState: UserInitialStateProps = {
	user: {
		_id: "",
		avatar: "",
		email: "",
		username:"",
	},
};
const userSlice = createSlice({
	name: "User",
	initialState: userInitialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
		logout: () => {},
 	},
});

export const { setUser, logout } = userSlice.actions;
export default userSlice;
