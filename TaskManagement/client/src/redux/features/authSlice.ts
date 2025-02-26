import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const userInitialState = {
	user: {},
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
