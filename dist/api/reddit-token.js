import axios from 'axios';
import qs from 'qs';

// Условная загрузка dotenv только в dev-среде
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}

export default async (req, res) => {
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
};
