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
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("axios"));
const RedditPosts = ({ token, game, startDate, endDate, onMentionsDataChange }) => {
    const [posts, setPosts] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const fetchPosts = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get('http://localhost:5000/api/reddit-search', {
                    params: {
                        token,
                        game,
                        startDate,
                        endDate,
                    },
                });
                setPosts(response.data.data.children); // Сохраняем посты в состоянии
                // Преобразование данных для графика
                const mentionsData = response.data.data.children.map((post) => ({
                    date: new Date(post.data.created_utc * 1000).toISOString(),
                    mention: post.data.title,
                    link: `https://www.reddit.com${post.data.permalink}`,
                    author: post.data.author,
                    title: post.data.title
                }));
                // Передаем данные наверх
                onMentionsDataChange(mentionsData);
            }
            catch (error) {
                console.error('Error fetching posts from Reddit:', error);
            }
        });
        fetchPosts();
    }, [token, game, startDate, endDate]);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", { style: { textAlign: 'center', color: 'rgba(255,99,132,1)', fontSize: '24px', marginBottom: '20px' } },
            "Reddit Posts about ",
            game),
        react_1.default.createElement("ul", { style: { listStyleType: 'none', } }, posts.map((post, index) => (react_1.default.createElement("li", { key: index, style: {
                border: '3px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: '#f0f0f0',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
            } },
            react_1.default.createElement("strong", null, "Author:"),
            " ",
            post.data.author,
            " ",
            react_1.default.createElement("br", null),
            react_1.default.createElement("strong", null, "Title:"),
            " ",
            post.data.title,
            " ",
            react_1.default.createElement("br", null),
            react_1.default.createElement("strong", null, "Selftext:"),
            " ",
            post.data.selftext ? post.data.selftext : 'No content',
            " ",
            react_1.default.createElement("br", null),
            react_1.default.createElement("a", { href: `https://www.reddit.com${post.data.permalink}`, target: "_blank", rel: "noopener noreferrer", style: { color: '#1e7dd7', textDecoration: 'none', fontWeight: 'bold' } }, "View on Reddit")))))));
};
exports.default = RedditPosts;
