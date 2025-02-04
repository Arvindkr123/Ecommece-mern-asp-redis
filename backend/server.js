import express from "express"
import { config } from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import cuponsRoutes from "./routes/cupons.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import databaseConnectionHandler from "./utils/DatabaseConnections.js";
import cookieParser from "cookie-parser";
const app = express();

const PORT = config.PORT;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/cupons", cuponsRoutes);
app.use("/api/payments", paymentsRoutes);

databaseConnectionHandler().then(() => {
    app.listen(PORT, () => {
        console.log("server is listening on " + "http://localhost:" + PORT)
    })
}).catch(() => { })

