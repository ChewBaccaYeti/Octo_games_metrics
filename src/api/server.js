const express = require('express');
const axios = require('axios');
const qs = require('qs');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
const port = 5000;
const MY_APP = 'Octo_games_metrics';

dotenv.config();

app.use(cors());
app.use(express.json());

app.post('/api/reddit-token', async (req, res) => {
    try {
        const auth = Buffer
            .from(`${process.env.REACT_APP_REDDIT_CLIENT_ID}:${process.env.REACT_APP_REDDIT_CLIENT_SECRET}`)
            .toString('base64');

        const tokenResponse = await axios.post(
            'https://www.reddit.com/api/v1/access_token',
            qs.stringify({
                grant_type: 'client_credentials',
            }),
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        res.json({ token: tokenResponse.data.access_token });
    } catch (error) {
        console.error('Error fetching Reddit access token:', error);
        res.status(500).send('Error fetching Reddit access token');
    }
});

app.get('/api/reddit-search', async (req, res) => {
    const { token, game, startDate, endDate } = req.query;
    const after = Math.floor(new Date(startDate).getTime() / 1000);
    const before = Math.floor(new Date(endDate).getTime() / 1000);

    console.log(`Start Date (after): ${after}, End Date (before): ${before}`);
    console.log(`Searching for game: ${game} from ${startDate} to ${endDate}`);

    const query = qs.stringify({
        q: game,
        restrict_sr: true,
        sort: 'new',
        t: 'all',
        after,
        before
    });

    console.log(`Reddit API Query: ${query}`);

    try {
        const response = await axios.get(`https://oauth.reddit.com/r/gaming/search.json?${query}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'User-Agent': MY_APP,
            },
        });

        console.log('Reddit API Response:', response.data);

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching Reddit mentions:', error);
        res.status(500).send('Error fetching Reddit mentions');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
