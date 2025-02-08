"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "./.env",
});
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 8000;
(0, db_1.connectDB)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Application is running on PORT ${PORT}`);
    });
})
    .catch((error) => {
    console.log("Something went wrong while connecting Database", error);
});
