import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAcceptInvitation } from "@/hooks/customs/workspace/useNotification";
import { cn } from "@/lib/utils";
import { Notification as NotificationSchema } from "@/types/task";
import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

const Notification = () => {
	const notificationsData = useLoaderData();
	const [notifications, setNotifications] = useState([]);
	const { handleAcceptInvitation, acceptInvitaionLoading } =
		useAcceptInvitation();
	const handleDeclineInvitation = () => {};

	useEffect(() => {
		setNotifications(notificationsData);
	}, []);
	return (
		<section className="mt-6">
			<h2 className="text-2xl font-medium ml-4">Notifications</h2>
			<div className="mt-8 px-4">
				{notifications.length > 0 ? (
					notifications.map((notification: any) => (
						<div className="flex items-center justify-between">
							<div className="flex gap-4 mt-2">
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
									<p className="text-[1rem] tracking-tight [&>span]:font-semibold font-light">
										<span>{notification.sender.username} </span>
										{notification.message}{" "}
										<span>{notification.reference.name}</span>
										{notification.purpose === "STATUS" && (
											<span>f rom Todo to In-Progress</span>
										)}
									</p>
									<span className="text-[0.7rem]">
										{new Date(notification.createdAt).toDateString()}
									</span>
								</div>
							</div>
							{notification.purpose === "INVITE" && (
								<div className="flex gap-4">
									<Button
										onClick={handleDeclineInvitation}
										className=" bg-red-500 text-white/70"
									>
										Decline
									</Button>
									<Button
										onClick={() => handleAcceptInvitation(notification._id)}
										className={cn(acceptInvitaionLoading ? "bg-red-400" : "")}
									>
										Accept
									</Button>
								</div>
							)}
						</div>
					))
				) : (
					<div className="flex items-center justify-center text-sm">
						No notification yet.
					</div>
				)}
			</div>
		</section>
	);
};

export default Notification;
