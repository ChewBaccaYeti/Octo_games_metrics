"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClosestFollowerCount = void 0;
const react_1 = __importStar(require("react"));
const GameCharts_1 = __importDefault(require("./components/GameCharts"));
const SearchBar_1 = __importDefault(require("./components/SearchBar"));
const DatePicker_1 = __importDefault(require("./components/DatePicker"));
const RedditRender_1 = __importDefault(require("./components/RedditRender"));
const SteamRender_1 = __importDefault(require("./components/SteamRender"));
const axios_1 = __importDefault(require("axios"));
const findClosestFollowerCount = (mentionsData, followersData) => {
    return mentionsData.map(mention => {
        const mentionDate = new Date(mention.date).getTime();
        // Проверяем, что followersData не пустой массив
        if (followersData.length === 0) {
            console.warn('Followers data is empty, returning mention with default followers count.');
            return Object.assign(Object.assign({}, mention), { date: mentionDate, followers: 0 });
        }
        // Находим ближайшую дату подписчиков к дате упоминания
        let closest = followersData.reduce((prev, curr) => {
            return Math.abs(curr[0] - mentionDate) < Math.abs(prev[0] - mentionDate) ? curr : prev;
        }, followersData[0]); // Добавляем начальное значение
        return Object.assign(Object.assign({}, mention), { date: mentionDate, followers: closest[1] });
    });
};
exports.findClosestFollowerCount = findClosestFollowerCount;
const App = () => {
    const [game, setGame] = (0, react_1.useState)('');
    const [startDate, setStartDate] = (0, react_1.useState)('');
    const [endDate, setEndDate] = (0, react_1.useState)('');
    const [mentionsData, setMentionsData] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [token, setToken] = (0, react_1.useState)(null);
    const [steamData, setSteamData] = (0, react_1.useState)([]);
    const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://octo-games-metrics.vercel.app' : 'http://localhost:5000';
    (0, react_1.useEffect)(() => {
        const fetchToken = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${API_BASE_URL}/api/reddit-token`);
                setToken(response.data.token);
            }
            catch (error) {
                console.error('Error fetching token:', error);
            }
        });
        fetchToken();
    }, []);
    const handleSearch = (name) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setGame(name);
        try {
            // Используем выбранные даты из состояния
            const response = yield axios_1.default.get(`${API_BASE_URL}/api/reddit-search`, {
                params: {
                    token,
                    game: name,
                    startDate,
                    endDate,
                },
            });
            const mentions = response.data.data.children.map((post) => ({
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
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const fetchSteamFollowersData = (gameName) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${API_BASE_URL}/api/steam-game`, {
                params: { game: gameName },
            });
            const followers = response.data.followers;
            // Проверяем, является ли followers массивом
            if (Array.isArray(followers)) {
                const followersData = followers.map((follower) => {
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
            }
            else if (typeof followers === 'string') {
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
            }
            else {
                console.error('Followers data is not an array or a valid string:', followers);
            }
        }
        catch (error) {
            console.error('Error fetching followers data:', error);
        }
    });
    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        if (game) {
            handleSearch(game);
        }
    };
    const handleSteamSearch = (data) => {
        console.log('Steam Data:', data);
        if (Array.isArray(data)) {
            setSteamData(processData(data));
        }
        else {
            setSteamData(processData([data]));
        }
    };
    const processData = (data) => {
        return data.map((item) => {
            const followers = typeof item.followers === 'string' ? parseInt(item.followers.replace(/,/g, ''), 10) : item.followers;
            const players = typeof item.players === 'string' ? parseInt(item.players.replace(/,/g, ''), 10) : item.players;
            return {
                date: new Date(item.date).getTime(), // Преобразуем дату в формат времени
                followers: followers || 0,
                players: players || 0
            };
        });
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, "Game Metrics Dashboard"),
        react_1.default.createElement(SearchBar_1.default, { onRedditSearch: handleSearch, onSteamSearch: handleSteamSearch }),
        react_1.default.createElement(DatePicker_1.default, { onDateChange: handleDateChange }),
        game && (react_1.default.createElement(SteamRender_1.default, { game: game, startDate: startDate, endDate: endDate })),
        loading ? (react_1.default.createElement("p", null, "Loading data...")) : (react_1.default.createElement(GameCharts_1.default, { data: steamData, mentionsData: mentionsData })),
        token && (react_1.default.createElement(RedditRender_1.default, { token: token, game: game, startDate: startDate, endDate: endDate, onMentionsDataChange: setMentionsData }))));
};
exports.default = App;
