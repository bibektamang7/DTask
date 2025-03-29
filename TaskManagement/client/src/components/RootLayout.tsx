import React from "react";
import { Outlet } from "react-router";
import Header from "./landing_page/Header";
import Footer from "./landing_page/Footer";

const RootLayout = () => {
	return (
		<div className="min-w-full min-h-screen">
			<div className="lg:mx-40 overflow-hidden">
				<Header />
				<Outlet />
			</div>
			<Footer />
		</div>
	);
};

export default RootLayout;
