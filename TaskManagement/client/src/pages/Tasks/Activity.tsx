import ActivityWidget from "@/hooks/customs/Tasks/ActivityWidget";
import { Notification } from "@/types/task";
import React, { useEffect, useState } from "react";
interface ActivityProps {
	todaysActivities: Notification[];
	yesterdaysActivities: Notification[];
	pastsActivities: Notification[];
}
const Activity: React.FC<ActivityProps> = ({
	todaysActivities,
	yesterdaysActivities,
	pastsActivities,
}) => {
	const [_, setTodaysActivity] = useState<Notification[]>([]);
	const assignees = JSON.parse(localStorage.getItem("workspaceMembers")!);
	useEffect(() => {
		setTodaysActivity(todaysActivities);
	}, []);
	return (
		<section>
			<div className="flex flex-col gap-6">
				<div className="px-2">
					<strong className="text-sm">Today</strong>
					<ActivityWidget
						activities={todaysActivities}
						fallbackMessage="No activites today yet"
						assignees={assignees}
					/>
				</div>
				<div className="px-2">
					<strong className="text-sm">Yesterday</strong>
					<ActivityWidget
						activities={yesterdaysActivities}
						assignees={assignees}
						fallbackMessage="No activities yesterday"
					/>
				</div>
				<div className="px-2">
					<strong className="text-sm">Past</strong>
					<ActivityWidget
						activities={pastsActivities}
						assignees={assignees}
						fallbackMessage="No past activites"
					/>
				</div>
			</div>
		</section>
	);
};

export default Activity;
