import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAddAssignee } from "@/hooks/customs/Tasks/useAddAssignee";
import { RootState } from "@/redux/store";
import { WorkspaceMember } from "@/types/workspace";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface AddAssigneeProps {
	taskId: string;
	assignedMembers: string[];
	onClose: () => void;
	setAssignees: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddAssignee: React.FC<AddAssigneeProps> = ({
	taskId,
	assignedMembers,
	onClose,
	setAssignees,
}) => {
	const workspaceMembers = useSelector(
		(state: RootState) => state.Workspaces.workspace.members
	).filter((member) => !assignedMembers.find((user) => user === member._id));

	const [assignee, setAssignee] = useState("");
	const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(
		null
	);

	const { handleAddAssigneeInTask, addAssigneeLoading } = useAddAssignee();
	const handleTaskAssign = async () => {
		if (selectedMember) {
			const response = await handleAddAssigneeInTask(
				taskId,
				selectedMember?._id
			);
			if (response.success) {
				setAssignees((prev) => [...prev, selectedMember._id]);
				onClose();
			}
		}
	};

	return (
		<div className="fixed z-20 top-0 left-0 backdrop-blur-sm w-screen h-screen">
			<div className="flex items-center justify-center h-full">
				<Card>
					<CardHeader>Add Assignee</CardHeader>
					<CardContent>
						<Input
							value={assignee}
							onChange={(e) => setAssignee(e.target.value)}
							placeholder="Enter assignee email or username"
						/>
						<div className="flex flex-col justify-center gap-2 mt-2">
							{assignee.length > 0 &&
								workspaceMembers.map(
									(member) =>
										(member.user.username.startsWith(assignee) ||
											member.user.email.startsWith(assignee)) && (
											<div
												onClick={() => {
													setSelectedMember(member);
													setAssignee("");
												}}
												key={member._id}
												className="flex items-center justify-start gap-2 hover:cursor-pointer"
											>
												<Avatar>
													<AvatarImage
														src={member.user.avatar}
														alt={member.user.username}
													/>
													<AvatarFallback>
														{member.user.username.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<p>{member.user.username}</p>
											</div>
										)
								)}
						</div>

						{selectedMember && (
							<div className="mt-4">
								<p className="text-xs text-gray-400">Selected Member</p>
								<div
									key={selectedMember._id}
									className="mt-2 flex items-center justify-start gap-2"
								>
									<Avatar>
										<AvatarImage
											src={selectedMember.user.avatar}
											alt={selectedMember.user.username}
										/>
										<AvatarFallback>
											{selectedMember.user.username.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<p>{selectedMember.user.username}</p>
								</div>
							</div>
						)}
					</CardContent>
					<CardFooter className="flex items-center justify-between">
						<Button
							onClick={onClose}
							className="text-xs hover:cursor-pointer"
						>
							Cancel
						</Button>
						<Button
							className="text-xs"
							onClick={() => handleTaskAssign()}
							disabled={!selectedMember}
						>
							{addAssigneeLoading ? <Loader /> : "Assign"}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default AddAssignee;
