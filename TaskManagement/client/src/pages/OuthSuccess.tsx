import { Navigate } from "react-router";

const OuthSuccess = () => {
	const query = new URLSearchParams(window.location.search);
	const token = query.get("token");
	const userId = query.get("userId");
	console.log(token, "THIS is toke");
	console.log(userId, "this is suser id");
	if (token && userId) {
		localStorage.setItem("token", token);
		localStorage.setItem("currentUser", userId);
		return <Navigate to={`/w`} />;
	}
	return <Navigate to={`/login`} />;
};

export default OuthSuccess;
