import React from "react";

import { featureCardData } from "@/constants";

interface FeatureCardProps {
	heading: string;
	description: string;
	image: {
		source: string;
		desc: string;
	};
}
// it is not complete, it is just a structure
const FeatureCard = ({ heading, description, image }: FeatureCardProps) => {
	return (
		<div className="rounded-lg shadow-md bg-slate-800/35 p-6 overflow-hidden lg:w-[26rem] lg:h-96">
			<strong className="text-xl font-medium my-2 tracking-tighter">{heading}</strong>
			<p className="font-light text-gray-400 text-sm my-2">{description}</p>
			<img
                className="object-contain mt-4 rounded-md"
				src={image.source}
				alt={image.desc}
			/>
		</div>
	);
};

const Features = () => {
	return (
		<section>
            <h2 className="text-center text-3xl my-2 tracking-tighter">Effortless scheduling with Denzo
                <br />
                for every task in your day
            </h2>
            <p className="my-2 text-sm text-gray-500 text-center">Say goodbye to the hassle of managing your calendar. Donezo streamlines your scheduling process, helping you plan, organize, and stay on top of your commitments with ease.</p>
			<div className="my-6 flex flex-col flex-wrap lg:flex-row gap-8 items-center justify-center">
				{featureCardData.map((ele: FeatureCardProps, ind) => (
					<FeatureCard
						{...ele}
						key={`${ele.heading}${ind}`}
					/>
				))}
			</div>
		</section>
	);
};

export default Features;
