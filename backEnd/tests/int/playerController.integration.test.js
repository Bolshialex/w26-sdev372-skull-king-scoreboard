import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import db from "../../src/models/index.js";

const { Player, Stats } = db;

beforeAll(async () => await db.sequelize.sync({ force: true }));
afterAll(async () => await db.sequelize.close());

describe("POST /api/players", () => {
  it("creates a player and stats", async () => {
    const res = await request(app).post("/api/players").send({ first_name: "John", last_name: "Doe" });
    expect(res.status).toBe(201);
  });
});

describe("GET /api/players/:id", () => {
  it("returns player and stats", async () => {
    const player = await Player.create({ first_name: "Jane", last_name: "Doe" });
    await Stats.create({ player_id: player.id });

    const res = await request(app).get(`/api/players/${player.id}`);
    expect(res.status).toBe(200);
    expect(res.body.player.id).toBe(player.id);
  });

  it("returns 404 if player not found", async () => {
    const res = await request(app).get("/api/players/99999");
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/players", () => {
  it("soft deletes a player", async () => {
    const player = await Player.create({ first_name: "Jake", last_name: "Smith" });
    const res = await request(app).delete(`/api/players/${player.id}`).send({ id: player.id });
    expect(res.status).toBe(200);
    await player.reload();
    expect(player.isActive).toBe(false);
  });
});