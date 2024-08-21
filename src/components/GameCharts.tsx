import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GameChartProps {
    data: Array<{ date: string; value: number }>;
}

const GameChart: React.FC<GameChartProps> = ({ data }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!data || data.length === 0) return;

        const svg = d3.select(ref.current);
        svg.selectAll('*').remove(); // Очищаем предыдущие графики

        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value) as number])
            .range([height, 0]);

        const line = d3.line<{ date: string; value: number }>()
            .x(d => x(new Date(d.date)))
            .y(d => y(d.value));

        svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .call(d3.axisLeft(y));

        svg.append('g')
            .attr('transform', `translate(${margin.left},${height + margin.top})`)
            .call(d3.axisBottom(x));

        svg.append('path')
            .datum(data)
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', line);
    }, [data]);

    return <svg ref={ref} width={800} height={400}></svg>;
};

export default GameChart;
