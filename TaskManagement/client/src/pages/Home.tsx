import Footer from "@/components/landing_page/Footer";
import Header from "@/components/landing_page/Header";
import React from "react";
import { Outlet } from "react-router";

import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <section className="py-12">
      <h2 className="text-4xl font-semibold md:leading-[4.3rem] md:text-6xl text-center">Effortless Task
        <br />
        Management for your Team
      </h2>
      <p className="my-5 text-sm text-center font-extralight">Boost productivity, stay organized and meet deadlines with out all-in-one task management platform.</p>
      <div className="my-8 w-full flex justify-center items-center gap-4">
        <Button className="tracking-tighter font-semibold bg-gray-900 hover:bg-primary border-gray-500">Get Started</Button>
        <Button className="tracking-tighter font-semibold">Watch Demo</Button>
      </div>
      <div className="my-12 rounded-lg overflow-hidden lg:mx-60">
        <img style={{width: "100%", height: "110%"}} src="./home.png" alt="task management dashboard" />
      </div>
    </section>
  );
};

export default Home;
