import { createContext, useContext, useEffect, useState } from "react";

const SOCKET_URL = "ws://localhost:8080";

const SocketContext = createContext<WebSocket | null>(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	useEffect(() => {
		const token = localStorage.getItem("token");
		const newSocket = new WebSocket(SOCKET_URL, token!);
		setSocket(newSocket);
		return () => {
			newSocket.close();
		};
	}, []);
	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export { SocketProvider };
