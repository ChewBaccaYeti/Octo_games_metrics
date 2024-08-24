import React, { useState, useEffect } from 'react';
import GameChart from './components/GameCharts';
import SearchBar from './components/SearchBar';
import DatePicker from './components/DatePicker';
import RedditRender from './components/RedditRender';
import SteamRender from './components/SteamRender';
import { fetchRedditMentions, getRedditToken } from './api/redditAPI';

const App: React.FC = () => {
    const [game, setGame] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [mentionsData, setMentionsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [steamData, setSteamData] = useState<any>(null);

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
            const mentions = await fetchRedditMentions(name, startDate, endDate);
            setMentionsData(mentions || []);
            console.log('Mentions Data:', mentions);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
    };

    const handleSteamSearch = (data: any) => {
        console.log('Steam Data:', data);
        if (Array.isArray(data)) {
            setSteamData(data);
        } else {
            setSteamData([data]); // Преобразуем в массив, если это не массив
        }
    };

    return (
        <div>
            <h1>Game Metrics Dashboard</h1>
            <SearchBar
                onRedditSearch={handleSearch}
                onSteamSearch={handleSteamSearch}
            />
            <DatePicker onDateChange={handleDateChange} />
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <GameChart
                    data={steamData ? steamData.map((item: any) => ({
                        date: item.date,
                        followers: Number(item.followers.replace(/,/g, ''))
                    })) : []}
                    mentionsData={mentionsData.map(post => ({
                        date: post.date,
                        mention: post.title,
                        link: post.link,
                    }))}
                />
            )}
            {token && (
                <RedditRender token={token} game={game} startDate={startDate} endDate={endDate} />
            )}
            {game && (
                <SteamRender game={game} startDate={startDate} endDate={endDate} />
            )}
        </div>
    );
};

export default App;
