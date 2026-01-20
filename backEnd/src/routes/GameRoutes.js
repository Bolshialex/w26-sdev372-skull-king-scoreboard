import { Router } from "express";
import { createGame } from "../controllers/GameController.js";

const gameRouter = Router();

//gameRouter.get("/game", getGames);
//gameRouter.get("/game/:id", getGame);
//gameRouter.get("/player-round/:player_id/:round_id", getPlayerRound);
gameRouter.post("/game", createGame);
//gameRouter.post("/round", addRound);

export default gameRouter;
