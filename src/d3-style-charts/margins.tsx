import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

export default () => {
    const width = 1000;
    let chartDimensions: any = {
        width: width,
        height: 300,
        margin: {
            top: 10,
            right: 20,
            bottom: 20,
            left: 20,
        },
    };

    function calculateBoundedDimensions(currentDimensions: any) {
        return {
            ...currentDimensions,
            boundedWidth: currentDimensions.width
                - currentDimensions.margin.left
                - currentDimensions.margin.right,
            boundedHeight: currentDimensions.height
                - currentDimensions.margin.top
                - currentDimensions.margin.bottom,
        }
    };
    const dimensions = calculateBoundedDimensions(chartDimensions);

    const ref = useRef<any>();
    const data = [['01', 1], ['02', 2], ['03', 3], ['04', 4], ['05', 5]];

    const xAccessor = (d: any) => d[0];
    const yAccessor = (d: any) => d[1];

    useEffect(() => {
        const svg = d3.select<any, any>(ref.current)
            .attr('width', dimensions.width)
            .attr('height', dimensions.height);
        
        const stage = svg
            .append('g')
            .style('transform', `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

        const dataArea = stage.append('g')
            .attr('class', 'data')

        const yScale = d3.scaleLinear<any, any, any>()
            .domain([0, 5])
            .range([dimensions.boundedHeight, 0]);

        const xScale = d3.scaleBand<any>()
            .domain([ ...data.map(d => xAccessor(d)) ])
            .range([0, dimensions.boundedWidth]).paddingInner(0.02);
            
        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale);

        stage.append('g').call(yAxis.ticks(5));
        stage.append('g').style('transform', `translateY(${dimensions.boundedHeight}px)`).call(xAxis)

        const enterTransition = (enter: any): any => {
            enter.transition()
                .delay((d: any, i: number) => i * 200)
                .duration(500)
                .attr('opacity', 1)
                .attr('height', (d: any) => dimensions.boundedHeight - yScale(yAccessor(d)))
        }

        dataArea.selectAll('rect')
            .data(data, (d: any) => d)
            .join((enter: any): any => {
                const et = enter
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('width', xScale.bandwidth())
                    .attr('height', (d: any) => dimensions.boundedHeight - yScale(yAccessor(d)))
                    .attr('fill', `#e6b551`)
                    .attr('opacity', 0)
                    .attr('x', (d: any): any => xScale(xAccessor(d)))
                    .attr('y', (d: any) => yScale(yAccessor(d)));
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