import React from "react";
import { HeaderList } from "@/constants";
import { NavLink } from "react-router";

const Header = () => {
  return (
    <div className="w-full h-6 bg-red-400">
      <ul className="flex">
      {HeaderList.map((element, index) => (
        <NavLink to={element.redirect} key={`${element.title}${index}`}>
          <li>{element.title}</li>
        </NavLink>
      ))}
    </ul>
    </div>
  );
};

export default Header;
