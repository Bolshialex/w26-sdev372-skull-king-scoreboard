import { Router } from "express";
import {
  getAllPlayers,
  getPlayer,
  createPlayer,
  editPlayer,
  deletePlayer,
  getPlayerGames,
  getPlayerStats
} from "../controllers/PlayerController.js";
import Player from "../models/PlayerSchema.js";

const PlayerRouter = Router();

PlayerRouter.get("/players", getAllPlayers);
PlayerRouter.get("/players/:id", getPlayer);
PlayerRouter.get("/players/:id/games", getPlayerGames);
PlayerRouter.get("/players/:id/stats", getPlayerStats);
PlayerRouter.post("/players", createPlayer);
PlayerRouter.put("/players/:id", editPlayer);
PlayerRouter.delete("/players/:id", deletePlayer);

export default PlayerRouter;