import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface GameChartProps {
    data: { date: string; followers: number }[];
    mentionsData: { date: string; mention: string; link: string }[];
}

const GameChart: React.FC<GameChartProps> = ({ data, mentionsData }) => {
    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: 'Followers',
                data: data.map(item => item.followers),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.5)',
                fill: false,
                tension: 0.1,
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(30, 125, 215, 0.75)',
                pointBorderColor: 'rgba(0,0,0,1)',
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'rgba(210, 50, 50, 0.9)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                yAxisID: 'y',
                type: 'line' as const, // Убедитесь, что тип данных задан как "line"
            },
            {
                label: 'Mentions',
                data: mentionsData.map(item => ({ x: item.date, y: 0 })), // Используем y: 0, чтобы точки отображались на оси X
                pointBackgroundColor: 'rgba(255,99,132,1)',
                pointBorderColor: 'rgba(0,0,0,1)',
                pointRadius: 5,
                showLine: false,
                type: 'scatter' as const, // Явно задаем тип "scatter"
            }
        ],
    };

    console.log('Chart Data:', chartData); // Проверка данных

    const options = {
        scales: {
            x: {
                type: 'category' as const,
                labels: data.map(item => new Date(item.date).toLocaleDateString()), // Форматирование даты
            },
            y: {
                beginAtZero: true,
                type: 'linear' as const,
                position: 'left' as const,
            },
        },

        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        if (tooltipItem.dataset.label === 'Mentions') {
                            const mention = mentionsData[tooltipItem.dataIndex];
                            return `${mention.mention} (${mention.date}) - ${mention.link}`;
                        }
                        return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <h2>Game Metrics</h2>
            <Line data={chartData as any} options={options} />
        </div>
    );
};

export default GameChart;
