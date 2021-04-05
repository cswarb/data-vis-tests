import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import * as weatherData from '../weather.json';

//https://www.newline.co/courses/fullstack-d3-masterclass/loading-the-weather-dataset

export default () => {
    const ref = useRef<any>();

    function cb(data: any): void {
        //Setup boundaries
        const width = 1000;
        let chartDimensions: any = {
            width: width,
            height: 100,
            margin: {
                top: 35,
                right: 0,
                bottom: 50,
                left: 0,
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

        const svg = d3
            .select<any, any>(ref.current)
            .attr('width', dimensions.width)
            .attr('height', dimensions.height);

        const stage = svg
            .append('g')
            .style('transform', `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

        const bg = stage
            .append('g')
            .attr('class', 'background');

        bg
            .append('rect')
            .attr('fill', 'transparent')
            .attr('width', '100%')
            .attr('height', '100%');

        const dataArea = stage.append('g')
            .attr('class', 'data');

        //X
        const xScale = d3.scaleTime()
            //Compare the domain and range:
                // 1st domain param will reflect the position of the 1st range param
                    //So, '2019-06-01' will appear at the boundedHeight (500px),
                    //and 2020-09-01 will appear at 0 (the top of the chart)
            .domain([new Date('2019-06-01'), new Date('2020-09-01')])
            .range([0, dimensions.boundedWidth])
            .nice();
        const axisBottom = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d %m %Y") as any);

        const xAxis = axisBottom(stage.append('g').style('transform', `translateY(${dimensions.boundedHeight}px)`));

        //Data join
        dataArea.selectAll('.point').data(data, (d: any) => d).join((enter: any) => {
            return enter
                .append('circle')
                .attr('class', 'point')
                .attr('fill', 'white')
                .attr('opacity', 0)
                .attr('cx', (d: any) => xScale(d))
                .attr('cy', 10)
                .attr('r', (d: any) => 5)
                .call((enter: any) => {
                    enter
                        .transition()
                        .delay((d: any, i: number) => i * 500)
                        .duration(1000)
                        .attr('cy', 0)
                        .attr('opacity', 1)
                })
        })


        //Y
        // const yScale = d3.scaleTime()
        //     .domain([new Date('2019-06-01'), new Date('2020-09-01')])
        //     .range([ dimensions.boundedHeight, 0])
        //     .nice();

        // const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%d %m %Y") as any);

        // stage.append('g').attr('class', 'y-axis').call(yAxis);

        // dataArea.selectAll('.point').data(data, (d: any) => d).join((enter) => {
        //     return enter
        //         .append('circle')
        //         .attr('cy', (d: any) => yScale(d))
        //         .attr('r', 5)
        //         .attr('class', 'point')
        //         .attr('fill', 'white')
        //         .attr('opacity', 0)
        //         .attr('cx', (d: any) => 0)
        //         .call((enter) => {
        //             enter
        //                 .transition()
        //                 .delay((d: any, i: number) => i * 500)
        //                 .duration(1000)
        //                 .attr('opacity', 1)
        //                 .attr('cx', '25')
        //         })
        // })
    };

    useEffect(() => {
        cb(
            [new Date('2019-06-01'), new Date('2019-09-01'), new Date('2020-01-01'), new Date('2020-02-01'), new Date('2020-09-01')]
        );
    });
    
    return (
        <React.Fragment>
            <p>Time data</p>

            <svg ref={ref}></svg>
        </React.Fragment>
    )
}