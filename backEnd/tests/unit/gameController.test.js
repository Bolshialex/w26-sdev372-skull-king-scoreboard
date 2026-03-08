import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import * as gameController from '../../src/controllers/GameController.js';
import { games, rounds, playerRounds } from '../utils/mockData.js';
import db from '../../src/models/index.js';

const { Game, PlayerGame, Round, PlayerRound } = db;

vi.mock('../../src/models/index.js', () => ({
    default: {
        Game: { create: vi.fn(), findOne: vi.fn() },
        PlayerGame: { create: vi.fn() },
        Round: { create: vi.fn(), findOne: vi.fn() },
        PlayerRound: { create: vi.fn(), findOne: vi.fn()}
    }
}));

describe('Game Controller', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    describe('createGame', () => {
        it('should create a game and return 201', async () => {
            const req = { body: { players: games[0].players, rounds_needed: games[0].rounds_needed } };
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

            const gameCreate = vi.spyOn(Game, 'create').mockResolvedValue(games[0]);
            const playerGameCreate = vi.spyOn(PlayerGame, 'create').mockResolvedValue({ id: 1 });
            const roundCreate = vi.spyOn(Round, 'create').mockResolvedValue(rounds[0]);

            await gameController.createGame(req, res);

            expect(gameCreate).toHaveBeenCalledWith({ rounds_needed: games[0].rounds_needed, players: games[0].players });
            expect(playerGameCreate).toHaveBeenCalledTimes(2);
            expect(playerGameCreate).toHaveBeenNthCalledWith(1, { game_id: games[0].id, player_id: 1 });
            expect(playerGameCreate).toHaveBeenNthCalledWith(2, { game_id: games[0].id, player_id: 2 });
            expect(roundCreate).toHaveBeenCalledWith({ game_id: games[0].id, round_number: 1 });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Game Created",
                round_info: rounds[0],
                game_info: games[0],
            });
        });

        it('should return 500 if there is an error', async () => {
            const req = { body: { players: games[0].players, rounds_needed: games[0].rounds_needed } };
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

            const gameCreate = vi.spyOn(Game, 'create').mockRejectedValue(new Error('DB Error'));

            await gameController.createGame(req, res);

            expect(gameCreate).toHaveBeenCalledWith({ rounds_needed: games[0].rounds_needed, players: games[0].players });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
        });
    });

    describe("startNewRound", () => {
        it("should create player rounds and return 201 when round_number is 1", async () => {
            const req = {
                params: { game_id: games[0].id, round_id: rounds[0].id },
                body: {
                    1: { bid: playerRounds[0].bid, tricks_won: playerRounds[0].tricks_won, bonus_points: playerRounds[0].bonus_points, round_score: playerRounds[0].round_score },
                    2: { bid: playerRounds[1].bid, tricks_won: playerRounds[1].tricks_won, bonus_points: playerRounds[1].bonus_points, round_score: playerRounds[1].round_score },
                }
            };
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

            vi.spyOn(Game, 'findOne').mockResolvedValue(games[0]);
            vi.spyOn(Round, 'findOne').mockResolvedValue(rounds[0]);
            const playerRoundCreate = vi.spyOn(PlayerRound, 'create')
                .mockResolvedValueOnce(playerRounds[0])
                .mockResolvedValueOnce(playerRounds[1]);
            const roundCreate = vi.spyOn(Round, 'create').mockResolvedValue({ id: 203, round_number: 2, game_id: games[0].id });

            await gameController.startNewRound(req, res);

            expect(playerRoundCreate).toHaveBeenCalledTimes(2);
            expect(playerRoundCreate).toHaveBeenNthCalledWith(1, { bid: playerRounds[0].bid, tricks_won: playerRounds[0].tricks_won, score: playerRounds[0].score, bonus_points: playerRounds[0].bonus_points, round_score: playerRounds[0].round_score, player_id: 1, round_id: rounds[0].id });
            expect(playerRoundCreate).toHaveBeenNthCalledWith(2, { bid: playerRounds[1].bid, tricks_won: playerRounds[1].tricks_won, score: playerRounds[1].score, bonus_points: playerRounds[1].bonus_points, round_score: playerRounds[1].round_score, player_id: 2, round_id: rounds[0].id });
            expect(roundCreate).toHaveBeenCalledWith({ game_id: games[0].id, round_number: 2 });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                newRound: { id: 203, round_number: 2, game_id: games[0].id },
                newPlayerRoundInfo: {
                    1: playerRounds[0],
                    2: playerRounds[1],
                }
            });
        });

        it("should create player rounds and return 201 when round_number is not 1", async () => {
            const req = {
                params: { game_id: games[0].id, round_id: rounds[1].id },
                body: {
                    1: { bid: playerRounds[2].bid, tricks_won: playerRounds[2].tricks_won, bonus_points: playerRounds[2].bonus_points, round_score: playerRounds[2].round_score },
                    2: { bid: playerRounds[3].bid, tricks_won: playerRounds[3].tricks_won, bonus_points: playerRounds[3].bonus_points, round_score: playerRounds[3].round_score },
                }
            };
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

            vi.spyOn(Game, 'findOne').mockResolvedValue(games[0]);
            vi.spyOn(Round, 'findOne')
                .mockResolvedValueOnce(rounds[1])  // roundInfo
                .mockResolvedValueOnce(rounds[0])  // prevRound player 1
                .mockResolvedValueOnce(rounds[0]); // prevRound player 2
            vi.spyOn(PlayerRound, 'findOne')
                .mockResolvedValueOnce(playerRounds[0])  // prevPlayerRound player 1
                .mockResolvedValueOnce(playerRounds[1]); // prevPlayerRound player 2
            const playerRoundCreate = vi.spyOn(PlayerRound, 'create')
                .mockResolvedValueOnce(playerRounds[2]) // newInfo player 1
                .mockResolvedValueOnce(playerRounds[3]); // newInfo player 2
            const roundCreate = vi.spyOn(Round, 'create').mockResolvedValue({ id: 203, round_number: 3, game_id: games[0].id });

            await gameController.startNewRound(req, res);

            expect(playerRoundCreate).toHaveBeenCalledTimes(2);
            expect(playerRoundCreate).toHaveBeenNthCalledWith(1, { bid: playerRounds[2].bid, tricks_won: playerRounds[2].tricks_won, score: playerRounds[2].score, bonus_points: playerRounds[2].bonus_points, round_score: playerRounds[2].round_score, player_id: 1, round_id: rounds[1].id });
            expect(playerRoundCreate).toHaveBeenNthCalledWith(2, { bid: playerRounds[3].bid, tricks_won: playerRounds[3].tricks_won, score: playerRounds[3].score, bonus_points: playerRounds[3].bonus_points, round_score: playerRounds[3].round_score, player_id: 2, round_id: rounds[1].id });
            expect(roundCreate).toHaveBeenCalledWith({ game_id: games[0].id, round_number: 3 });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                newRound: { id: 203, round_number: 3, game_id: games[0].id },
                newPlayerRoundInfo: {
                    1: playerRounds[2],
                    2: playerRounds[3],
                }
            });
        });

        it("should return 500 if there is an error", async () => {
            const req = {
                params: { game_id: games[0].id, round_id: rounds[0].id },
                body: {}
            };
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

            vi.spyOn(Game, 'findOne').mockResolvedValue(games[0]);
            vi.spyOn(Round, 'findOne').mockResolvedValue(rounds[0]);
            vi.spyOn(PlayerRound, 'create').mockRejectedValue(new Error('DB Error'));

            await gameController.startNewRound(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
        });
    });
});