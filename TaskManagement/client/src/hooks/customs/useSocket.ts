import { useEffect, useState } from "react";
import {useSelector} from "react-redux"

export const useSocket = () => {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	// const token = useSelector((state) => state.users.id)! as string
    const token = ""
	useEffect(() => {
		const ws = new WebSocket(import.meta.env.VITE_SOCKET_URL, token);
		ws.onopen = () => {
			setSocket(ws);
		};

		ws.onclose = () => {
			setSocket(null);
		};

        return () => {
            ws.close();
        }
	}, []);

	return socket;
};
