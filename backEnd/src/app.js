import express from "express";
import cors from "cors";
import PlayerRouter from "./routes/PlayerRoutes.js";
import gameRouter from "./routes/GameRoutes.js";

const app = express();
app.use(express());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", PlayerRouter);
app.use("/api", gameRouter);

export default app;