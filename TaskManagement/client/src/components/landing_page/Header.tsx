import { HeaderList } from "@/constants";
import { Link, NavLink } from "react-router";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

const Header = () => {
	return (
		<section className="xl:px-4 py-2 flex items-center justify-between">
			<div className="lg:w-32 w-28  hover:scale-110">
				<Link
					to={`/`}
					className="w-full h-full">
					<img
						style={{ width: "100%", height: "100%" }}
						src="./donezo.svg"
						alt="Donezo logo"
						loading="lazy"
					/>
				</Link>
			</div>
			<ul className="hidden  xl:mx-28   lg:flex lg:items-center lg:justify-between lg:flex-1 lg:px-8  lg:gap-4">
				{HeaderList.map((element, index) => (
					<NavLink
						className={`text-sm`}
						to={element.redirect}
						key={`${element.title}${index}`}>
						<li>{element.title}</li>
					</NavLink>
				))}
			</ul>
			<DropdownMenu>
				<DropdownMenuTrigger className="p-0 bg-none border-none">
					<Menu className="lg:hidden" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="absolute right-0 flex items-start flex-col pl-2 gap-4">
					{HeaderList.map((element) => (
						<DropdownMenuItem key={element.title}>
							<Link to={element.redirect}>{element.title}</Link>
						</DropdownMenuItem>
					))}
					<DropdownMenuItem>
						<Link to={`/login`}>Login</Link>
					</DropdownMenuItem>

					<DropdownMenuItem>
						<Link to={`/signup`}>SignUp</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-4">
				<Link to={`/login`}>
					<Button className="bg-gray-900 text-white outline-primary font-medium hover:bg-gray-900/40 hover:border-none text-xs">
						Log in
					</Button>
				</Link>
				<Link to={`/signup`}>
					<Button className="font-medium text-sm">Sign up</Button>
				</Link>
			</div>
		</section>
	);
};

export default Header;
