import express from "express"
import { config } from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import databaseConnectionHandler from "./utils/DatabaseConnections.js";
import cookieParser from "cookie-parser";
const app = express();

const PORT = config.PORT;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/auth", authRoutes);


databaseConnectionHandler().then(() => {
    app.listen(PORT, () => {
        console.log("server is listening on " + "http://localhost:" + PORT)
    })
}).catch(() => { })

