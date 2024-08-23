const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

// localhost Steam Web API key (testing, precisely)
// const STEAM_API_KEY = '7248AA85AE460F450F55C9305C567217';

// Функция для поиска ID игры по названию
async function getGameIdByName(gameName) {
    const url = `https://api.steampowered.com/ISteamApps/GetAppList/v2/`;

    try {
        const response = await axios.get(url);
        const apps = response.data.applist.apps;

        // Поиск по названию (с учетом регистра)
        const game = apps.find(app => app.name.toLowerCase() === gameName.toLowerCase());
        if (game) {
            return game.appid;
        } else {
            throw new Error('Игра не найдена');
        }
    } catch (error) {
        console.error(`Ошибка при поиске игры: ${error}`);
        throw error;
    }
}

async function fetchSteamData(gameId) {
    const url = `https://steamdb.info/app/${gameId}/charts/`;
    console.log(`Запрос к URL: ${url}`);

    const headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'cookie': '__cf_bm=iFP1wxH9RKbhvsgyOweQ5AplHHLTiJMewM0YFbqiptE-1724402856-1.0.1.1-ZasU8joSLYNTS6obugggDZdX_Tx2xVRgBHcZvPlLPHZFdU4W_zphsrFcXZM16dAkYA.5N7Lqpvm7caiksntRog; cf_clearance=IzpJAXgsY4zfz5yTqJyVKw0E1bjSotS7.lAjDKQgCUg-1724402857-1.2.1.1-GmgZRBEPUlvdF4MvwQFv93v6u3he.XZ485CDccIOrcXQ3yZvQmaklyEVEaN3N5esMzfF5bq5kUhjYEh6lmzUhBWsypRQ8ZYQyh.8_VsuyPDWLFuG42RSIl6jrAbazQu.cnLywNowY16UQYConAELDCE7dlfRtK0SZtfpWZeUA7lTI_21yZo3W3d3IQ_U_9dmsP6srKt.rGWEkzdRFD8.tZQi5Fo_kUrsJQEf2oYDyhNQ2JGSQgxnxIMeWlGzT080WaiEQMgsOef0KDcP44tVDHMn2zdWA0k36xPxuTYHvDyv4TBOOTZEMxwAc.SaoSakSrBcdWlmMLU6hhd1Mh1KbUBWF4OUiCpk3D_kuq6Of3_SKRotz7UpiCWShY.NlT9Q',
        'dnt': '1',
        'referer': 'https://steamdb.info/',
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    };

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Устанавливаем заголовки
        await page.setExtraHTTPHeaders(headers);

        // Переходим на нужную страницу
        await page.goto(url);

        // Ждем пока все данные загрузятся
        await page.waitForSelector('h1[itemprop="name"]');
        console.log('Страница загружена, начинаем парсинг данных.');

        // Получение HTML страницы
        const content = await page.content();

        // Закрытие браузера
        await browser.close();

        // Обработка содержимого страницы
        return parseBody(content, gameId);

    } catch (error) {
        console.error(`Ошибка при загрузке страницы: ${error}`);
        throw error;
    }
}

function parseBody(html, passedGameId) {
    const $ = cheerio.load(html);

    const parsedGameId = $('div.row.app-row td').filter(function () {
        return $(this).text().trim() === 'App ID';
    }).next().text().trim();
    const gameName = $('h1[itemprop="name"]').text().trim();
    const currentPlayers = $('ul.app-chart-numbers-big li strong').first().text().trim();
    const followers = $('ul.app-chart-numbers li strong').first().text().trim();

    const gameData = {
        parsedGameId,
        gameName,
        currentPlayers,
        followers
    };

    console.log(`ID игры (parsed): ${parsedGameId}, (passed): ${passedGameId}`);
    console.log(`Имя игры: ${gameName}`);
    console.log(`Игроки: ${currentPlayers}`);
    console.log(`Подписчики: ${followers}`);
    console.log('Данные об игре:', gameData);

    return gameData;
}

// Получение аргумента (названия или ID игры) из командной строки
const userInput = process.argv[2]; // Используем второй аргумент как название или ID игры

if (!userInput) {
    console.error('Пожалуйста, укажите название или ID игры в качестве аргумента.');
    process.exit(1);
}

(async () => {
    try {
        let gameId;
        if (isNaN(userInput)) {
            // Если введено название, ищем ID игры
            gameId = await getGameIdByName(userInput);
        } else {
            // Если введен ID, используем его напрямую
            gameId = userInput;
        }

        fetchSteamData(gameId, (error) => {
            if (error) {
                console.error('Ошибка при получении данных:', error);
            } else {
                console.log('Данные успешно получены.');
            }
        });

    } catch (error) {
        console.error('Не удалось найти игру:', error);
    }
})();

module.exports = { getGameIdByName, fetchSteamData };