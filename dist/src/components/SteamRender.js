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
const SteamRender = ({ game }) => {
    const [steamData, setSteamData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://octo-games-metrics.vercel.app' : 'http://localhost:5000';
    (0, react_1.useEffect)(() => {
        const fetchSteamData = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                setLoading(true);
                setError(null);
                const response = yield axios_1.default.get(`${API_BASE_URL}/api/steam-game`, {
                    params: { game }
                });
                if (response.data.error) {
                    setError(response.data.error);
                }
                else {
                    setSteamData(response.data);
                    console.log('Steam Data set:', response.data);
                }
                setLoading(false);
            }
            catch (err) {
                console.error('Error fetching Steam data:', err);
                setError('Ошибка при получении данных со Steam');
                setLoading(false);
            }
        });
        if (game) {
            fetchSteamData();
        }
    }, [game]);
    if (loading) {
        return react_1.default.createElement("p", null, "Loading Steam data...");
    }
    if (error) {
        return react_1.default.createElement("p", null, error);
    }
    return (steamData && (react_1.default.createElement("div", { style: { padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' } },
        react_1.default.createElement("h2", { style: { textAlign: 'center', color: '#3498db', marginBottom: '15px' } },
            "Steam Data for ",
            steamData.gameName),
        react_1.default.createElement("p", null,
            react_1.default.createElement("strong", null, "\u0406\u0434\u0435\u043D\u0442\u0438\u0444\u0456\u043A\u0430\u0442\u043E\u0440 \u0433\u0440\u0438:"),
            " ",
            steamData.gameId),
        react_1.default.createElement("p", null,
            react_1.default.createElement("strong", null, "\u041F\u043E\u0442\u043E\u0447\u043D\u0430 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0433\u0440\u0430\u0432\u0446\u0456\u0432:"),
            " ",
            steamData.currentPlayers),
        react_1.default.createElement("p", null,
            react_1.default.createElement("strong", null, "\u041F\u0456\u0434\u043F\u0438\u0441\u043D\u0438\u043A\u0438 \u0433\u0440\u0438:"),
            " ",
            steamData.followers))));
};
exports.default = SteamRender;
