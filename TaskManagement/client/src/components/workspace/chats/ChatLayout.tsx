import { Outlet } from "react-router";

const ChatLayout = () => {
	return (
		<section className="w-full overflow-hidden">
			<Outlet />
		</section>
	);
};

export default ChatLayout;
