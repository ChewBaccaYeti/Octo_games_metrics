import React, { useState, useEffect } from 'react';
import GameChart from './components/GameCharts';
import SearchBar from './components/SearchBar';
import DatePicker from './components/DatePicker';
import RedditRender from './components/RedditRender';
import SteamRender from './components/SteamRender';
import { fetchRedditMentions, getRedditToken } from './api/redditAPI';

interface MentionData {
    date: string;
    mention: string;
    link: string;
    author: string;
    title: string;
}

const App: React.FC = () => {
    const [game, setGame] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [mentionsData, setMentionsData] = useState<MentionData[]>([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [steamData, setSteamData] = useState<any[]>([]);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const fetchedToken = await getRedditToken();
                setToken(fetchedToken);
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
            const mentions = await fetchRedditMentions(name, startDate, endDate);
            const formattedMentions: MentionData[] = mentions.map(post => ({
                date: post.date || '',
                mention: post.title,
                link: post.url,
                author: post.author,
                title: post.title,
            }));
            setMentionsData(formattedMentions);
            console.log('Mentions Data:', formattedMentions);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
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

    const processData = (data: any[]) => {
        return data.map(item => {
            const followers = typeof item.followers === 'string' ? parseInt(item.followers.replace(/,/g, ''), 10) : item.followers;
            const players = typeof item.players === 'string' ? parseInt(item.players.replace(/,/g, ''), 10) : item.players;

            return {
                ...item,
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
                    data={steamData.map((item: any) => ({
                        date: item.date || '',
                        followers: item.followers,
                        players: item.players
                    }))}
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
