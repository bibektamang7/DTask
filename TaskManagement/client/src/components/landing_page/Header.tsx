import { HeaderList } from "@/constants";
import { Link, NavLink } from "react-router";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

const Header = () => {
	return (
		<div className="px-4 py-2 flex items-center justify-between">
			{/* <div className="w-24 h-10">
				<img
					style={{ width: "100%", height: "100%" }}
					src="./donezo.svg"
					alt="Donezo logo"
				/>{" "}
				{/* TODO:Lazy load this image */}
			{/* </div> */}
			<h2 className="text-sm font-semibold">
				<Link
					to={`/`}
					className="text-inherit font-semibold"
				>
					Denezo
				</Link>
			</h2>
			<ul className="hidden lg:flex lg:items-center lg:justify-between lg:flex-1 lg:mx-28 lg:gap-4">
				{HeaderList.map((element, index) => (
					<NavLink
						className={`text-sm`}
						to={element.redirect}
						key={`${element.title}${index}`}
					>
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
						<DropdownMenuItem>
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
		</div>
	);
};

export default Header;
