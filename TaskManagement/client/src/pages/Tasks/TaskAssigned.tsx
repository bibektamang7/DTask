import ActivityWidget from "@/hooks/customs/Tasks/ActivityWidget";
import { RootState } from "@/redux/store";
import { Notification } from "@/types/task";
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
					<ActivityWidget
						assignees={assignees}
						fallbackMessage="No assigned today yet"
						activities={todaysActivity}
					/>
				</div>
				<div className="px-2">
					<strong className="text-sm">Yesterday</strong>
					<ActivityWidget
						assignees={assignees}
						fallbackMessage="No yesterday assigned"
						activities={yesterdaysActivities}
						filterPurpose="TASK_ASSIGNED"
					/>
				</div>
				<div className="px-2">
					<strong className="text-sm">Past</strong>
					<ActivityWidget
						assignees={assignees}
						fallbackMessage="No past assigned"
						activities={pastsActivities}
						filterPurpose="TASK_ASSIGNED"
					/>
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
