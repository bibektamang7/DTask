import useCreateTask from "@/hooks/customs/useCreateTask";
import { CalendarIcon, Link2, Paperclip, SmilePlus, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useForm, UseFormReturn } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const status = [
	{ id: "1", name: "Todo" },
	{ id: "2", name: "In-Progress" },
	{ id: "3", name: "Completed" },
];
const priorities = [
	{ id: "1", name: "Low" },
	{ id: "2", name: "Medium" },
	{ id: "3", name: "High" },
	{ id: "4", name: "Urgent" },
];

interface NewTaskFormProps {
	workspaceId: string;
	onClose: any;
	onTaskAdded: any;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({
	workspaceId,
	onClose,
	onTaskAdded,
}) => {
	const assignees = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);
	const [searchMember, setSearchMember] = useState<string>("");
	const formRef = useRef<HTMLFormElement | null>(null);
	const calendarRef = useRef<HTMLDivElement | null>(null);
	const { createTask, isLoading } = useCreateTask();
	const form = useForm({
		defaultValues: {
			title: "" as string,
			status: "" as string,
			startDate: new Date(),
			dueDate: new Date(),
			description: "",
			assignees: [] as string[],
			priority: "",
			tags: [] as string[],
			taskFiles: [] as File[],
		},
	});

	const onSubmit = async (data: any) => {
		console.log(data);

		// Data is type of UseFormReturn
		await createTask(data);
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
		<div className="fixed w-full h-full backdrop-blur-md z-10 overflow-y-auto py-16">
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
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Task Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Title"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value
															? format(new Date(field.value), "PPP")
															: "Select start date"}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
												ref={calendarRef}
											>
												<Calendar
													mode="single"
													selected={
														field.value ? new Date(field.value) : undefined
													}
													onSelect={field.onChange}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Due Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															format(new Date(field.value), "PPP")
														) : (
															<span>Select due date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
												ref={calendarRef}
											>
												<Calendar
													mode="single"
													selected={
														field.value ? new Date(field.value) : undefined
													}
													onSelect={field.onChange}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description & Attachment</FormLabel>
									<FormControl>
										<div className="space-y-2">
											<Textarea
												placeholder="Add description..."
												className="min-h-[100px]"
												{...field}
											/>
											<div className="flex gap-2 items-center">
												<Button
													variant="outline"
													size="icon"
												>
													<Link2 className="h-4 w-4" />
												</Button>
												<Button
													variant="outline"
													size="icon"
													onClick={() =>
														document.getElementById("file-input")?.click()
													}
												>
													<Paperclip className="h-4 w-4" />
												</Button>
												<Input
													id="file-input"
													type="file"
													multiple
													className="hidden"
													onChange={(e) => {
														if (e.target.files) {
															const files: File[] = Array.from(
																e.target.files
															).slice(0, 5); // Allow max 5 files
															const attachedFiles = [
																...form.getValues("taskFiles"),
																...files,
															].slice(0, 5);
															form.setValue("taskFiles", attachedFiles); // Store in form state
														}
													}}
												/>
											</div>
											{/* Display selected files */}
											{form.watch("taskFiles")?.length > 0 && (
												<div className="mt-2 space-y-1 text-sm text-gray-500">
													{form
														.watch("taskFiles")
														.map((file: File, index: number) => (
															<div
																key={index}
																className="relative flex items-center gap-2 w-fit px-5"
															>
																<Paperclip className="h-4 w-4 text-gray-400" />
																<p>
																	{file.name}
																	<span
																		onClick={() => {
																			form.setValue(
																				"taskFiles",
																				form
																					.getValues("taskFiles")
																					.filter(
																						(stateFile: File) =>
																							stateFile.name !== file.name
																					)
																			);
																		}}
																		className="absolute hover:cursor-pointer hover:text-red-400 -top-3 -right-1 text-red-500"
																	>
																		x
																	</span>
																</p>
															</div>
														))}
												</div>
											)}
										</div>
									</FormControl>
								</FormItem>
							)}
						/>

						<div className="space-y-4">
							<FormField
								control={form.control}
								name="assignees"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Assignee</FormLabel>
										<div className="flex gap-4 items-center">
											<FormControl>
												<Input
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
																onClick={() =>
																	form.setValue("assignees", [
																		...form.getValues("assignees"),
																		assignee._id,
																	])
																}
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
												Task assigneed
											</span>
											{form.watch("assignees").map((assigneeId) =>
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

							<FormField
								control={form.control}
								name="priority"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Priority</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select priority" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{priorities.map((priority) => (
													<SelectItem
														key={priority.id}
														value={priority.name}
													>
														{priority.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{status.map((status) => (
													<SelectItem
														key={status.id}
														value={status.name}
													>
														{status.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<div className="flex flex-wrap gap-2">
											{field.value.length > 0 &&
												field.value.map((tag: string, index: number) => (
													<div
														key={index}
														className="relative flex items-center gap-2 px-2 py-1 rounded-md bg-muted"
													>
														<span>{tag}</span>
														<p
															onClick={() => {
																form.setValue(
																	"tags",
																	field.value.filter((_, i) => i !== index)
																);
															}}
															className=" text-[0.8rem] font-extralight  text-red-500 ml-4 hover:text-red-600 hover:cursor-pointer"
														>
															X
														</p>
													</div>
												))}
										</div>
									</FormControl>
									<Input
										placeholder="Add tag (max 4)"
										disabled={field.value.length >= 4}
										onKeyDown={(e) => {
											if (
												e.key === "Enter" &&
												e.currentTarget.value.trim() !== ""
											) {
												e.preventDefault();
												if (field.value.length < 4) {
													form.setValue("tags", [
														...field.value,
														e.currentTarget.value.trim(),
													]);
													e.currentTarget.value = "";
												}
											}
										}}
									/>
								</FormItem>
							)}
						/>
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

export default NewTaskForm;
