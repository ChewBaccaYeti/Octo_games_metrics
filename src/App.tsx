import React, { useState, useEffect } from 'react';
import GameChart from './components/GameCharts';
import SearchBar from './components/SearchBar';
import DatePicker from './components/DatePicker';
import RedditRender from './components/RedditRender';
import SteamRender from './components/SteamRender';
import { MentionData, FollowerData } from './types';
import axios from 'axios';

export const findClosestFollowerCount = (
    mentionsData: MentionData[],
    followersData: [number, number][]
) => {
    return mentionsData.map(mention => {
        const mentionDate = new Date(mention.date).getTime();
        // Проверяем, что followersData не пустой массив
        if (followersData.length === 0) {
            console.warn('Followers data is empty, returning mention with default followers count.');
            return {
                ...mention,
                date: mentionDate,  // дата в виде Unix timestamp
                followers: 0, // или другое значение по умолчанию
            };
        }

        // Находим ближайшую дату подписчиков к дате упоминания
        let closest = followersData.reduce((prev, curr) => {
            return Math.abs(curr[0] - mentionDate) < Math.abs(prev[0] - mentionDate) ? curr : prev;
        }, followersData[0]); // Добавляем начальное значение

        return {
            ...mention,
            date: mentionDate,
            followers: closest[1],
        };
    });
};

const App: React.FC = () => {
    const [game, setGame] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [mentionsData, setMentionsData] = useState<MentionData[]>([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [steamData, setSteamData] = useState<FollowerData[]>([]);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.post('/api/reddit-token');
                setToken(response.data.token);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        fetchToken();
    }, []);

    const handleSearch = async (name: string) => {
        setLoading(true);
        setGame(name);
        try {
            // Используем выбранные даты из состояния
            const response = await axios.get('/api/reddit-search', {
                params: {
                    token,
                    game: name,
                    startDate,
                    endDate,
                },
            });

            const mentions = response.data.data.children.map((post: any) => ({
                date: new Date(post.data.created_utc * 1000).getTime(),
                mention: post.data.title,
                link: `https://reddit.com${post.data.permalink}`,
                author: post.data.author,
                title: post.data.title,
            }));

            setMentionsData(mentions);
            console.log('Mentions Data:', mentions);

            // Вызовите функцию для получения данных о подписчиках из SteamDB API
            fetchSteamFollowersData(name);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSteamFollowersData = async (gameName: string) => {
        try {
            const response = await axios.get('/api/steam-game', {
                params: { game: gameName },
            });
    
            const followers = response.data.followers;
    
            // Проверяем, является ли followers массивом
            if (Array.isArray(followers)) {
                const followersData = followers.map((follower: any) => {
                    const date = new Date(follower.date).getTime();
                    if (isNaN(date)) {
                        console.warn('Invalid date detected:', follower.date);
                        return null; // или что-то вроде этого, чтобы пропустить неверные данные
                    }
    
                    return {
                        date: date, // Преобразуем дату в формат времени
                        followers: follower.count || 0,
                        players: follower.players || 0, // Учитываем, если есть данные по игрокам
                    };
                }).filter(item => item !== null); // убираем null элементы
    
                setSteamData(followersData);
                console.log('Fetched Followers Data:', followersData);
            } else if (typeof followers === 'string') {
                // Обработка строки followers как числа
                const followersCount = parseInt(followers.replace(/,/g, ''), 10);
    
                if (isNaN(followersCount)) {
                    console.error('Invalid followers count:', followers);
                    return;
                }
    
                // Создаем данные для графика с только одной точкой
                const followersData = [{
                    date: new Date().getTime(), // Здесь можно использовать текущую дату или другую, соответствующую дате получения данных
                    followers: followersCount,
                    players: 0 // Если данных о количестве игроков нет
                }];
    
                setSteamData(followersData);
                console.log('Fetched Followers Data (from string):', followersData);
            } else {
                console.error('Followers data is not an array or a valid string:', followers);
            }
    
        } catch (error) {
            console.error('Error fetching followers data:', error);
        }
    };
    
    const handleDateChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        
        if (game) {
            handleSearch(game);
        }
    };

    const handleSteamSearch = (data: any) => {
        console.log('Steam Data:', data);
        if (Array.isArray(data)) {
            setSteamData(processData(data));
        } else {
            setSteamData(processData([data]));
        }
    };

    const processData = (data: any[]): FollowerData[] => {
        return data.map((item: any): FollowerData => {
            const followers = typeof item.followers === 'string' ? parseInt(item.followers.replace(/,/g, ''), 10) : item.followers;
            const players = typeof item.players === 'string' ? parseInt(item.players.replace(/,/g, ''), 10) : item.players;
    
            return {
                date: new Date(item.date).getTime(), // Преобразуем дату в формат времени
                followers: followers || 0,
                players: players || 0
            };
        });
    };    

    return (
        <div>
            <h1>Game Metrics Dashboard</h1>
            <SearchBar
                onRedditSearch={handleSearch}
                onSteamSearch={handleSteamSearch}
            />
            <DatePicker onDateChange={handleDateChange} />
            {game && (
                <SteamRender game={game} startDate={startDate} endDate={endDate} />
            )}
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <GameChart
                    data={steamData}
                    mentionsData={mentionsData}
                />
            )}
            {token && (
                <RedditRender 
                    token={token} 
                    game={game} 
                    startDate={startDate} 
                    endDate={endDate}
                    onMentionsDataChange={setMentionsData} 
                />
            )}
        </div>
    );
};

export default App;
