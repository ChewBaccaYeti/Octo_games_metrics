import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';

dotenv.config();

const MY_APP = 'Octo_games_metrics';

export default async (req, res) => {
    const { token, game, startDate, endDate, limit = 100, after = null } = req.query;
    const afterTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const beforeTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    const query = qs.stringify({
        q: game,
        restrict_sr: true,
        sort: 'new',
        t: 'all',
        after: afterTimestamp,
        before: beforeTimestamp,
        limit,
        after
    });

    try {
        const response = await axios.get(`https://oauth.reddit.com/r/gaming/search.json?${query}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'User-Agent': MY_APP, // Используем переменную MY_APP
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching Reddit mentions:', error);
        res.status(500).send('Error fetching Reddit mentions');
    }
};
