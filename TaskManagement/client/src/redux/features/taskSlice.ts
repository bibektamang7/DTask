import { createSlice } from "@reduxjs/toolkit";
import { Task } from "@/types/task";

interface TaskInitialStateProps {
	tasks: Task[]
}


const taskInitialState: TaskInitialStateProps = {
	tasks: []
};

const taskSlice = createSlice({
	name: "Task",
	initialState: taskInitialState,
	reducers: {
		setTasks: (state, aciton) => {
			state.tasks = aciton.payload;
		}
	},
});

export const {setTasks} = taskSlice.actions;

export default taskSlice