import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import playerFunctions from "../api/playerFunctions";

function PlayerGameHistory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gamesData = await playerFunctions.getPlayerGames(id);
                const playerData = await playerFunctions.getPlayer(id);
                setGames(gamesData);
                setPlayer(playerData.player);
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
            <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>Back</button>
            <h2>Game History: {player ? `${player.first_name} ${player.last_name}` : "Player"}</h2>

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
        </div>
    );
}

export default PlayerGameHistory;
