import { beforeAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import db from "../../src/models/index.js";

const { Player, Stats, PlayerGame, Game } = db;

beforeAll(async () => await db.sequelize.sync({ force: true }));

describe("GET /players", () => {
  it("returns only active players as an array", async () => {
    await Player.create({ first_name: "Active", last_name: "Player" });
    
    const inactivePlayer = await Player.create({ first_name: "Inactive", last_name: "Player" });
    await inactivePlayer.update({ isActive: false });

    const res = await request(app).get("/api/players");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    
    const activePlayers = res.body.map(p => p.first_name);
    expect(activePlayers).toContain("Active");
    expect(activePlayers).not.toContain("Inactive");
  });
});

describe("GET /players/:id", () => {
  it("returns player and playerStats", async () => {
    const player = await Player.create({ first_name: "Jane", last_name: "Doe" });
    await Stats.create({ player_id: player.id });

    const res = await request(app).get(`/api/players/${player.id}`);

    expect(res.status).toBe(200);
    expect(res.body.player.id).toBe(player.id);
    expect(res.body.playerStats).toBeDefined();
    expect(res.body.playerStats.player_id).toBe(player.id);
  });

  it("returns 404 if player not found", async () => {
    const res = await request(app).get("/api/players/99999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Cannot find player");
  });

  it("returns 404 if player stats not found", async () => {
    const player = await Player.create({ first_name: "NoStats", last_name: "Guy" });

    const res = await request(app).get(`/api/players/${player.id}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Cannot find player stats");
  });
});

describe("GET /players/:id/games", () => {
  it("returns player games with associated game data sorted newest first", async () => {
    const player = await Player.create({ first_name: "Jane", last_name: "Doe" });
    const olderGame = await Game.create({ date_played: new Date("2024-01-01"), players: [] });
    const newerGame = await Game.create({ date_played: new Date("2024-06-01"), players: [] });
    await PlayerGame.create({ player_id: player.id, game_id: olderGame.id });
    await PlayerGame.create({ player_id: player.id, game_id: newerGame.id });

    const res = await request(app).get(`/api/players/${player.id}/games`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].game.id).toBe(newerGame.id);
    expect(res.body[1].game.id).toBe(olderGame.id);
  });

  it("returns empty array if player has no games", async () => {
    const player = await Player.create({ first_name: "NoGames", last_name: "Guy" });

    const res = await request(app).get(`/api/players/${player.id}/games`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /players/:id/stats", () => {
  it("returns player stats data", async () => {
    const player = await Player.create({ first_name: "Stats", last_name: "Guy" });
    await Stats.create({ player_id: player.id });

    const res = await request(app).get(`/api/players/${player.id}/stats`);

    expect(res.status).toBe(200);
    expect(res.body.total_games).toBeDefined();
    expect(res.body.wins).toBeDefined();
    expect(res.body.losses).toBeDefined();
    expect(res.body.success_rate).toBeDefined();
  });

  it("returns 404 if player stats not found", async () => {
    const res = await request(app).get("/api/players/99999/stats");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Cannot find player stats");
  });
});

describe("POST /players", () => {
  it("creates a player and stats", async () => {
    const res = await request(app).post("/api/players").send({ first_name: "John", last_name: "Doe" });
    expect(res.status).toBe(201);
  });
});

describe("PUT /players/:id", () => {
  it("updates a player", async () => {
    const player = await Player.create({ first_name: "Old", last_name: "Name" });

    const res = await request(app)
      .put(`/api/players/${player.id}`)
      .send({ first_name: "New", last_name: "Name" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Player Updated");
    await player.reload();
    expect(player.first_name).toBe("New");
  });

  it("returns 400 if fields are missing", async () => {
    const player = await Player.create({ first_name: "Old", last_name: "Name" });

    const res = await request(app)
      .put(`/api/players/${player.id}`)
      .send({ first_name: "Only" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing required fields");
  });
});

describe("DELETE /players/:id", () => {
  it("marks a deleted player as inactive", async () => {
    const player = await Player.create({ first_name: "Jake", last_name: "Smith" });

    const res = await request(app)
      .delete(`/api/players/${player.id}`)
      .send({ id: player.id });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Player Deleted Successfully");
    await player.reload();
    expect(player.isActive).toBe(false);
  });

  it("returns 400 if id is missing", async () => {
    const res = await request(app).delete("/api/players/1").send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Cannot find player");
  });

  it("returns 401 if player does not exist in db", async () => {
    const res = await request(app)
      .delete("/api/players/99999")
      .send({ id: 99999 });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Cannot find player");
  });
});