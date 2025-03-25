import { createClient } from "redis";

const socketClient = createClient({ url: "redis://localhost:6379" });

(async () => {
	await socketClient.connect();
	console.log("socket client connected");
})();

export { socketClient };
