import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SteamRenderProps {
    game: string;
    startDate: string;
    endDate: string;
}

interface SteamData {
    gameId: string;
    gameName: string;
    currentPlayers: string;
    followers: string;
}

const SteamRender: React.FC<SteamRenderProps> = ({ game }) => {
    const [steamData, setSteamData] = useState<SteamData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSteamData = async () => {
            try {
                setLoading(true);
                setError(null);
    
                const response = await axios.get(`http://localhost:5000/api/steam-game`, {
                    params: { game }
                });
        
                if (response.data.error) {
                    setError(response.data.error);
                } else {
                    setSteamData(response.data);
                    console.log('Steam Data set:', response.data);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching Steam data:', err);
                setError('Ошибка при получении данных со Steam');
                setLoading(false);
            }
        };

        if (game) {
            fetchSteamData();
        }
    }, [game]);
    

    if (loading) {
        return <p>Loading Steam data...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        steamData && (
            <div>
                <h2>Steam Data for {steamData.gameName}</h2>
                <p><strong>Идентификатор игры:</strong> {steamData.gameId}</p>
                <p><strong>Текущее количество игроков:</strong> {steamData.currentPlayers}</p>
                <p><strong>Подписчики:</strong> {steamData.followers}</p>
            </div>
        )
    );
};

export default SteamRender;
