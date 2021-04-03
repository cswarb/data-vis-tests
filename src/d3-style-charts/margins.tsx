import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

export default () => {
    const ref = useRef<any>();
    const data = [['01', 1], ['02', 2], ['03', 3], ['04', 4], ['05', 5]];

    useEffect(() => {
        const svg = d3.select<any, any>(ref.current);
        const yScale = d3.scaleLinear<any, any, any>()
            .domain([0, 5])
            .range([125, 0]);

        const xScale = d3.scaleBand<any>()
            .domain([...data.map(d => d[0])])
            .range([0, 1000]).paddingInner(0.02);
            
        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale);

        // yAxis(svg.append('g'));
        svg.append('g').call(yAxis.ticks(5))
        xAxis(svg.append('g').attr("transform", `translate(0, ${125})`));

        const enterTransition = (enter: any): any => {
            enter.transition()
                .delay((d: any, i: number) => i * 200)
                .duration(500)
                .attr('opacity', 1)
                .attr('height', (d: any) => {
                    return 125 - yScale(d[1]);
                });
        }

        svg.selectAll('rect')
            .data(data, (d: any) => d)
            .join((enter: any) => {
                const et = enter
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('width', xScale.bandwidth())
                    .attr('height', (d: any) => 0)
                    .attr('fill', `url('#myGradient')`)
                    .attr('opacity', 0)
                    .attr('x', (d: any) => xScale(d[0]))
                    .attr('y', (d: any) => yScale(d[1]));
                return enterTransition(et);
            });
    });
    
    return (
        <React.Fragment>
            <p>Margins example: </p>

            <svg ref={ref}>
                <defs>
                    <linearGradient x1="0%" y1="50%" x2="90%" y2="75%" id="myGradient" gradientTransform="rotate(90)">
                        <stop offset="50%" stop-color="#e6b551" />
                        <stop offset="100%" stop-opacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </React.Fragment>
    )
}