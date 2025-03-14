import React, { useState, useEffect } from "react";
import { Attachment } from "@/types/task";

interface ShowOpenedAttachmentProps {
	onClose: () => void;
	attachment: Attachment;
}

const ShowOpenedAttachment: React.FC<ShowOpenedAttachmentProps> = ({
	attachment,
	onClose,
}) => {
	const [scale, setScale] = useState(1);

	// Prevent page zooming when the modal is open
	useEffect(() => {
		const preventZoom = (event: WheelEvent) => {
			if (event.ctrlKey) {
				event.preventDefault();
			}
		};

		document.addEventListener("wheel", preventZoom, { passive: false });

		return () => {
			document.removeEventListener("wheel", preventZoom);
		};
	}, []);

	// Handle zoom within the modal only
	const handleWheel = (event: React.WheelEvent) => {
		if (event.ctrlKey) {
			event.preventDefault();
			setScale((prev) => Math.min(3, Math.max(1, prev + event.deltaY * -0.01))); // Zoom range: 1x - 3x
		}
	};

	return (
		<section
			className="fixed z-20 top-0 left-0 backdrop-blur-md w-screen h-screen flex items-center justify-center"
			onWheel={handleWheel} // Capture zoom events
		>
			<div className="relative">
				<img
					src={attachment.fileUrl}
					style={{
						transform: `scale(${scale})`,
						transition: "transform 0.2s ease-in-out",
					}}
					className="max-w-full max-h-full object-contain"
				/>
				<span
					onClick={onClose}
					className="hover:cursor-pointer fixed top-4 right-4 text-lg text-gray-200"
				>
					X
				</span>
			</div>
		</section>
	);
};

export default ShowOpenedAttachment;
