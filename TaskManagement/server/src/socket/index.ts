import WebSocket,{ WebSocketServer } from "ws";
import jwt from "jsonwebtoken"
import { User } from "./user";
import {workspaceManager} from "./workspaceManager"

const wss = new WebSocketServer();

const validateToken = (token: string) => {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as {_id: string};
    return decodedToken._id;
}


wss.on("connection", function connection(ws: WebSocket, req) {
    ws.on('error', console.error);
    try {
        const token = req.headers['authorization'];
        
        if (!token) {
            // TODO:Work on this feature properly
            return;
        }
        const userId = validateToken(token);
        const user = new User(ws, userId);
        
        //TODO:Upgrade the websocket connection and separate the connection in three part
        // workspace
        // chat
        // task
        

        ws.onclose = () => {
            workspaceManager.removeUser(userId);
        }
        
    } catch (error) {
        // TODO:NEED TO HANDLE THIS PROPERLY
        console.log("Something went wront while parsing token", error);
    }
})