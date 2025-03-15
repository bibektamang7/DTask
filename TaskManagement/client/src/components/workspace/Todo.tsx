import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Delete, LoaderCircle, PencilIcon, Quote, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Todo } from "@/types/workspace";
import { Label } from "../ui/label";
import { useTodo } from "@/hooks/customs/useTodo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const MyTodo = () => {
	const workspace = useSelector(
		(state: RootState) => state.Workspaces.workspace
	);
	const [isNewTodo, setIsNewTodo] = useState<boolean>(false);
	const [todoTitle, setTodoTitle] = useState<string>("");
	const [todos, setTodos] = useState<Todo[]>([]);

	const {
		handleAddTodo,
		isLoading,
		handleDeleteTodo,
		deleteLoading,
		handleUpdateTodo,
		updateLoading,
	} = useTodo();

	const handleTodo = async () => {
		if (todoTitle.length > 0) {
			const todoResponse = await handleAddTodo(todoTitle);
			setTodos((prev) => [...prev, todoResponse]);
			setIsNewTodo(false);
		}
	};
	const handleDeletingTodo = async (todoId: string) => {
		const deletedTodo = await handleDeleteTodo(todoId);
		setTodos((prev) => prev.filter((todo) => todo._id !== deletedTodo._id));
	};
	useEffect(() => {
		if (workspace) {
			const admin = workspace.members.find(
				(member) => member.user._id === workspace.owner._id
			);
			console.log(admin);

			setTodos(admin?.todos || []);
		}
	}, [workspace]);

	// TODO: NEED TO HANDLE EXCESSIVE TOGGLE OF TICK OR CHECKED
	const handleTodoUpdate = async (todoId: string, isTick: boolean) => {
		await handleUpdateTodo(todoId, isTick);
	};

	return (
		<Card className="lg:col-span-2">
			<CardContent className="p-6">
				<div className="flex items-center gap-2 mb-4">
					<PencilIcon className="h-6 w-6 text-yellow-500" />
					<h2 className="text-xl font-semibold">To do list</h2>
				</div>
				<Button
					onClick={() => setIsNewTodo(true)}
					variant="ghost"
					className="w-full justify-start text-muted-foreground mb-4"
				>
					+ click to add
				</Button>
				<div className="space-y-3">
					{todos.map((todo) => (
						<div
							key={todo._id}
							className="flex items-start justify-between  gap-2"
						>
							<div className="flex gap-2 items-center-justify-center">
								<input
									type="checkbox"
									disabled={updateLoading}
									onChange={(e) => handleTodoUpdate(todo._id, e.target.checked)}
									defaultChecked={todo.isTick}
									id={todo._id}
									className="hover:cursor-pointer"
								/>
								<Label
									htmlFor={todo._id}
									className="text-sm leading-none"
								>
									{todo.title}
								</Label>
							</div>
							{deleteLoading ? (
								<LoaderCircle
									className="animate-spin"
									type="icon"
									size={14}
								/>
							) : (
								<Trash
									onClick={() => handleDeletingTodo(todo._id)}
									size={13}
									type="icon"
									className="hover:cursor-pointer"
								/>
							)}
						</div>
					))}
					{isNewTodo && (
						<div className="flex items-center justify-center gap-4">
							<Input
								placeholder="Todo's title"
								onChange={(e) => setTodoTitle(e.target.value)}
							/>
							<Button
								className="text-sm"
								onClick={handleTodo}
							>
								{isLoading ? "Loading..." : "Add"}
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default MyTodo;
