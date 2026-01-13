import { Router } from "express";
import {
  createGame, 
  getGames,
  getGame,
  addRound,
  getPlayerRound,
} from "../controllers/GameController.js";

const gameRouter = Router();

gameRouter.get("/game", getGames);
gameRouter.get("/game/:id", getGame);
gameRouter.get("/player-roud/:player_id/:roud_id", getPlayerRound);
gameRouter.post("/game", createGame);
gameRouter.post("/round", addRound);

export default gameRouter;