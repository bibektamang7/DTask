import express from "express";
import cors from "cors";
import multer from "multer";
const app = express();

cors({
	origin: process.env.CORS_ORIGIN,
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
// app.use(multer({limits: }))

import UserRouter from "./routes/user.routes";
import TaskRouter from "./routes/task.routes";
import WorkspaceRouter from "./routes/workspace.routes";
import ChatRouter from "./routes/chat.routes"


app.use("/api/v1/users", UserRouter);
app.use("/api/v1/tasks", TaskRouter);
app.use("/api/v1/workspaces", WorkspaceRouter);
app.use("/api/v1/chats", ChatRouter);



app.on("upgrade", () => {});

export default app;
