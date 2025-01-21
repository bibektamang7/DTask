import React from "react";
import { HeaderList } from "@/constants";
import { NavLink } from "react-router";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <div className="lg:mx-52 px-4 py-2 flex items-center justify-between">
      <div className="w-24 h-10">
        <img
          style={{ width: "100%", height: "100%" }}
          src="./donezo.svg"
          alt="Donezo logo"
        />{" "}
        {/* TODO:Lazy load this image */}
      </div>
      <ul className="hidden lg:flex lg:items-center lg:justify-between lg:flex-1 lg:mx-28">
        {HeaderList.map((element, index) => (
          <NavLink
            to={element.redirect}
            key={`${element.title}${index}`}
          >
            <li>{element.title}</li>
          </NavLink>
        ))}
      </ul>
      <Menu className="lg:hidden" />
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-4">
        <Button className="bg-gray-900 hover:bg-primary outline-primary font-medium">Log in</Button>
        <Button className="hover:bg-gray-900 font-medium">Sign up</Button>
      </div>
    </div>
  );
};

export default Header;
