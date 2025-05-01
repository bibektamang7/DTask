import { Loader } from "lucide-react";
const LoaderComponent = () => {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<Loader className="animate-spin" />;
		</div>
	);
};

export default LoaderComponent;
