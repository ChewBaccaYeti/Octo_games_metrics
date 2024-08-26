import { getGameIdByName, fetchSteamData } from './steamDB';

// Условная загрузка dotenv только в dev-среде
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}

export default async (req, res) => {
    const { game } = req.query;

    try {
        let gameId;
        if (isNaN(game)) {
            gameId = await getGameIdByName(game);
        } else {
            gameId = game;
        }

        const gameData = await fetchSteamData(gameId);
        res.set('Content-Type', 'application/json');
        res.json(gameData);

    } catch (error) {
        console.error('Error fetching game data:', error);
        res.status(500).send('Error fetching game data');
    }
};
