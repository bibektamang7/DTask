"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("./user");
const workspaceManager_1 = require("./workspaceManager");
const wss = new ws_1.WebSocketServer();
const validateToken = (token) => {
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
    return decodedToken._id;
};
wss.on("connection", function connection(ws, req) {
    ws.on('error', console.error);
    try {
        const token = req.headers['authorization'];
        if (!token) {
            // TODO:Work on this feature properly
            return;
        }
        const userId = validateToken(token);
        const user = new user_1.User(ws, userId);
        //TODO:Upgrade the websocket connection and separate the connection in three part
        // workspace
        // chat
        // task
        ws.onclose = () => {
            workspaceManager_1.workspaceManager.removeUser(userId);
        };
    }
    catch (error) {
        // TODO:NEED TO HANDLE THIS PROPERLY
        console.log("Something went wront while parsing token", error);
    }
});
