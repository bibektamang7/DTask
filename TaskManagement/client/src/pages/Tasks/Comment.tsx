import AlertBox from "@/components/AlertBox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDeleteComment } from "@/hooks/customs/Tasks/useDeleteComment";
import { useMakeComment } from "@/hooks/customs/Tasks/useMakeComment";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { Comment as CommentSchema } from "@/types/task";
import { WorkspaceMember } from "@/types/workspace";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Ellipsis, SendHorizonal, Image, Pencil, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface CommentProps {
	comments: CommentSchema[];
	taskId: string;
}
const Comment: React.FC<CommentProps> = ({ comments, taskId }) => {
	const currentUserId = localStorage.getItem("currentUser");
	const [taskComments, setTaskComments] = useState<CommentSchema[]>([]);
	const [commentFiles, setCommentFiles] = useState<File[]>([]);
	const [commentText, setCommentText] = useState<string>("");
	const [deletingComment, setDeletingComment] = useState<CommentSchema | null>(
		null
	);

	const { handleMakeComment } = useMakeComment();
	const { handleDeleteComment } = useDeleteComment();
	const handleSendCommnet = async () => {
		const formData = new FormData();
		if (commentText.length < 1 && commentFiles.length < 1) return;
		formData.append("message", commentText);
		if (commentFiles.length > 0) {
			commentFiles.forEach((file) => formData.append("commentImage", file));
		}
		const response = await handleMakeComment(taskId, formData);
		if (response.success) {
			setTaskComments((prev) => [...prev, response.data]);
		}
	};

	const assignees = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);

	const handleCommentDelete = async () => {
		const response = await handleDeleteComment(
			deletingComment?._id!,
			deletingComment?.taskId!
		);
		if (response.success) {
			setTaskComments((prev) =>
				prev.filter((comment) => comment._id !== deletingComment?._id)
			);
			setDeletingComment(null);
		}
	};
	useEffect(() => {
		setTaskComments(comments);
	}, [comments]);

	return (
		<>
			{deletingComment && (
				<AlertBox
					onClose={() => setDeletingComment(null)}
					onDelete={() => handleCommentDelete()}
				/>
			)}
			<section>
				<div>
					<div className="px-2">
						{taskComments.length > 0 ? (
							taskComments.map((comment) =>
								assignees.map((assignee: WorkspaceMember) => {
									if (assignee._id === comment.createdBy) {
										return (
											<div
												className="mt-4"
												key={comment._id}>
												<div className="flex text-sm gap-2 mt-2">
													<Avatar className="w-16 h-8">
														<AvatarImage
															src={assignee.user.avatar}
															alt={assignee.user.username}
														/>
														<AvatarFallback>
															{assignee.user.username.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<div className="flex flex-1 items-start gap-1 flex-col justify-center pr-2">
														<div className="flex items-center justify-between w-full">
															<div className="flex items-center justify-between gap-2">
																<strong className="text-[0.9rem] font-semibold">
																	{assignee.user.username}
																</strong>
																<span className="text-[0.7rem] font-light">
																	{new Date(comment.createdAt).toDateString()}
																</span>
															</div>
															{assignee.user._id === currentUserId && (
																<DropdownMenu>
																	<DropdownMenuTrigger className="p-0 bg-inherit">
																		<Ellipsis size={16} />
																	</DropdownMenuTrigger>
																	<DropdownMenuContent className="w-12 relative right-4">
																		<DropdownMenuItem className="text-[0.7rem] text-gray-300 hover:text-inherit">
																			<Pencil />
																			Profile
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			onClick={(e) => {
																				e.stopPropagation();
																				setDeletingComment(comment);
																			}}
																			className="text-[0.7rem] text-gray-300 hover:text-inherit">
																			<Trash />
																			Delete
																		</DropdownMenuItem>
																	</DropdownMenuContent>
																</DropdownMenu>
															)}
														</div>
														<p className="text-[0.7rem] text-light tracking-tight">
															{comment.message}
														</p>
														{comment.attachments && (
															<div>
																{comment.attachments.map((attachment) => (
																	<div
																		className="w-24 h-24"
																		key={attachment._id}>
																		<img
																			src={attachment.fileUrl}
																			alt={attachment._id}
																			className="w-full h-full object-cover"
																		/>
																	</div>
																))}
															</div>
														)}
														{/* TODO:THIS SECTION FOR FUTURE IMPLEMENTATION */}
														{/* <div className="flex justify-between items-center"> */}
														{/* <div className="flex items-center justify-center gap-4">
                  </div> */}
														{/* <div className="flex items-center justify-center gap-2">
                    <ThumbsUp size={16}/>
                    <span>0</span>
                  </div> */}
														{/* </div> */}
													</div>
												</div>
											</div>
										);
									}
								})
							)
						) : (
							<div className="h-16 bg-muted rounded-lg flex items-center justify-center">
								<p className="text-center text-sm">
									No comments in the task yet.
								</p>
							</div>
						)}
					</div>
					<div className="px-4 mt-4">
						{commentFiles.length > 0 && (
							<div className="flex items-center gap-4">
								{commentFiles.length > 0 &&
									commentFiles.map((file) => (
										<div
											key={file.name}
											className="relative w-16 h-12 rounded-md">
											<span
												onClick={() =>
													setCommentFiles((prev) =>
														prev.filter(
															(selectedFile) => selectedFile.name !== file.name
														)
													)
												}
												className="absolute right-0 -top-2 text-xs hover:cursor-pointer hover:scale-110">
												x
											</span>
											<img
												src={URL.createObjectURL(file)}
												className="w-full h-full object-cover"
											/>
										</div>
									))}
							</div>
						)}
						<div className="mt-4 px-4 flex items-center gap-2">
							<Image
								onClick={() =>
									document.getElementById("commentFileInput")?.click()
								}
								className="text-gray-400 hover:cursor-pointer hover:text-inherit"
								size={18}
							/>
							<Input
								placeholder="make comment"
								className="flex-1"
								onChange={(e) => setCommentText(e.target.value)}
							/>
							<SendHorizonal
								onClick={() => handleSendCommnet()}
								size={18}
								className={cn(
									"text-gray-400 ",
									commentText.length > 0 || commentFiles.length > 0
										? "hover:cursor-pointer hover:text-inherit"
										: ""
								)}
							/>
							<Input
								id="commentFileInput"
								type="file"
								className="hidden"
								multiple
								max={3}
								onChange={(e) =>
									setCommentFiles((prev) => [
										...prev,
										...Array.from(e.target.files || []),
									])
								}
								accept=".jpeg, .jpg, .pdf, .doc, .docx"
							/>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Comment;
