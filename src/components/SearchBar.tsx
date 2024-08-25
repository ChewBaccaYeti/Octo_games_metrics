import React, { useState } from 'react';
import axios from 'axios';
import { SearchBarProps } from '../types';

const SearchBar: React.FC<SearchBarProps> = ({ onRedditSearch, onSteamSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        if (onSteamSearch) {
            try {
                // Запрос к Steam API через сервер
                const response = await axios.get(`http://localhost:5000/api/steam-game`, {
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
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Roll the dice"
            />
            <button onClick={handleSearch}>Поиск</button>
        </div>
    );
};

export default SearchBar;
