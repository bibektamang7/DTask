import React from "react";
import { Navigate } from "react-router";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	const token = localStorage.getItem("token");
	if (token) return <Navigate to={`/w`} />;
	return children;
};

export default AuthLayout;
