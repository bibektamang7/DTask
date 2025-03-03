import Footer from "@/components/landing_page/Footer";
import Header from "@/components/landing_page/Header";
import React from "react";
import { Outlet } from "react-router";

import { Button } from "@/components/ui/button";
import Benifit from "@/components/landing_page/Benifit";
import ReadyElevate from "@/components/landing_page/ReadyElevate";
import Features from "@/components/landing_page/Features";

const Home = () => {
  return (
    <section className="py-12 px-4">
      <h2 className="text-4xl font-semibold md:leading-[4.3rem] md:text-6xl text-center">Effortless Task
        <br />
        Management for your Team
      </h2>
      <p className="my-5 text-sm text-center font-extralight">Boost productivity, stay organized and meet deadlines with out all-in-one task management platform.</p>
      <div className="my-8 w-full flex justify-center items-center gap-4">
        <Button className="tracking-tighter hover:border-none outline-none border-none hover:scale-105  font-semibold bg-gray-900 border-gray-500 hover:bg-gray-900/40 text-white">Get Started</Button>
        <Button className="tracking-tighter font-semibold">Watch Demo</Button>
      </div>
      <div className="my-12 rounded-lg overflow-hidden">
        <img style={{width: "100%", height: "110%"}} src="./home.png" alt="task management dashboard" />
      </div>
      <Features/>
      <Benifit/>
      <ReadyElevate/>
    </section>
  );
};

export default Home;
