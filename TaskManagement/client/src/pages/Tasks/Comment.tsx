import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ellipsis, ThumbsUp } from "lucide-react";
import React from "react";

const Comment = () => {
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
							<div className="flex items-start gap-1 flex-col justify-center pr-2">
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center justify-center gap-2">
										<strong className="text-[0.8rem] font-semibold">
											Bibek Tamang
										</strong>
										<span className="text-[0.7rem] font-light">
											10 minutes ago
										</span>
									</div>
									<Ellipsis size={16} />
								</div>
								<p className="text-[0.7rem] text-light tracking-tight">
									Hi billy, I also think you are the best match for this
									position. Good luck.
								</p>
								{/* TODO:THIS SECTION FOR FUTURE IMPLEMENTATION */}
								{/* <div className="flex justify-between items-center"> */}
								{/* <div className="flex items-center justify-center gap-4">
                  </div> */}
								{/* <div className="flex items-center justify-center gap-2">
                    <ThumbsUp size={16}/>
                    <span>0</span>
                  </div> */}
								{/* </div> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Comment;
