import dotenv from "dotenv";
import colors from "colors";
import app from "./app.js";
import db from "./models/index.js";

dotenv.config();
const PORT = 3056;

await db.sequelize.sync();

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`.bgYellow);
});