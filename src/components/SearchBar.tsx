import React, { useState } from 'react';
import axios from 'axios';
import { SearchBarProps } from '../types';

const SearchBar: React.FC<SearchBarProps> = ({ onRedditSearch, onSteamSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        if (onSteamSearch) {
            try {
                // Запрос к Steam API через сервер
                const response = await axios.get(`/api/steam-game`, {
                    params: {
                        game: searchTerm
                    }
                });

                const { parsedGameId, gameName, currentPlayers, followers } = response.data;

                console.log(`ID игры (parsed): ${parsedGameId}`);
                console.log(`Имя игры: ${gameName}`);
                console.log(`Игроки: ${currentPlayers}`);
                console.log(`Подписчики: ${followers}`);
                // Вызываем коллбек для Steam, если он предоставлен
                onSteamSearch?.({
                    parsedGameId,
                    gameName,
                    currentPlayers,
                    followers
                });
            } catch (error) {
                console.error('Ошибка при поиске игры в Steam:', error);
            }
        }
        // Поиск через Reddit API
        onRedditSearch(searchTerm);
    };

    return (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f0f0f0' }}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Roll the dice"
                style={{ marginRight: '10px' }}
            />
            <button onClick={handleSearch} style={{ padding: '5px 10px' }}>Пошук</button>
        </div>
    );
};

export default SearchBar;
