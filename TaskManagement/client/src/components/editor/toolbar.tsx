export const Toolbar = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex items-center justify-center space-x-2 border-b px-3 py-1 sticky top-4">
			{children}
		</div>
	);
};