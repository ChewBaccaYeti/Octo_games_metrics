"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const highcharts_1 = __importDefault(require("highcharts"));
const highcharts_react_official_1 = __importDefault(require("highcharts-react-official"));
const App_1 = require("../App");
const GameChart = ({ data, mentionsData }) => {
    const validData = data
        .map(item => {
        if (!item.date) {
            console.warn('Invalid Date detected:', item.date);
            return null;
        }
        const formattedDate = new Date(item.date);
        if (isNaN(formattedDate.getTime())) {
            console.warn('Invalid Date detected:', item.date);
            return null;
        }
        return Object.assign(Object.assign({}, item), { date: formattedDate.getTime() });
    })
        .filter(item => item !== null);
    const validMentionsData = mentionsData
        .map(item => {
        if (!item.date) {
            console.warn('Invalid Date detected:', item.date);
            return null;
        }
        const formattedDate = new Date(item.date);
        if (isNaN(formattedDate.getTime())) {
            console.warn('Invalid Date detected:', item.date);
            return null;
        }
        return Object.assign(Object.assign({}, item), { date: formattedDate.getTime(), author: item.author, title: item.title, link: item.link });
    })
        .filter(item => item !== null);
    // followersData также фильтруется на наличие допустимых значений
    const followersData = validData.map(item => [item.date, item.followers]);
    const mentionsWithFollowers = (0, App_1.findClosestFollowerCount)(validMentionsData, followersData);
    const options = {
        chart: {
            backgroundColor: '#f0f0f0',
        },
        title: { text: 'Game Metrics' },
        xAxis: { type: 'datetime', title: { text: 'Date' } },
        yAxis: [{ title: { text: 'Number of Followers/Players' } }],
        series: [
            {
                type: 'line',
                name: 'Followers',
                data: validData.map(item => [item.date, item.followers]),
                color: 'rgba(75,192,192,1)',
            },
            {
                type: 'line',
                name: 'Players',
                data: validData.map(item => [item.date, item.players]),
                color: 'rgba(255,99,132,1)',
            },
            {
                type: 'scatter',
                name: 'Mentions',
                data: mentionsWithFollowers.map(item => ({
                    x: item.date, // x должно быть числом
                    y: item.followers, // y также должно быть числом
                    link: item.link,
                    author: item.author,
                    title: item.title
                })),
                color: 'rgba(30, 125, 215, 0.75)',
                lineWidth: 1,
                marker: {
                    symbol: 'square',
                    radius: 5,
                    fillColor: 'rgba(30, 125, 215, 0.75)',
                    lineWidth: 1,
                    lineColor: '#1e7dd7',
                    states: {
                        hover: {
                            enabled: true,
                            lineWidth: 2,
                            lineWidthPlus: 1,
                            lineColor: '#1e7dd7',
                        },
                    }
                },
            }
        ],
        tooltip: {
            useHTML: true,
            shared: true,
            formatter: function () {
                const xValue = this.x ? new Date(this.x).toUTCString() : 'Unknown Date';
                let tooltipText = `<b>${xValue}</b><br/>`;
                const point = this.point;
                if (point && point.link) {
                    tooltipText += `<b>Author:</b> ${point.author}<br/>`;
                    tooltipText += `<b>Title:</b> ${point.title}<br/>`;
                }
                return tooltipText;
            }
        },
        plotOptions: {
            scatter: {
                lineWidth: 1,
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            window.open(this.link, '_blank');
                        }
                    }
                },
                marker: {
                    states: {
                        hover: {
                            enabled: true,
                        }
                    }
                }
            }
        }
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(highcharts_react_official_1.default, { highcharts: highcharts_1.default, options: options })));
};
exports.default = GameChart;
