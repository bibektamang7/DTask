import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  const currentUserId = useSelector((state: RootState) => state.Users.user._id)

	useEffect(() => {
		setMyActivities(activities);
		setMyComments(comments);
	}, []);

	return (
		<section>
			<div className="flex flex-col gap-6">
				<div className="px-2">
					<strong className="text-sm">Activity</strong>
					<div className="mt-2">
						{myActivities.length > 0 ? (
							myActivities.map((activityElement: Notification) => {
								return assignees.map((assignee: WorkspaceMember) => {
									if (assignee._id === activityElement.sender && assignee.user._id === currentUserId) {
										return (
											<div className="flex tex-sm gap-2 mt-2">
												<Avatar className="w-16 h-8">
													<AvatarImage
														src={assignee.user.avatar}
														alt={assignee.user.username}
													/>
													<AvatarFallback>
														{assignee.user.username.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div className="flex items-start gap-1 flex-col justify-center">
													<p className="text-[0.7rem] tracking-tight [&>span]:font-semibold font-light">
														<span>{assignee.user.username} </span>changed the
														status of <span>"Design Homepage Wireframe"</span>{" "}
														from <span>Todo</span> to <span>In-Progress</span>
													</p>
													<span className="text-[0.7rem]">
														{new Date(activityElement.createdAt).toDateString()}
													</span>
												</div>
											</div>
										);
									}
								});
							})
						) : (
							<div className="h-16 bg-muted rounded-lg flex items-center justify-center">
								<p className="text-center text-sm">No activites today yet.</p>
							</div>
						)}
					</div>
				</div>
				<div className="px-2">
					<strong className="text-sm">Comments</strong>
					<div className="mt-2">
						{myComments.length > 0 ? (
							myComments.map((comment) =>
								assignees.map((assignee: WorkspaceMember) => {
									if (assignee._id === comment.createdBy && currentUserId === assignee.user._id) {
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
