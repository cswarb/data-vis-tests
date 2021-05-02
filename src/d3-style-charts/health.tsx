import * as d3 from 'd3';
import { ENETUNREACH } from 'node:constants';
import React, { useEffect, useRef } from 'react';

//Line chart

export default () => {
    const ref = useRef<any>();

    function cb(dataset: any): void {
        var parseTime = d3.timeParse('%Y-%m-%d');

        const xAccessor = (d: any): any => parseTime(d.date);
        const yAccessor1 = (d: any) => d.marketTrend;

        //2: Setup boundaries
        const width = 1000;
        let dimensions: any = {
            width: width,
            height: 300,
            margin: {
                top: 35,
                right: 0,
                bottom: 50,
                left: 0,
            },
        };

        dimensions.boundedWidth = dimensions.width
            - dimensions.margin.left
            - dimensions.margin.right;
        dimensions.boundedHeight = dimensions.height
            - dimensions.margin.top
            - dimensions.margin.bottom;

        const svg = d3
            .select<any, any>(ref.current)
            .attr('width', dimensions.width)
            .attr('height', dimensions.height);

        const stage = svg
            .append('g')
            .style('transform', `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

        const dataArea = stage.append('g')
            .attr('class', 'data');


        const xExtent = d3.extent(dataset.map(xAccessor)) as any;
        const xScale = d3.scaleTime().domain(xExtent).range([0, dimensions.boundedWidth])
        const xAxis = d3.axisBottom(xScale).tickFormat((d: any, i: any): any => {
            return `Month ${i}`
        });
        const x = stage.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${dimensions.boundedHeight})`).call(xAxis);


        const ySpreadData = [...dataset.map(yAccessor1)];
        const yExtent = d3.extent(ySpreadData) as any;
        const yScale = d3.scaleLinear().domain(yExtent).range([dimensions.boundedHeight, 0]).nice();
        const yAxis = d3.axisLeft(yScale);
        const y = stage.append('g').attr('class', 'y-axis').call(yAxis);

        // //DYNAMICCLIPPATH
        // dataArea.selectAll('.line-clip').data([dataset]).join((enter) => {
        //     return enter.append('svg')
        //         .attr('class', 'line-clip')
        //         .append('defs')
        //         .append('clipPath')
        //         .attr('id', 'lineClip')
        //         .append('path')
        //         .attr('d', (d: any) => line1(d))
        //         .attr('fill', 'transparent')
        //         .attr('stroke', '#FFFFFF')
        // })


        // //underlay
        // dataArea.selectAll('.underlay').data([dataset]).join((enter) => {
        //     return enter.append('rect')
        //     .attr('fill', 'yellow')
        //     .attr('width', dimensions.boundedWidth)
        //     .attr('height', dimensions.boundedHeight)
        //     .attr('x', 0)
        //     .attr('y', 0)
        //     .attr('clip-path', 'url(#lineClip)')
        // })

        //grid
        dataArea.selectAll('.grid-line').data(dataset).join((enter) => {
            return enter.append('line')
                .attr('class', 'grid-line')
                .attr('x1', (d: any) => xScale(xAccessor(d)))
                .attr('x2', (d: any) => xScale(xAccessor(d)))
                .attr('y1', (d: any) => 0)
                .attr('y2', (d: any) => dimensions.boundedHeight)
                .attr('opacity', '0.1')
                .attr('stroke', 'white')
        }, (update) => {
            return update;
        }, (exit) => {
            return exit;
        });

        //zero line
        dataArea.selectAll('.zero-line').data([dataset]).join((enter) => {
            return enter.append('line')
                .attr('class', 'zero-line')
                .attr('stroke', 'white')
                .attr('x1', '0')
                .attr('x2', dimensions.boundedWidth)
                .attr('y1', yScale(0))
                .attr('y2', yScale(0))
        })

        //generate gradient
        stage.selectAll('#myGradient2').data([dataset]).join((enter) => {
            const linearG = enter
                .append('defs')
                .append('linearGradient')
                .attr('id', 'myGradient2')
                .attr('gradientTransform', 'rotate(90)')
                .attr('x1', '0%')
                .attr('x2', '100%')
                .attr('y1', '0') //must the the same value to fade the graidient at the right point
                .attr('y2', '0'); //must the the same value to fade the graidient at the right point

            //top
            linearG.append('stop')
                .attr('offset', '0%')
                .attr('stop-opacity', '1')
                .attr('stop-color', '#1B9CFC')
            
            //middle
            linearG.append('stop')
                .attr('offset', '50%')
                .attr('stop-opacity', '1')
                .attr('stop-color', 'transparent')
            
            //end
            linearG.append('stop')
                .attr('offset', '100%')
                .attr('stop-opacity', '1')
                .attr('stop-color', '#6D214F')

            return linearG;
        });

        const area = d3.area()
            .x((d: any) => xScale(xAccessor(d)))
            .y0((d: any) => yScale(0))
            .y1((d: any) => yScale(yAccessor1(d)));

        dataArea.selectAll('.area').data([dataset]).join((enter) => {
            return enter.append('path')
                .attr('class', 'area')
                .attr('fill', 'transparent')
                .attr('fill', 'url(#myGradient2)')
                // .attr('clip-path', 'url(#svgPath)')
                .attr('d', (d) => area(d))
        });

        const line1 = d3.line()
            .x((d: any) => xScale(xAccessor(d)))
            .y((d: any) => yScale(yAccessor1(d)));

        dataArea.selectAll('.line-1').data([dataset]).join((enter) => {
            return enter.append('path')
                .attr('class', 'line-1')
                .attr('d', (d: any) => line1(d))
                .attr('fill', 'transparent')
                .attr('stroke', 'aliceblue')
                .attr('stroke-width', '1.5px')
        }, (update) => {
            return update;
        }, (exit) => {
            return exit;
        });
    };

    useEffect(() => {
        const data: any[] = [
            { date: '2018-06-01', marketTrend: -235 },
            { date: '2018-07-01', marketTrend: -251},
            { date: '2018-08-01', marketTrend: -244 },
            { date: '2018-09-01', marketTrend: -259 },
            { date: '2018-10-01', marketTrend: -316},
            { date: '2018-11-01', marketTrend: -200 },
            { date: '2018-12-01', marketTrend: -210},
            { date: '2019-01-01', marketTrend: -150 },
            { date: '2019-02-01', marketTrend: 10 },
            { date: '2019-03-01', marketTrend: -89 },
            { date: '2019-04-01', marketTrend: -101 },
            { date: '2019-05-01', marketTrend: -30 },
            { date: '2019-06-01', marketTrend: 50 },
            { date: '2019-07-01', marketTrend: 134 },
            { date: '2019-08-01', marketTrend: 76 },
            { date: '2019-09-01', marketTrend: 192 },
            { date: '2019-10-01', marketTrend: 298 },
            { date: '2019-11-01', marketTrend: 128 },
            { date: '2019-12-01', marketTrend: 32 },
            { date: '2020-01-01', marketTrend: 103 },
            { date: '2020-02-01', marketTrend: 264 },
            { date: '2020-03-01', marketTrend: 376 },
            { date: '2020-04-01', marketTrend: 287 },
            { date: '2020-05-01', marketTrend: 201 },
            { date: '2020-06-01', marketTrend: 345 },
            { date: '2020-07-01', marketTrend: 278 },
            { date: '2020-08-01', marketTrend: 298 },
            { date: '2020-09-01', marketTrend: 341 },
            { date: '2020-10-01', marketTrend: 312 },
            { date: '2020-11-01', marketTrend: 351 },
            { date: '2020-12-01', marketTrend: 320 },
        ];
        cb(data);
    });

    return (
        <React.Fragment>
            <p>Health gradient data</p>

            <svg ref={ref}>
                {/* <defs>
                    <linearGradient x1="0%" y1="50%" x2="100%" y2="50%" id="myGradient" gradientTransform="rotate(90)">
                        <stop offset="0%" stop-opacity="1" stop-color="green" />
                        <stop offset="50%" stop-opacity="1" stop-color="transparent" />
                        <stop offset="100%" stop-opacity="1" stop-color="red" />
                    </linearGradient>
                </defs> */}

                <svg height="0" width="0">
                    <defs>
                        <clipPath id="svgPath">
                            <path fill="#FFFFFF" stroke="#000000" stroke-width="1.5794" stroke-miterlimit="10" d="M215,100.3c97.8-32.6,90.5-71.9,336-77.6
        c92.4-2.1,98.1,81.6,121.8,116.4c101.7,149.9,53.5,155.9,14.7,178c-96.4,54.9,5.4,269-257,115.1c-57-33.5-203,46.3-263.7,20.1
        c-33.5-14.5-132.5-45.5-95-111.1C125.9,246.6,98.6,139.1,215,100.3z"/>
                        </clipPath>
                    </defs>
                </svg>
            </svg>
        </React.Fragment>
    )
}