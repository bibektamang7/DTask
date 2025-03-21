import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ActivityWidget from "@/hooks/customs/Tasks/ActivityWidget";
import { RootState } from "@/redux/store";
import { Comment, Notification } from "@/types/task";
import { WorkspaceMember } from "@/types/workspace";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Ellipsis } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface MyWorkProps {
	activities: Notification[];
	comments: Comment[];
}

const MyWork: React.FC<MyWorkProps> = ({ activities, comments }) => {
	const [myActivities, setMyActivities] = useState<Notification[]>([]);
	const [myComments, setMyComments] = useState<Comment[]>([]);
	const assignees = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);
	const currentUserId = localStorage.getItem("currentUser");
	useEffect(() => {
		// const fileterComments = comments.filter(comment => comment.createdBy === )
		setMyActivities(activities);
		setMyComments(comments);
	}, []);

	return (
		<section>
			<div className="flex flex-col gap-6">
				<div className="px-2">
					<strong className="text-sm">Activity</strong>
					<ActivityWidget
						activities={activities}
						fallbackMessage="No "
						currentUser={currentUserId!}
						assignees={assignees}
					/>
				</div>
				<div className="px-2">
					<strong className="text-sm">Comments</strong>
					<div className="mt-2">
						{myComments.length > 0 ? (
							myComments.map((comment) =>
								assignees.map((assignee: WorkspaceMember) => {
									if (
										assignee._id === comment.createdBy &&
										currentUserId === assignee.user._id
									) {
										return (
											<div
												className="mt-4"
												key={comment._id}
											>
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
															<Ellipsis size={16} />
														</div>
														<p className="text-[0.7rem] text-light tracking-tight">
															{comment.message}
														</p>
														{comment.attachments && (
															<div>
																{comment.attachments.map((attachment) => (
																	<div
																		className="w-24 h-24"
																		key={attachment._id}
																	>
																		<img
																			src={attachment.fileUrl}
																			alt={attachment._id}
																			className="w-full h-full object-cover"
																		/>
																	</div>
																))}
															</div>
														)}
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
			</div>
		</section>
	);
};

export default MyWork;
