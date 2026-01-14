import db from "../models/index.js";
const { Player, Stats } = db;

export const getPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json({ message: "Cannot find player" });
    const player = await Player.findByPk(id);

    const playerStats = await Stats.findOne({
      where: { player_id: player.id },
    });

    if (!player) return res.status(404).json({ message: "Cannot find player" });
    return res.status(200).json({ player, playerStats });
  } catch (error) {
    console.error("Error fetching player:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createPlayer = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    if (!first_name || !last_name)
      return res.status(400).json({ message: "Missing required fields" });

    const player = await Player.create({ first_name, last_name });

    await Stats.create({
      player_id: player.id,
    });

    return res.status(201).json({ message: "Player Created" });
  } catch (error) {
    console.error("Error creating player:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(401).json({ message: "Cannot find player" });

    const player = await Player.findByPk(id);
    if (!player) return res.status(401).json({ message: "Cannot find player" });

    await player.update({ isActive: false });

    return res.status(200).json({ message: "Player Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editPlayer = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    const { id } = req.params;

    if (!id) return res.status(401).json({ message: "Cannot find player" });

    if (!first_name || !last_name)
      return res.status(400).json({ message: "Missing required fields" });

    const player = await Player.findByPk(id);

    await player.update({ first_name, last_name });

    return res.status(200).json({ message: "Player Updated" });
  } catch (error) {
    console.error("Error updating player:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
