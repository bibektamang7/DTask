import PeerProvider from "@/context/PeerContex";
import { SocketProvider } from "@/context/SocketContex";
import React from "react";
import { Navigate } from "react-router";

const ContainerLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// const location = useLocation();
	const token = localStorage.getItem("token");
	if (!token) return <Navigate to={"/login"} />;
	// const isAuthenticated =
	// if (!isAuthenticated) <Navigate to={"/login"} />;
	return (
		<SocketProvider>
			<PeerProvider>{children}</PeerProvider>
		</SocketProvider>
	);
};

export default ContainerLayout;
