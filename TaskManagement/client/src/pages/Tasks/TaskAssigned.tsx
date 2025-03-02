import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/redux/store";
import { Notification } from "@/types/task";
import { WorkspaceMember } from "@/types/workspace";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
interface TaskAssignedProps {
	todaysActivities: Notification[];
	yesterdaysActivities: Notification[];
	pastsActivities: Notification[];
}
const TaskAssigned: React.FC<TaskAssignedProps> = ({
	todaysActivities,
	yesterdaysActivities,
	pastsActivities,
}) => {
	const [todaysActivity, setTodaysActivity] = useState<Notification[]>([]);
	const assignees = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);
	useEffect(() => {
		const filteredTaskAssignedActivity = todaysActivities.filter(
			(activity) => activity.purpose === "TASK_ASSIGEND"
		);
		setTodaysActivity(filteredTaskAssignedActivity);
	}, []);
	return (
		<section>
			<div className="flex flex-col gap-6">
				<div className="px-2">
					<strong className="text-sm">Today</strong>
					<div className="mt-2">
						{todaysActivity.length > 0 ? (
							todaysActivity.map((activityElement: Notification) => {
								return assignees.map((assignee: WorkspaceMember) => {
									if (assignee._id === activityElement.sender) {
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
					<strong className="text-sm">Yesterday</strong>
					<div className="mt-2">
						{yesterdaysActivities.length > 0 ? (
							yesterdaysActivities.map((activity: Notification) => (
								<div className="flex tex-sm gap-2 mt-2">
									<Avatar className="w-16 h-8">
										<AvatarImage
											src=""
											alt=""
										/>
										<AvatarFallback>B</AvatarFallback>
									</Avatar>
									<div className="flex items-start gap-1 flex-col justify-center">
										<p className="text-[0.7rem] tracking-tight [&>span]:font-semibold font-light">
											<span>Bibek Tamang </span>changed the status of{" "}
											<span>"Design Homepage Wireframe"</span> from{" "}
											<span>Todo</span> to <span>In-Progress</span>
										</p>
										<span className="text-[0.7rem]">10:45AM</span>
									</div>
								</div>
							))
						) : (
							<div className="h-16 bg-muted rounded-lg flex items-center justify-center">
								<p className="text-center text-sm">No activites yesterday.</p>
							</div>
						)}
					</div>
				</div>
				<div className="px-2">
					<strong className="text-sm">Past</strong>
					<div className="mt-2">
						{pastsActivities.length > 0 ? (
							pastsActivities.map((activity: any) => (
								<div className="flex tex-sm gap-2 mt-2">
									<Avatar className="w-16 h-8">
										<AvatarImage
											src=""
											alt=""
										/>
										<AvatarFallback>B</AvatarFallback>
									</Avatar>
									<div className="flex items-start gap-1 flex-col justify-center">
										<p className="text-[0.7rem] tracking-tight [&>span]:font-semibold font-light">
											<span>Bibek Tamang </span>changed the status of{" "}
											<span>"Design Homepage Wireframe"</span> from{" "}
											<span>Todo</span> to <span>In-Progress</span>
										</p>
										<span className="text-[0.7rem]">10:45AM</span>
									</div>
								</div>
							))
						) : (
							<div className="h-16 bg-muted rounded-lg flex items-center justify-center">
								<p className="text-center text-sm">No activites in the past.</p>
							</div>
						)}
					</div>
				</div>
			</div>
			{/* <div>
				<div className="px-2">
					<div className="mt-2">
						<div className="flex tex-sm gap-2 mt-2">
							<Avatar className="w-16 h-8">
								<AvatarImage
									src=""
									alt=""
								/>
								<AvatarFallback>B</AvatarFallback>
							</Avatar>
							<div className="flex items-start gap-1 flex-col justify-center">
								<p className="text-[0.7rem] tracking-tight [&>span]:font-semibold font-light">
									<span>Bibek Tamang </span>assigned task{" "}
									<span>"Design Homepage Wireframe"</span> to{" "}
									<span>Bipin Tamang</span>
								</p>
								<span className="text-[0.6rem]">10:45AM</span>
							</div>
						</div>
					</div>
				</div>
			</div> */}
		</section>
	);
};

export default TaskAssigned;
