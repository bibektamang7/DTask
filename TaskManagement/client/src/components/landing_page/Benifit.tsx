
const Benifit = () => {
	return (
		<section className="lg:py-12">
			<h1 className="px-3 text-2xl py-8 font-semibold md:leading-[2.3rem] md:text-3xl text-center">
				Streamline your
				<br />
				task management process
			</h1>

			<div className="flex flex-col gap-8 items-center justify-between p-2">
				<div className="flex flex-col items-start justify-center px-4 border-2 border-slate-600 rounded-md py-2">
					<h3 className="text-lg leading-6 tracking-tighter md:text-xl">
						Solving Confusion
 						<br />
						Managing Task
					</h3>
					
					<p className="my-3 text-sm text-gray-500">
						Find out what's causing the confusion. Is it unclear instructions,
						missing information.
					</p>
				</div>
				<div className="flex flex-col items-start justify-center px-4 border-2 border-slate-600 rounded-md py-2">
					<h3 className="text-lg font-medium leading-6 tracking-tighter  md:text-xl">
						Facilitating Team
						<br />
						Collaboration
					</h3>
					<p className="my-3 text-sm text-gray-500">
						Facilitating team collaboration involves creating an environment
						where team members can work.
					</p>
				</div>
				<div className="flex flex-col items-start justify-center px-4 border-2 border-slate-600 rounded-md py-2">
					<h3 className="text-lg font-medium leading-6 tracking-tighter md:text-xl">
						Maintaining Focus on
						<br />
						Important Tasks
					</h3>
					<p className="my-3 text-sm text-gray-500">
						Maintaining focus on important tasks requires effective time
						management.
					</p>
				</div>
			</div>
		</section>
	);
};

export default Benifit;
