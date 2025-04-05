const JoinUs = () => {
	return (
		<section className="w-full my-12 md:py-24 lg:py-32 text-white bg-gradient rounded-lg">
			<div className="container px-4 md:px-6">
				<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
					<div className="space-y-4">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
							Join thousands of teams already using{" "}
							<span className="text-gradient"> Donezo</span>
						</h2>
						<p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							From startups to enterprise organizations, Donezo helps teams of
							all sizes manage their work more effectively.
						</p>
					</div>
					<div className="flex flex-col space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center justify-center p-4 bg-white/10 rounded-lg">
								<p className="text-2xl font-bold">10,000+</p>
								<p className="ml-2">Teams</p>
							</div>
							<div className="flex items-center justify-center p-4 bg-white/10 rounded-lg">
								<p className="text-2xl font-bold">150+</p>
								<p className="ml-2">Countries</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center justify-center p-4 bg-white/10 rounded-lg">
								<p className="text-2xl font-bold">1M+</p>
								<p className="ml-2">Users</p>
							</div>
							<div className="flex items-center justify-center p-4 bg-white/10 rounded-lg">
								<p className="text-2xl font-bold">99.9%</p>
								<p className="ml-2">Uptime</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default JoinUs;
