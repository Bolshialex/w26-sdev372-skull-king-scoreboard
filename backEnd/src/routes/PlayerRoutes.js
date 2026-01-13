import { Router } from "express";
import {
  getAllPlayers,
  getPlayer,
  createPlayer,
  editPlayer,
  deletePlayer,
} from "../controllers/PlayerController.js";

const PlayerRouter = Router();

PlayerRouter.get("/players", getAllPlayers);
PlayerRouter.get("/players/:id", getPlayer);
PlayerRouter.post("/players", createPlayer);
PlayerRouter.put("/players/:id", editPlayer);
PlayerRouter.delete("/players/:id", deletePlayer);

export default PlayerRouter;