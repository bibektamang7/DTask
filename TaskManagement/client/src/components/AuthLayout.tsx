import React from "react";
import { Navigate, useLocation } from "react-router";

const AuthLayout = () => {
  const location = useLocation();
  const isAuthenticated = true;
  if (!isAuthenticated) <Navigate to={"/login"} />;
  return <Navigate replace={true} to={``} />;
};

export default AuthLayout;
