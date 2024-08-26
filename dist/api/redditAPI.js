"use strict";
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
exports.fetchRedditMentions = exports.getRedditToken = void 0;
const axios_1 = __importDefault(require("axios"));
const getRedditToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post('/api/reddit-token');
    return response.data.token;
});
exports.getRedditToken = getRedditToken;
const fetchRedditMentions = (game_1, startDate_1, endDate_1, ...args_1) => __awaiter(void 0, [game_1, startDate_1, endDate_1, ...args_1], void 0, function* (game, startDate, endDate, maxResults = 100 // Параметр для максимального количества результатов
) {
    const token = yield (0, exports.getRedditToken)();
    let allMentions = [];
    let after = null;
    try {
        do {
            const response = yield axios_1.default.get('/api/reddit-search', {
                params: {
                    token,
                    game,
                    startDate,
                    endDate,
                    limit: 100, // Устанавливаем лимит в 100 объектов за запрос
                    after
                },
            });
            console.log('Reddit API Response:', response.data);
            const mentions = response.data.data.children.map((post) => {
                const postDate = new Date(post.data.created_utc * 1000);
                if (isNaN(postDate.getTime())) {
                    console.error('Invalid date:', post.data.created_utc);
                    return null;
                }
                // Фильтрация по диапазону дат
                const start = new Date(startDate).getTime();
                const end = new Date(endDate).getTime();
                if (postDate.getTime() < start || postDate.getTime() > end) {
                    return null;
                }
                return {
                    date: postDate.toISOString(),
                    author: post.data.author,
                    title: post.data.title,
                    url: `https://www.reddit.com${post.data.permalink}`,
                };
            }).filter((item) => item !== null); // Фильтруем null значения
            allMentions = allMentions.concat(mentions);
            after = response.data.data.after; // Получаем значение "after" для следующей пагинации
        } while (after && allMentions.length < maxResults);
        console.log(`Mentions fetched, total: ${allMentions.length}`);
        return allMentions.slice(0, maxResults); // Ограничиваем количество результатов до maxResults
    }
    catch (error) {
        console.error('Error fetching data from Reddit:', error);
        return [];
    }
});
exports.fetchRedditMentions = fetchRedditMentions;
