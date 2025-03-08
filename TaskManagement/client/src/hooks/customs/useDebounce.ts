import { useEffect, useState } from "react";

const useDebounce = (email: string, delay: number = 500) => {
	const [debouncedEmail, setDebouncedEmail] = useState<string>(email);
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedEmail(email);
		}, delay);
		return () => {
			clearInterval(handler);
		};
	}, [email, delay]);



	return debouncedEmail;
};

export { useDebounce };
