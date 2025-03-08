import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Notification as NotificationSchema } from "@/types/task";
import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

const Notification = () => {
	const notificationsData = useLoaderData();
	const [notifications, setNotifications] = useState([]);
	useEffect(() => {
		setNotifications(notificationsData);
	}, []);
	return (
		<>
			{notifications.length > 0 ? (
				notifications.map((notification: any) => (
					<div className="flex tex-sm gap-2 mt-2">
						<Avatar className="w-16 h-8">
							<AvatarImage
								src={notification.sender.avatar}
								alt={notification.sender.username}
							/>
							<AvatarFallback>
								{notification.sender.username.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className="flex items-start gap-1 flex-col justify-center">
							<p className="text-[0.7rem] tracking-tight [&>span]:font-semibold font-light">
								<span>{notification.sender.username} </span>
								{notification.message}{" "}
								<span>{notification.reference.name}</span>
								{notification.purpose === "STATUS" && (
									<span>f rom Todo to In-Progress</span>
								)}
							</p>
							{/* <span className="text-[0.7rem]">
					{new Date(activityElement.createdAt).toDateString()}
				</span> */}
						</div>
					</div>
				))
			) : (
				<div>No notification yet.</div>
			)}
		</>
	);
};

export default Notification;
