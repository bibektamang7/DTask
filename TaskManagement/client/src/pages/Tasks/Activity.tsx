import { AvatarFallback } from "@/components/ui/avatar";
import ActivityWidget from "@/hooks/customs/Tasks/ActivityWidget";
import { RootState } from "@/redux/store";
import { Notification } from "@/types/task";
import { WorkspaceMember } from "@/types/workspace";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
	const [todaysActivity, setTodaysActivity] = useState<Notification[]>([]);
	const assignees = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	);

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
