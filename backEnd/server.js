import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";

dotenv.config();
const PORT = 3056;
const app = express();
app.use(express());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`.bgYellow);
});
