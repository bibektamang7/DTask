import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CloudUpload } from "lucide-react";
import { useEffect, useState } from "react";
import { useAddAttachments } from "@/hooks/customs/Tasks/useAddAttachments";

interface AddAttachmentProps {
	onClose: () => void;
	taskId: string;
}

const AddAttachment: React.FC<AddAttachmentProps> = ({ onClose, taskId }) => {
	const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);

	const { handleAddAttachments, addAttachmentsLoading } = useAddAttachments();
	const handleUploadAttachments = async () => {
		const formData = new FormData();
		if (attachmentFiles.length > 0) {
			attachmentFiles.forEach((file) => formData.append("taskFiles", file));
		}
		const response = await handleAddAttachments(formData, taskId);
		if (response.status) {
			onClose();
			setAttachmentFiles([]);
		}
	};

	useEffect(() => {
		return () => {
			attachmentFiles.forEach((file) => URL.revokeObjectURL(String(file)));
		};
	}, [attachmentFiles]);
	return (
		<div className="fixed z-20 top-0 left-0 backdrop-blur-md w-screen h-screen">
			<div className="flex items-center justify-center h-full">
				<Card>
					<CardHeader>
						<CardTitle>Add Attachments</CardTitle>
						<CardDescription>
							Select and upload the files of your choice
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid w-full items-center gap-4">
							{attachmentFiles.length > 0 && (
								<div className="flex items-center gap-4">
									{attachmentFiles.length > 0 &&
										attachmentFiles.map((file) => (
											<div
												key={file.name}
												className="relative w-16 h-12"
											>
												<span
													onClick={() =>
														setAttachmentFiles((prev) =>
															prev.filter(
																(selectedFile) =>
																	selectedFile.name !== file.name
															)
														)
													}
													className="absolute right-0 -top-2 text-xs hover:cursor-pointer hover:scale-110"
												>
													x
												</span>
												<img
													src={URL.createObjectURL(file)}
													className="w-full h-full object-cover"
												/>
											</div>
										))}
								</div>
							)}
							<div className="p-4 flex flex-col items-center justify-center border-2 border-dashed rounded-md gap-4">
								<CloudUpload />
								<p className="text-sm text-gray-400">
									Choose a file or drag & drop it here
								</p>
								<Button
									onClick={() => {
										document.getElementById("addAttachmentInput")?.click();
									}}
								>
									Browse File
								</Button>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Input
									id="addAttachmentInput"
									className="hidden"
									type="file"
									accept=".pdf, .jpg, .jpeg, .doc, .docx, .xml"
									onChange={(e) =>
										setAttachmentFiles((prev) => [
											...prev,
											...Array.from(e.target.files || []),
										])
									}
									multiple
									max={5}
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button
							variant="outline"
							onClick={() => onClose()}
						>
							Cancel
						</Button>
						<Button onClick={() => handleUploadAttachments()}>
							{addAttachmentsLoading ? <Loader /> : "Upload"}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default AddAttachment;
