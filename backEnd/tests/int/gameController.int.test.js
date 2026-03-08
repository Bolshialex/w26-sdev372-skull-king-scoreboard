import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import db from "../../src/models/index.js";
const { Player, Game, PlayerGame, Round, PlayerRound } = db;


beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    await Player.create({ first_name: "John", last_name: "Doe" });
    await Player.create({ first_name: "Jane", last_name: "Doe" });
});

describe("GET /api/game", () => {
    it.todo("returns all games");
});

describe("GET /api/game/:id", () => {
    it.todo("returns a game by id");
    it.todo("returns 404 if game not found");
});

describe("GET /api/player-round/:player_id/:round_id", () => {
    it.todo("returns player round data");
    it.todo("returns 404 if not found");
});

describe("POST /api/game", () => {
    it("creates a game and returns 201", async () => {
        const res = await request(app).post("/api/game").send({ players: [1, 2], rounds_needed: 5 });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Game Created");
        expect(res.body.game_info.rounds_needed).toBe(5);
        expect(res.body.round_info.round_number).toBe(1);
    });

    it("returns 500 if missing required fields", async () => {
        const res = await request(app).post("/api/game").send({});
        expect(res.status).toBe(500);
    });
});

describe("POST /api/game/:game_id/:round_id", () => {
    it("creates player rounds and new round when round_number is 1", async () => {
        const game = await Game.create({ players: [1, 2], rounds_needed: 5 });
        const round = await Round.create({ game_id: game.id, round_number: 1 });

        const res = await request(app)
            .post(`/api/game/${game.id}/${round.id}`)
            .send({
                1: { bid: 2, tricks_won: 2, bonus_points: 10, round_score: 20 },
                2: { bid: 3, tricks_won: 1, bonus_points: 5, round_score: 15 },
            });

        expect(res.status).toBe(201);
        expect(res.body.newRound.round_number).toBe(2);
        expect(res.body.newPlayerRoundInfo[1].score).toBe(30);
        expect(res.body.newPlayerRoundInfo[2].score).toBe(20);
    });

    it("creates player rounds with cumulative score when round_number is not 1", async () => {
        const game = await Game.create({ players: [1, 2], rounds_needed: 5 });
        const round1 = await Round.create({ game_id: game.id, round_number: 1 });
        const round2 = await Round.create({ game_id: game.id, round_number: 2 });
        await PlayerRound.create({ player_id: 1, round_id: round1.id, bid: 2, tricks_won: 2, round_score: 20, bonus_points: 10, score: 30 });
        await PlayerRound.create({ player_id: 2, round_id: round1.id, bid: 3, tricks_won: 1, round_score: 15, bonus_points: 5, score: 20 });

        const res = await request(app)
            .post(`/api/game/${game.id}/${round2.id}`)
            .send({
                1: { bid: 3, tricks_won: 3, bonus_points: 5, round_score: 25 },
                2: { bid: 2, tricks_won: 2, bonus_points: 10, round_score: 20 },
            });

        expect(res.status).toBe(201);
        expect(res.body.newRound.round_number).toBe(3);
        expect(res.body.newPlayerRoundInfo[1].score).toBe(60);
        expect(res.body.newPlayerRoundInfo[2].score).toBe(50);
    });

    it("returns 500 if round not found", async () => {
        const game = await Game.create({ players: [1, 2], rounds_needed: 5 });
        const res = await request(app)
            .post(`/api/game/${game.id}/99999`)
            .send({
                1: { bid: 2, tricks_won: 2, bonus_points: 10, round_score: 20 },
                2: { bid: 3, tricks_won: 1, bonus_points: 5, round_score: 15 },
            });
        expect(res.status).toBe(500);
    });
});