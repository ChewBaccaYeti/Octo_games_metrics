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
const SearchBar = ({ onRedditSearch, onSteamSearch }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://octo-games-metrics.vercel.app' : 'http://localhost:5000';
    const handleSearch = () => __awaiter(void 0, void 0, void 0, function* () {
        if (onSteamSearch) {
            try {
                // Запрос к Steam API через сервер
                const response = yield axios_1.default.get(`${API_BASE_URL}/api/steam-game`, {
                    params: {
                        game: searchTerm
                    }
                });
                const { parsedGameId, gameName, currentPlayers, followers } = response.data;
                console.log(`ID игры (parsed): ${parsedGameId}`);
                console.log(`Имя игры: ${gameName}`);
                console.log(`Игроки: ${currentPlayers}`);
                console.log(`Подписчики: ${followers}`);
                // Вызываем коллбек для Steam, если он предоставлен
                onSteamSearch === null || onSteamSearch === void 0 ? void 0 : onSteamSearch({
                    parsedGameId,
                    gameName,
                    currentPlayers,
                    followers
                });
            }
            catch (error) {
                console.error('Ошибка при поиске игры в Steam:', error);
            }
        }
        // Поиск через Reddit API
        onRedditSearch(searchTerm);
    });
    return (react_1.default.createElement("div", { style: { marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f0f0f0' } },
        react_1.default.createElement("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Roll the dice", style: { marginRight: '10px' } }),
        react_1.default.createElement("button", { onClick: handleSearch, style: { padding: '5px 10px' } }, "\u041F\u043E\u0448\u0443\u043A")));
};
exports.default = SearchBar;
