import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

const TaskAssigned = () => {
	return (
		<section>
			<div>
				<div className="px-2">
					<div className="mt-2">
						<div className="flex tex-sm gap-2 mt-2">
							<Avatar className="w-16 h-8">
								<AvatarImage
									src=""
									alt=""
								/>
								<AvatarFallback>B</AvatarFallback>
							</Avatar>
							<div className="flex items-start gap-1 flex-col justify-center">
								<p className="text-[0.7rem] tracking-tight [&>span]:font-semibold font-light">
									<span>Bibek Tamang </span>assigned task{" "}
									<span>"Design Homepage Wireframe"</span> to{" "}
									<span>Bipin Tamang</span> 
								</p>
								<span className="text-[0.6rem]">10:45AM</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TaskAssigned;
