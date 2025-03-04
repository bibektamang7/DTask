import {
	useAddTodoMutation,
	useDeleteTodoMutation,
	useUpdateTodoMutation,
} from "@/redux/services/workspaceApi";
import { toast } from "../use-toast";
const useTodo = () => {
	const workspaceId = localStorage.getItem("workspace");
	const [addTodo, { isLoading }] = useAddTodoMutation();
	const [updateTodo, { isLoading: updateLoading }] = useUpdateTodoMutation();
	const [deleteTodo, { isLoading: deleteLoading }] = useDeleteTodoMutation();
	const handleAddTodo = async (title: string) => {
		try {
			const response = await addTodo({ title, workspaceId }).unwrap();
			return response.data;
		} catch (error: any) {
			toast({
				title: "Failed to add todo.",
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	const handleDeleteTodo = async (todoId: string) => {
		try {
			const response = await deleteTodo({ todoId, workspaceId }).unwrap();
			return response.data;
		} catch (error: any) {
			toast({
				title: "Failed to delete todo.",
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	const handleUpdateTodo = async (todoId: string, isTick: boolean) => {
		try {
			await updateTodo({ todoId, workspaceId, isTick }).unwrap();
		} catch (error: any) {
			toast({
				title: "Failed to delete todo.",
				description: "Please try again",
				variant: "destructive",
			});
		}
	};
	return { handleAddTodo, isLoading, handleDeleteTodo, deleteLoading, handleUpdateTodo , updateLoading};
};

export { useTodo };
