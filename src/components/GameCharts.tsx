import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { findClosestFollowerCount } from '../App';
import { MentionData, GameChartProps } from '../types';

const GameChart: React.FC<GameChartProps> = ({ data, mentionsData }) => {
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
            return {
                ...item,
                date: formattedDate.getTime()
            };
        })
        .filter(item => item !== null) as { date: number; followers: number; players: number }[];

    const validMentionsData: MentionData[] = mentionsData
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
            return {
                ...item,
                date: formattedDate.getTime(), // Преобразуем дату в Unix timestamp
                author: item.author,
                title: item.title,
                link: item.link
            };
        })
        .filter(item => item !== null) as MentionData[];

    // followersData также фильтруется на наличие допустимых значений
    const followersData = validData.map(item => [item.date, item.followers] as [number, number]);

    const mentionsWithFollowers = findClosestFollowerCount(validMentionsData, followersData);

    const options: Highcharts.Options = {
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

                const point = this.point as any;

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
                            window.open((this as any).link, '_blank');
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

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default GameChart;
