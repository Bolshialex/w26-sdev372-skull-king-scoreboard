import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import PlayerRouter from "./routes/PlayerRoutes.js";
import db from "./models/index.js";
import gameRouter from "./routes/GameRoutes.js";

dotenv.config();
const PORT = 3056;
const app = express();
app.use(express());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
await db.sequelize.sync();

app.use("/", PlayerRouter);
app.use("/", gameRouter);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`.bgYellow);
});
