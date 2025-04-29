import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Loader } from "lucide-react";
import { useDebounce } from "@/hooks/customs/useDebounce";
import { useLazyGetUsersByEmailQuery } from "@/redux/services/userApi";
import { User } from "@/types/user";
import { toast } from "@/hooks/use-toast";
import { useCreateWorkspace } from "@/hooks/customs/useCreateWorkspace";

const CreateWorkspace = () => {
	const { value: token } = JSON.parse(localStorage.getItem("token")!);
	const [workspaceName, setWorkspaceName] = useState("");
	const [searchEmail, setSearchEmail] = useState<string>("");
	const [getUser] = useLazyGetUsersByEmailQuery();
	const debouncedEmail = useDebounce(searchEmail);
	const [searchedUser, setSearchedUser] = useState<User | null>(null);
	const [members, setMembers] = useState<User[]>([]);

	const { handleCreateWorkpsace, createWorkspaceLoading } =
		useCreateWorkspace();
	const handleGetUser = async () => {
		try {
			const userResponse = await getUser({
				email: debouncedEmail,
				token,
			}).unwrap();
			setSearchedUser(userResponse.data);
		} catch (error: any) {
			toast({
				title: error.data.error,
			});
		}
	};

	const handleAddUser = () => {
		setMembers((prev) => [...prev, searchedUser!]);
		setSearchedUser(null);
		setSearchEmail("");
	};

	const handleWorkspaceCreation = async () => {
		if (workspaceName.length < 1) {
			toast({
				title: "Workspace name required",
				variant: "destructive",
			});
		} else {
			await handleCreateWorkpsace(members, workspaceName);
		}
	};
	useEffect(() => {
		if (
			!members.find((member) => member.email === searchEmail) &&
			searchEmail.length > 12 &&
			searchEmail.match(`^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$`)
		) {
			handleGetUser();
		}
	}, [debouncedEmail]);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-200 p-4">
			<Card className="w-full max-w-md bg-gray-900 border-gray-800">
				<CardHeader>
					<CardTitle className="text-gray-300 text-lg text-center">
						Create Workspace
					</CardTitle>
				</CardHeader>

				<CardContent>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label
								htmlFor="workspace-name"
								className="text-slate-400">
								Workspace Name
							</Label>
							<Input
								id="workspace-name"
								value={workspaceName}
								onChange={(e) => setWorkspaceName(e.target.value)}
								placeholder="Enter workspace name"
								className="bg-gray-800 border-gray-700 text-gray-200"
							/>
						</div>
					</div>
					<div className="space-y-4 mt-4">
						<p className="text-sm text-slate-500">Assign members</p>
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
							<Input
								placeholder="Search by email or name"
								value={searchEmail}
								onChange={(e) => setSearchEmail(e.target.value)}
								className="pl-8 bg-gray-800 border-gray-700 text-gray-200"
							/>
						</div>
						{searchedUser && (
							<div
								key={searchedUser._id}
								className="flex items-start space-x-4 p-3 rounded-lg bg-gray-800/50">
								<Avatar>
									<AvatarImage src={searchedUser.avatar} />
									<AvatarFallback className="bg-gray-700 text-gray-200">
										{searchedUser.username
											? searchedUser.username.charAt(0)
											: searchedUser.email.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 space-y-1">
									<div className="flex justify-between">
										<p className="font-medium text-gray-200">
											{searchedUser.username ||
												searchedUser.email.split("@")[0]}
										</p>
										<Button
											variant="ghost"
											size="icon"
											onClick={handleAddUser}
											className="h-8 w-8 text-gray-400">
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									<p className="text-sm text-gray-400">{searchedUser.email}</p>
								</div>
							</div>
						)}
						<div className="space-y-3">
							<p className="text-sm text-slate-500">Selected members</p>
							{members.length > 0 ? (
								members.map((member: User) => (
									<div
										key={member._id}
										className="flex items-start space-x-4 p-3 rounded-lg bg-gray-800/50">
										<Avatar>
											<AvatarImage
												src={`/placeholder.svg?height=40&width=40`}
											/>
											<AvatarFallback className="bg-gray-700 text-gray-200">
												{member.username
													? member.username.charAt(0)
													: member.email.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 space-y-1">
											<div className="flex justify-between">
												<p className="font-medium text-gray-200">
													{member.username || member.email.split("@")[0]}
												</p>
											</div>
											<p className="text-sm text-gray-400">{member.email}</p>
										</div>
									</div>
								))
							) : (
								<p className="text-center text-sm text-gray-400 py-4">
									No members selected
								</p>
							)}
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between border-t border-gray-800 pt-4">
					<>
						<Button
							variant="ghost"
							className="text-gray-400"
							onClick={() => window.history.back()}>
							Cancel
						</Button>
						<Button onClick={handleWorkspaceCreation}>
							{createWorkspaceLoading ? (
								<Loader className="animate-spin" />
							) : (
								"Create"
							)}
						</Button>
					</>
				</CardFooter>
			</Card>
		</div>
	);
};

export default CreateWorkspace;
