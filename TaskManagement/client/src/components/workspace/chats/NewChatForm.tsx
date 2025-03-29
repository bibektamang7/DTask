import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useCreateChat from "@/hooks/customs/useCreateChat";

interface NewChatFormProps {
	onClose: () => void;
}

const NewChatForm: React.FC<NewChatFormProps> = ({ onClose }) => {
	const assignees = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);
	const [searchMember, setSearchMember] = useState<string>("");
	const formRef = useRef<HTMLFormElement | null>(null);
	const { handleCreateChat, isLoading } = useCreateChat();
	const form = useForm({
		defaultValues: {
			name: "" as string,
			members: [] as string[],
		},
	});

	const onSubmit = async (data: any) => {
		if (form.watch("members").length === 0) {
			alert("At least one member required");
			return;
		}
		const response = await handleCreateChat(data);
		if (response.success) {
			onClose();
		}
	};

	// const handleClickOutside = useCallback(
	// // 	(event: PointerEvent) => {
	// // 		if (
	// // 			formRef.current &&
	// // 			!formRef.current.contains(event.target as Node) &&
	// // 			!(
	// // 				calendarRef.current &&
	// // 				calendarRef.current.contains(event.target as Node)
	// // 			)
	// // 		) {
	// // 			onClose();
	// // 		}
	// // 	},
	// // 	[onClose]
	// // );

	// // useEffect(() => {
	// // 	document.addEventListener("pointerdown", handleClickOutside);
	// // 	return () =>
	// // 		document.removeEventListener("pointerdown", handleClickOutside);
	// // }, [handleClickOutside]);

	return (
		<div className="fixed left-0 top-0  w-screen h-full backdrop-blur-md z-50 overflow-y-auto py-16">
			<div className="relative w-full max-w-2xl mx-auto p-6 space-y-6 bg-background text-foreground rounded-lg">
				<p
					className="absolute right-7 font-extralight hover:cursor-pointer text-sm top-1"
					onClick={() => onClose()}
				>
					X
				</p>
				<Form {...form}>
					<form
						ref={formRef}
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="chatName">Chat Name</FormLabel>
									<FormControl>
										<Input
											id="chatName"
											placeholder="Enter chat name"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="members"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="members">Members</FormLabel>
										<div className="flex gap-4 items-center">
											<FormControl>
												<Input
													id="members"
													onChange={(e) => setSearchMember(e.target.value)}
													placeholder="Type email or user name"
													className="flex-1"
												/>
											</FormControl>
										</div>
										<div>
											{searchMember.length > 0 &&
												assignees.map((assignee) => {
													if (
														assignee.user.email.startsWith(searchMember) ||
														assignee.user.username.startsWith(searchMember)
													)
														return (
															<div
																key={assignee._id}
																onClick={() => {
																	form.setValue("members", [
																		...form.getValues("members"),
																		assignee._id,
																	]);
																	setSearchMember("");
																}}
																className="flex items-center justify-start gap-4 mt-4 hover:cursor-pointer"
															>
																<Avatar key={assignee._id}>
																	<AvatarImage
																		src={assignee.user.avatar}
																		alt={assignee.user.username}
																	/>
																	<AvatarFallback>
																		{assignee.user.username.charAt(0)}
																	</AvatarFallback>
																</Avatar>
																<p>{assignee.user.username}</p>
															</div>
														);
												})}
										</div>
										<div className="flex mt-2 flex-col">
											<span className="text-sm font-medium text-slate-500">
												Chat members
											</span>
											{form.watch("members").map((assigneeId) =>
												assignees.map((member) => {
													if (member._id === assigneeId) {
														return (
															<div
																key={member.user._id}
																className="flex items-center justify-start gap-4 mt-2"
															>
																<Avatar key={member._id}>
																	<AvatarImage
																		src={member.user.avatar}
																		alt={member.user.username}
																	/>
																	<AvatarFallback>
																		{member.user.username.charAt(0)}
																	</AvatarFallback>
																</Avatar>
																<p>{member.user.username}</p>
															</div>
														);
													}
												})
											)}
										</div>
									</FormItem>
								)}
							/>
						</div>

						<Button
							disabled={isLoading}
							type="submit"
							className="w-full bg-red-500 hover:bg-red-600"
						>
							{isLoading ? <>Loading...</> : "Create"}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default NewChatForm;
