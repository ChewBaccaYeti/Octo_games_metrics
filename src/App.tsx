import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameChart from './components/GameCharts';
import SearchBar from './components/SearchBar';
import DatePicker from './components/DatePicker';
import { fetchRedditMentions } from './api/reddit';

const App: React.FC = () => {
    const [game, setGame] = useState('');
    const [startDate, setStartDate] = useState('2023-01-01');
    const [endDate, setEndDate] = useState('2023-12-31');
    const [mentionsData, setMentionsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (name: string) => {
        setLoading(true);
        setGame(name);
        try {
            const mentions = await fetchRedditMentions(name, startDate, endDate);
            setMentionsData(mentions || []);
            console.log('Mentions Data:', mentions);
        } catch (error) {
            console.error('Error fetching Reddit mentions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
    }

    return (
        <div>
            <h1>Game Metrics Dashboard</h1>
            <SearchBar onSearch={handleSearch} />
            <DatePicker onDateChange={handleDateChange} />
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <GameChart data={mentionsData.map(post => ({
                    date: post.date,
                    value: 1,
                }))} />
            )}
        </div>
    );
};

export default App;
