import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/redux/store";
import { Comment as CommentSchema } from "@/types/task";
import { WorkspaceMember } from "@/types/workspace";
import { Ellipsis, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface CommentProps {
	comments: CommentSchema[];
}
const Comment: React.FC<CommentProps> = ({ comments }) => {
	const [taskComments, setTaskComments] = useState<CommentSchema[]>([]);
	const assignees = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);
	useEffect(() => {
		setTaskComments(comments);
	}, []);
	return (
		<section>
			<div>
				<div className="px-2">
					{taskComments.length > 0 ? (
						taskComments.map((comment) =>
							assignees.map((assignee: WorkspaceMember) => {
								if (assignee._id === comment.createdBy) {
									return (
										<div className="mt-4">
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
												<div className="flex items-start gap-1 flex-col justify-center pr-2">
													<div className="flex items-center justify-between w-full">
														<div className="flex items-center justify-center gap-2">
															<strong className="text-[0.8rem] font-semibold">
																{assignee.user.username}
															</strong>
															<span className="text-[0.7rem] font-light">
																{new Date(comment.createdAt).toDateString()}
															</span>
														</div>
														<Ellipsis size={16} />
													</div>
													<p className="text-[0.7rem] text-light tracking-tight">
														{comment.message}
													</p>
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
			</div>
		</section>
	);
};

export default Comment;
