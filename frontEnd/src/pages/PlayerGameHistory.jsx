import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import playerFunctions from "../api/playerFunctions";
import "./PlayerGameHistory.css";

function PlayerGameHistory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [player, setPlayer] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [ gamesData, playerData, statsData ] = await Promise.all([
                    playerFunctions.getPlayerGames(id),
                    playerFunctions.getPlayer(id),
                    playerFunctions.getPlayerStats(id)
                ]);
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

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="player-history-page">
            <div className="page-header">
                <h1>{player ? `${player.first_name} ${player.last_name}` : "Player"}</h1>
            </div>
            <button className="btn mb-lg" onClick={() => navigate(-1)}>Back</button>
            {stats && (
                <section className="stats card mb-lg">
                    <h2 className="section-title">Player Stats</h2>
                    <p><strong>Total Games:</strong> {stats.total_games}</p>
                    <p><strong>Success Rate:</strong> {stats.success_rate}</p>
                    <p><strong>Games Won:</strong> {stats.wins}</p>
                    <p><strong>Games Lost:</strong> {stats.losses}</p>
                </section>)
            }
            <section className="game-history">
                <h2 className="section-title">Game History</h2>
                {games.length === 0 ? (
                    <p>No games played yet.</p>
                ) : (
                    <div className="game-list">
                        {games.map((gameItem) => {
                            const game = gameItem.game;
                            if (!game) return null;
                            console.log("game.date_played:",game.date_played);
                            return (
                                <div key={gameItem.id} className="card game-card">
                                    <p><strong>Date:</strong> {game?.date_played ? new Date(game.date_played).toLocaleDateString() : "Unknown Date"}</p>
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
