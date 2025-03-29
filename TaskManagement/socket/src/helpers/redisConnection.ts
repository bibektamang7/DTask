import { createClient } from "redis";

const socketClient = createClient({ url: process.env.REDIS_URL });

(async () => {
	await socketClient.connect();
	console.log("socket client connected");
})();

export { socketClient };
