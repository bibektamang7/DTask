import { Link } from "react-router";

const footer_links = [
	{
		heading: "Home",
		lists: [
			{
				title: "About Us",
				redirectTo: "/about",
			},
			{
				title: "Features",
				redirectTo: "/features",
			},
			{
				title: "pricing",
				redirectTo: "/pricing",
			},
		],
	},
	{
		heading: "Support",
		lists: [
			{
				title: "Help Center",
				redirectTo: "/help-center",
			},
			{
				title: "FAQs",
				redirectTo: "/faqs",
			},
			{
				title: "Forums",
				redirectTo: "/forums",
			},
		],
	},
	{
		heading: "Legal",
		lists: [
			{
				title: "Privacy Policy",
				redirectTo: "/privacy-policy",
			},
			{
				title: "Terms of Use",
				redirectTo: "/terms",
			},
		],
	},
];

const FooterLink = () => {
	return (
		<div className="flex gap-12">
			{footer_links.map((element, index) => (
				<div
					key={element.heading}
					className="flex flex-col gap-4">
					<h4>{element.heading}</h4>
					<ul
						className="flex flex-col gap-3"
						key={`${element.heading}${index}`}>
						{element.lists.map((data, ind) => (
							<Link
								className="hover:text-white text-sm font-extralight text-gray-400"
								to={data.redirectTo}
								key={`${data.title}${ind}`}>
								{data.title}
							</Link>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

const Footer = () => {
	return (
		<section className="overflow-hidden">
			<div className="flex flex-col lg:flex-row items-center justify-start gap-8 lg:gap-40 border-t-2 border-gray-500 py-8 lg:px-16">
				<div className="flex flex-col gap-4">
					<strong className="text-4xl">Denzo</strong>
					<p className="text-sm font-extralight text-gray-400">
						Designed to help teams and individuals stay
						<br />
						organizes, focused, and on track.
					</p>
					<div>{/* social median links */}</div>
				</div>
				<FooterLink />
			</div>
		</section>
	);
};

export default Footer;
