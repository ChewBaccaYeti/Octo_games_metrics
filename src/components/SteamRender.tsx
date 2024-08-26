import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SteamData, SteamRenderProps } from '../types';

const SteamRender: React.FC<SteamRenderProps> = ({ game }) => {
    const [steamData, setSteamData] = useState<SteamData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSteamData = async () => {
            try {
                setLoading(true);
                setError(null);
    
                const response = await axios.get(`/api/steam-game`, {
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
            <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#3498db', marginBottom: '15px' }}>
                Steam Data for {steamData.gameName}
            </h2>
                <p><strong>Ідентифікатор гри:</strong> {steamData.gameId}</p>
                <p><strong>Поточна кількість гравців:</strong> {steamData.currentPlayers}</p>
                <p><strong>Підписники гри:</strong> {steamData.followers}</p>
            </div>
        )
    );
};

export default SteamRender;
