import React from "react";
import { Navigate } from "react-router";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	const token = localStorage.getItem("token");

	if (token) {
		const item = JSON.parse(token);
		if (Date.now() < item.expiry) return <Navigate to={`/w`} />;
	}
	return children;
};

export default AuthLayout;
