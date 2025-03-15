import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Notification } from "@/types/task";
import { WorkspaceMember } from "@/types/workspace";
import React from "react";
interface ActivityWidgetProps {
	activities: Notification[];
	fallbackMessage: string;
	assignees: WorkspaceMember[];
	filterPurpose?: string;
	currentUser?: string;
}

const ActivityWidget: React.FC<ActivityWidgetProps> = ({
	activities,
	fallbackMessage,
	assignees,
	currentUser,
	filterPurpose,
}) => {
	return (
		<div className="mt-2">
			{activities.length > 0 ? (
				activities.map((activityElement: Notification) => {
					if (filterPurpose && filterPurpose !== activityElement.purpose)
						return null;
					const assignee = assignees.find((assignee) =>
						currentUser
							? assignee.user._id === activityElement.sender &&
							  assignee.user._id === currentUser
							: assignee.user._id === activityElement.sender
					);

					if (!assignee) return null; // Skip if no matching assignee is found

					return (
						<div
							className="flex tex-sm gap-2 mt-4"
							key={activityElement._id}
						>
							<Avatar className="w-8 h-8">
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
									<span>{assignee.user.username} </span>
									{(activityElement.purpose === "TASK_DESCRIPTION")
										? activityElement.message.replace(
												"_",
												activityElement.metadata.taskTitle
										  )
										: activityElement.message}{" "}
									{activityElement.purpose === "PRIORITY" ||
									activityElement.purpose === "STATUS" ? (
										<>
											from <span>{activityElement.metadata.from}</span> to{" "}
											<span>{activityElement.metadata.to}</span>.
										</>
									) : (
										<span>{activityElement.metadata.taskTitle}.</span>
									)}
								</p>
								<span className="text-[0.7rem]">
									{new Date(activityElement.createdAt).toDateString()}
								</span>
							</div>
						</div>
					);
				})
			) : (
				<div className="h-16 bg-muted rounded-lg flex items-center justify-center">
					<p className="text-center text-sm">{fallbackMessage}.</p>
				</div>
			)}
		</div>
	);
};

export default ActivityWidget;
