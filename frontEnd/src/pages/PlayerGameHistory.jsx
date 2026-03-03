import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import playerFunctions from "../api/playerFunctions";

function PlayerGameHistory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [player, setPlayer] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gamesData = await playerFunctions.getPlayerGames(id);
                const playerData = await playerFunctions.getPlayer(id);
                const statsData = await playerFunctions.getPlayerStats(id);
                setGames(gamesData);
                setPlayer(playerData.player);
                setStats(statsData);
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1>{player ? `${player.first_name} ${player.last_name}` : "Player"}</h1>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>Back</button>
            {stats && (
                <section className="stats">
                    <h2>Player Stats</h2>
                    <p><strong>Total Games:</strong> {stats.total_games}</p>
                    <p><strong>Success Rate:</strong> {stats.success_rate}</p>
                    <p><strong>Games Won:</strong> {stats.wins}</p>
                    <p><strong>Games Lost:</strong> {stats.losses}</p>
                </section>)
            }
            <section className="game-history">
            <h2>Game History</h2>
            {games.length === 0 ? (
                <p>No games played yet.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {games.map((gameItem) => {
                        const game = gameItem.game;
                        if (!game) return null; // Skip if game data is missing
                        return (
                            <div key={gameItem.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
                                <p><strong>Date:</strong> {game?.data_played ? new Date(game.data_played).toLocaleDateString() : "Unknown Date"}</p>
                                <p><strong>Game ID:</strong> {game?.id ?? "N/A"}</p>
                                <p><strong>Rounds:</strong> {game?.rounds_needed ?? "Unknown"}</p>
                                <p><strong>Status:</strong> {game?.finished === true ? "Finished" : game?.finished === false ? "In Progress" : "Unknown"}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
        </div>
    );
}

export default PlayerGameHistory;
