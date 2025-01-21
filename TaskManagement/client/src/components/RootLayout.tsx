import React from "react";
import { Outlet } from "react-router";
import Header from "./landing_page/Header";
import Footer from "./landing_page/Footer";

const RootLayout = () => {
  
  return (
    <div className="min-w-max min-h-screen">
      <Header />
      <Outlet/>
      <Footer />
    </div>
  );
};

export default RootLayout;
