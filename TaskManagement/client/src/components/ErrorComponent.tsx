import { useRouteError } from "react-router";
const ErrorComponent = () => {
	const error: any = useRouteError();
	return <div>{error.message}</div>;
};

export default ErrorComponent;
