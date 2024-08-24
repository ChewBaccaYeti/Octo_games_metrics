import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface MentionData {
    date: string;
    mention: string;
    link: string;
    author: string;
    title: string;
}

interface GameChartProps {
    data: { date: string; followers: number; players: number }[];
    mentionsData: MentionData[];
}

const GameChart: React.FC<GameChartProps> = ({ data, mentionsData }) => {
    const validData = data.map(item => {
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
    }).filter(item => item !== null);

    const validMentionsData = mentionsData.map(item => {
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
            date: formattedDate.getTime(),
            author: item.author,
            title: item.title,
            link: item.link
        };
    }).filter(item => item !== null);

    const options: Highcharts.Options = {
        title: {
            text: 'Game Metrics'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date'
            }
        },
        yAxis: [
            {
                title: {
                    text: 'Number of Followers/Players'
                }
            }
        ],
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
                data: validMentionsData.map(item => ({
                    x: item.date,
                    y: 0,
                    link: item.link,
                    author: item.author,
                    title: item.title
                })),
                color: 'rgba(30, 125, 215, 0.75)',
                marker: {
                    symbol: 'square',
                    radius: 5
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
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            window.open((this as any).link, '_blank');
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
