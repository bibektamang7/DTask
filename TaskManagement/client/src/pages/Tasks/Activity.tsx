import { AvatarFallback } from "@/components/ui/avatar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

const Activity = () => {
	return <section>
    <div>
      <div className="px-2">
        <strong className="text-sm">Today</strong>
        <div className="mt-2">
          <div className="flex tex-sm gap-2 mt-2">
            <Avatar className="w-16 h-8">
              <AvatarImage src="" alt=""/>
              <AvatarFallback>
                B
              </AvatarFallback>
            </Avatar>
            <div className="flex items-start gap-1 flex-col justify-center">
              <p className="text-[0.7rem] tracking-tight [&>span]:font-semibold font-light"><span>Bibek Tamang </span>changed the status of <span>"Design Homepage Wireframe"</span> from <span>Todo</span> to <span>In-Progress</span></p>
              <span className="text-[0.7rem]">10:45AM</span>
            </div>
          </div>
          <div className="flex tex-sm gap-2 mt-2">
            <Avatar className="w-16 h-8">
              <AvatarImage src="" alt=""/>
              <AvatarFallback>
                B
              </AvatarFallback>
            </Avatar>
            <div className="flex items-start gap-1 flex-col justify-center">
              <p className="text-[0.7rem] tracking-tight [&>span]:font-semibold font-light"><span>Bibek Tamang </span>changed the status of <span>"Design Homepage Wireframe"</span> from <span>Todo</span> to <span>In-Progress</span></p>
              <span className="text-[0.7rem]">10:45AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
};

export default Activity;
