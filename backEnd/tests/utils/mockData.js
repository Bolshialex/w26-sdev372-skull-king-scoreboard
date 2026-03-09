export const players = [
  { id: 1, first_name: "Jim", last_name: "Jones", isActive: true },
  { id: 2, first_name: "Sam", last_name: "Smith", isActive: true },
  { id: 3, first_name: "Old", last_name: "Account", isActive: false }
];

export const stats = [
  { id: 1, player_id: 1, games_played: 10, bet_success_rate: 0.75, wins: 7, losses: 3 },
  { id: 2, player_id: 2, games_played: 0, bet_success_rate: 0, wins: 0, losses: 0 }
];

export const games = [
  {
    id: 101,
    date_played: "2026-03-01T10:00:00Z",
    finished: true,
    rounds_needed: 12,
    players: [1, 2]
  },
  {
    id: 102,
    date_played: "2026-03-04T15:00:00Z",
    finished: false,
    rounds_needed: 10,
    players: [1]
  }
];

export const rounds = [
  { id: 201, game_id: 101, round_number: 1 },
  { id: 202, game_id: 101, round_number: 2 }
];

export const playerRounds = [
  {
    id: 301,
    round_id: 201,
    player_id: 1,
    bid: 2,
    tricks_won: 2,
    round_score: 20,
    bonus_points: 10,
    score: 30
  },
  {
    id: 302,
    round_id: 201,
    player_id: 2,
    bid: 3,
    tricks_won: 1,
    round_score: 15,
    bonus_points: 5,
    score: 20
  },
  {
    id: 303,
    round_id: 202,
    player_id: 1,
    bid: 3,
    tricks_won: 3,
    round_score: 25,
    bonus_points: 5,
    score: 60
  },
  {
    id: 304,
    round_id: 202,
    player_id: 2,
    bid: 2,
    tricks_won: 2,
    round_score: 20,
    bonus_points: 10,
    score: 50
  }
];

export const playerGames = [
  { id: 10, player_id: 1, game_id: 101, Game: games[0] },
  { id: 11, player_id: 1, game_id: 102, Game: games[1] }
];