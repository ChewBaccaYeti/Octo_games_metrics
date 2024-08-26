const express = require('express');
const axios = require('axios');
const qs = require('qs');
const dotenv = require('dotenv');
const cors = require('cors');
const { getGameIdByName, fetchSteamData } = require('./steamDB');

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
        console.log('Encoded Auth:', auth); // для проверки правильности кодирования

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
        console.log('Reddit Access Token:', tokenResponse.data.access_token); // для проверки полученного токена

        res.json({ token: tokenResponse.data.access_token });
    } catch (error) {
        console.error('Error fetching Reddit access token:', error);
        res.status(500).send('Error fetching Reddit access token');
    }
});

app.get('/api/reddit-search', async (req, res) => {
    const { token, game, startDate, endDate, limit = 100, after = null } = req.query; // Получаем параметры limit и after
    const afterTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const beforeTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    console.log(`Start Date (after): ${afterTimestamp}, End Date (before): ${beforeTimestamp}`);
    console.log(`Searching for game: ${game} from ${startDate} to ${endDate}`);

    const query = qs.stringify({
        q: game,
        restrict_sr: true,
        sort: 'new',
        t: 'all',
        after: afterTimestamp,
        before: beforeTimestamp,
        limit, // Добавляем параметр limit
        after // Добавляем параметр after для пагинации
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

// Добавляем новый маршрут для поиска данных по игре
app.get('/api/steam-game', async (req, res) => {
    const { game } = req.query;

    try {
        let gameId;
        if (isNaN(game)) {
            console.log(`Поиск ID для игры: ${game}`);
            gameId = await getGameIdByName(game);
            console.log(`Найден ID игры: ${gameId}`);
        } else {
            gameId = game;
            console.log(`Используется ID игры: ${gameId}`);
        }

        const gameData = await fetchSteamData(gameId);
        console.log('Отправка данных на клиент:', gameData);
        res.set('Content-Type', 'application/json');
        res.json(gameData);

    } catch (error) {
        console.error('Error fetching game data:', error);
        res.status(500).send('Error fetching game data');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
