import React from "react";
import { Navigate, useLocation } from "react-router";

const AuthLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  // const location = useLocation();
  const token = localStorage.getItem("token");
  if(!token) return <Navigate to={"/login"}/>
  // const isAuthenticated = 
  // if (!isAuthenticated) <Navigate to={"/login"} />;
  return children;
};

export default AuthLayout;
