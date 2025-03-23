import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { WorkspaceMember } from "@/types/workspace";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { PhoneCall, X } from "lucide-react";
import React, { useMemo } from "react";

interface IncomingCallProps {
	callDetails: {
		callType: string;
		callFrom: string;
		chatId: string;
	};
	onAccept: () => void;
	onDecline: () => void;
}

const IncomingCall: React.FC<IncomingCallProps> = React.memo(
	({ callDetails, onAccept, onDecline }) => {
		console.log(callDetails, "tis in incoming call");
		const callFrom = callDetails.callFrom;
		const workpsaceMembers = JSON.parse(
			localStorage.getItem("workspaceMembers")!
		);

		const callerUser = workpsaceMembers.find(
			(member: WorkspaceMember) => member.user._id === callFrom
		);

		return (
			<div className="fixed top-0 left-0 w-full h-full backdrop-blur-md z-10 overflow-y-auto py-16">
				<div className="relative w-full h-full max-w-sm mx-auto space-y-6 bg-background text-foreground rounded-lg">
					<div className="flex flex-col py-28 items-center justify-between w-full h-full">
						<div className="flex items-center gap-4 justify-center flex-col">
							<Avatar className="bg-slate-500 w-12 h-12">
								<AvatarImage src={callerUser.user.avatar} />
								<AvatarFallback className="m-auto">
									{callerUser.user.username.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<p className="text-gray-200 tracking-tighter font-semibold ">
								{callerUser.user.username} wants you to join the call.
							</p>
						</div>
						<div className=" flex items-center justify-center w-full lg:gap-32">
							<div
								onClick={onDecline}
								className="p-3 bg-red-500 rounded-full hover:cursor-pointer"
							>
								<X size={20} />
							</div>
							<div
								onClick={onAccept}
								className="p-3 bg-green-500 text-gray-100 rounded-full hover:cursor-pointer"
							>
								<PhoneCall size={20} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

export default IncomingCall;
