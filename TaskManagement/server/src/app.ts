import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import CookieParse from "cookie-parser";
import password from "./helpers/googleAuth";

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
		credentials: true,
	})
);

app.use(password.initialize());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(CookieParse());

import UserRouter from "./routes/user.routes";
import TaskRouter from "./routes/task.routes";
import WorkspaceRouter from "./routes/workspace.routes";
import ChatRouter from "./routes/chat.routes";
import { ApiError } from "./utils/ApiError";

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/tasks", TaskRouter);
app.use("/api/v1/workspaces", WorkspaceRouter);
app.use("/api/v1/chats", ChatRouter);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
	res.status(err.statusCode).json({ error: err.message });
});

export default app;
