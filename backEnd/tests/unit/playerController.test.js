import { describe, it, expect, vi, afterAll, beforeEach } from 'vitest';
import * as playerController from '../../src/controllers/PlayerController.js';
import { players, stats, games, rounds, playerRounds, playerGames } from '../utils/mockData.js';
import db from '../../src/models/index.js';

const { Player, Stats, PlayerGame, Game } = db;

vi.mock('../../src/models/index.js', () => ({
    default: {
        Player: { findByPk: vi.fn() },
        Stats: { findOne: vi.fn() },
        PlayerGame: { findAll: vi.fn() },
        Game: {}
    }
}));

describe('Player Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    describe('getPlayerGames()', () => {
        it('should return 400 for missing character ID', async () => {
            const req = { params: {} };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            await playerController.getPlayerGames(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Missing player ID" });
        });

        it('should return 200 and player games sorted in descending order by date', async () => {
            const req = { params: { id: 1 } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            }; 

            const expectedData = playerGames
                .filter(pg => pg.player_id === 1)
                .map(pg => ({
                    ...pg,
                    Game: games.find(g => g.id === pg.game_id)
                }))
                .sort((a, b) => new Date(b.Game.date_played) - new Date(a.Game.date_played));

            const spy = vi.spyOn(PlayerGame, 'findAll').mockResolvedValue(expectedData);

            await playerController.getPlayerGames(req, res);

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { player_id: 1 },
                    include: expect.arrayContaining([
                        expect.objectContaining({
                            model: Game,
                        }),
                    ]),
                    order: [[Game, "date_played", "DESC"]],
                })
            );
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedData);

        });

        it('should return 500 on database error', async () => {
            const req = { params: { id: 1 } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const spy = vi.spyOn(PlayerGame, 'findAll').mockRejectedValue(new Error('Database error'));
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await playerController.getPlayerGames(req, res);

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { player_id: 1 },
                    include: expect.arrayContaining([
                        expect.objectContaining({
                            model: Game,
                        }),
                    ]),
                    order: [[Game, "date_played", "DESC"]],
                })
            );

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
        });

    })

    describe('getPlayer()', () => {
        it('should return 400 for missing character ID', async () => {
            const req = { params: {} };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            await playerController.getPlayer(req, res);
        });
    
        it('should return 404 if player not found', async () => {
            const req = { params: { id: 999 } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            Player.findByPk = vi.fn().mockResolvedValue(null);
            Stats.findOne = vi.fn().mockResolvedValue(null);

            const playerSpy = vi.spyOn(Player, 'findByPk').mockResolvedValue(null);

            await playerController.getPlayer(req, res);

            expect(playerSpy).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Cannot find player" });

        });

        it('should return 404 if player stats not found', async () => {
            const req = { params: { id: 1 } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const playerSpy = vi.spyOn(Player, 'findByPk').mockResolvedValue(players[0]);
            const statsSpy = vi.spyOn(Stats, 'findOne').mockResolvedValue(null);

            await playerController.getPlayer(req, res);

            expect(playerSpy).toHaveBeenCalledWith(1);
            expect(statsSpy).toHaveBeenCalledWith({ where: { player_id: 1 } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Cannot find player stats" });

        });

        it('should return 200 and player data with stats', async () => {
            const req = { params: { id: 1 } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };

            const playerSpy = vi.spyOn(Player, 'findByPk').mockResolvedValue(players[0]);
            const statsSpy = vi.spyOn(Stats, 'findOne').mockResolvedValue(stats[0]);

            await playerController.getPlayer(req, res);

            expect(playerSpy).toHaveBeenCalledWith(1);
            expect(statsSpy).toHaveBeenCalledWith({ where: { player_id: 1 } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ player: players[0], playerStats: stats[0] });
        });
    });
})
;
