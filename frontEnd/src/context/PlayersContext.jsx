import {createContext, useContext, useState, useEffect} from "react";
import playerFunctions from "../api/playerFunctions";

const PlayersContext = createContext();

export function PlayersProvider({ children }) {
    const [players, setPlayers] = useState([]);

    const refreshPlayers = async () => {
        try {
            const data = await playerFunctions.getAllPlayers();
            setPlayers(data);
        } catch (err) {
            console.error("Failed to load players:", err);
        }
    };

    useEffect(() => {
        async function fetchAllPlayers() {
            refreshPlayers();
        }
        fetchAllPlayers();
    }, []);

    return (
        <PlayersContext.Provider value={{ players, setPlayers, refreshPlayers }}>
            {children}
        </PlayersContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayers() {
    return useContext(PlayersContext);
}