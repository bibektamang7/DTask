import React from "react";
import { Button } from "./ui/button";

interface AlertBoxProps {
	onClose: () => void;
	onDelete: () => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({ onClose, onDelete }) => {
	return (
		<div className="fixed z-20 top-0 left-0 backdrop-blur-sm w-screen h-screen">
			<div className="flex items-center justify-center h-full">
				<div className="flex flex-col items-center justify-center w-1/5 h-1/4 gap-4 bg-black rounded-md">
					<p className="font-semibold text-lg">Are you sure?</p>
					<div className="flex items-center justify-between gap-5">
						<Button onClick={onClose}>Cancel</Button>
						<Button
							onClick={onDelete}
							className="bg-red-500 text-white hover:bg-red-500/80 outline-none border-none"
						>
							Delete
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AlertBox;
