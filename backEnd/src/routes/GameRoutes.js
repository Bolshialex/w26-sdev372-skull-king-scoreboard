import { Router } from "express";
import { createGame, startNewRound } from "../controllers/GameController.js";

const gameRouter = Router();

//gameRouter.get("/game", getGames);
//gameRouter.get("/game/:id", getGame);
//gameRouter.get("/player-round/:player_id/:round_id", getPlayerRound);
gameRouter.post("/game", createGame);
gameRouter.post("/game/:game_id/:round_id", startNewRound);

export default gameRouter;
