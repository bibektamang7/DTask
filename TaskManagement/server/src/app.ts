import express from "express"
import cors from "cors"

const app = express();

cors({
    origin: process.env.CORS_ORIGIN,
})

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

import UserRouter from "./routes/user.routes";
import TaskRouter from "./routes/task.routes";
import WorkspaceRouter from "./routes/workspace.routes";

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/tasks", TaskRouter);
app.use("/api/v1/workspaces", WorkspaceRouter);


app.on("upgrade", () => {})

export default app;