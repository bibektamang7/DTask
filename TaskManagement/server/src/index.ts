import { connectDB } from "./db"
import dotenv from "dotenv";
import app from "./app"

dotenv.config({
    path: "./.env",
})

const PORT = process.env.PORT || 8000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Application is running on PORT ${PORT}`);
    })
 }).catch((error) => {
    console.log("Something went wrong while connecting Database", error);
})