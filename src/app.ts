
import express from "express";
import bodyParser from "body-parser";
import videoRoutes from "./routes/videoRoutes";
import authRoutes from "./routes/authRoutes";
import { AppDataSource } from "./database/dataSource";


const app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use("/api", videoRoutes);

AppDataSource.initialize()
.then(() => console.log("Database connected"))
.catch((error) => console.error("Database connection error", error.message));

export default app;