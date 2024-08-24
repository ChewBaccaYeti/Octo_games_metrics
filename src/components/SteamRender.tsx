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

const SteamRender: React.FC<SteamRenderProps> = ({ game, startDate, endDate }) => {
    const [steamData, setSteamData] = useState<SteamData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSteamData = async () => {
            try {
                setLoading(true);
                setError(null);
    
                const response = await axios.get(`http://localhost:5000/api/steam-game`, {
                    // headers: {
                    //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    //     'Accept-Encoding': 'gzip, deflate, br, zstd',
                    //     'Accept-Language': 'en-US,en;q=0.9',
                    //     'Cache-Control': 'max-age=0',
                    //     'Connection': 'keep-alive',
                    //     'Host': 'steamdb.info',
                    //     'Referer': 'https://steamdb.info/',
                    //     'Sec-Fetch-Dest': 'document',
                    //     'Sec-Fetch-Mode': 'navigate',
                    //     'Sec-Fetch-Site': 'same-origin',
                    //     'Sec-Fetch-User': '?1',
                    //     'Upgrade-Insecure-Requests': '1',
                    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                    // },
                    params: { game }
                });
    
                console.log('Steam API response:', response.data); // Добавленный лог для проверки данных
    
                if (response.data.error) {
                    setError(response.data.error);
                } else {
                    setSteamData(response.data);
                    console.log('Steam Data set:', response.data);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching Steam data:', err); // Лог ошибки
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
