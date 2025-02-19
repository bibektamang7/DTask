"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
(0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
});
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "20kb" }));
// app.use(multer({limits: }))
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const workspace_routes_1 = __importDefault(require("./routes/workspace.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/tasks", task_routes_1.default);
app.use("/api/v1/workspaces", workspace_routes_1.default);
app.use("/api/v1/chats", chat_routes_1.default);
app.on("upgrade", () => { });
exports.default = app;
