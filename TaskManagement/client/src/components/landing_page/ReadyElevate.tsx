import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router";

const ReadyElevate = () => {
	return (
		<section className="w-full py-12 border-2 border-slate-800 rounded-lg lg:mx-auto">
			<div className="flex flex-col px-6">
				<h3 className="text-center font-semibold tracking-tighter leading-6 text-2xl lg:text-4xl">
					Ready to streamline
					<br />
					your workflow?
				</h3>
				<p className="mt-3 text-sm text-center text-gray-500">
					Join Denzo today and boost your team's productivity with powerful task
					management tools. Simplify your projects and stay organized.
				</p>
				<Link
					to={`/login`}
					className="w-full h-full"
				>
					<Button className="mt-4 w-full">Get Started</Button>
				</Link>
			</div>
			<div className="hidden">
				<img
					className=""
					src="/1.png"
					alt=""
				/>
			</div>
		</section>
	);
};

export default ReadyElevate;
