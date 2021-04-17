import * as d3 from 'd3';
import { ENETUNREACH } from 'node:constants';
import React, { useEffect, useRef } from 'react';

//Line chart

export default () => {
    const ref = useRef<any>();

    function cb(dataset: any): void {
        var parseTime = d3.timeParse('%Y-%m-%d');

        const xAccessor = (d: any): any => parseTime(d.date);
        const yAccessor1 = (d: any) => d.electricSearches;
        const yAccessor2 = (d: any) => d.iceSearches;

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


        const ySpreadData = [...dataset.map(yAccessor1), ...dataset.map(yAccessor2)];
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

        const line2 = d3.line()
            .x((d: any) => xScale(xAccessor(d)))
            .y((d: any) => yScale(yAccessor2(d)));


        // dataArea.selectAll('.line-2').data([dataset]).join((enter) => {
        //     return enter.append('path')
        //         .attr('class', 'line-2')
        //         .attr('d', (d: any) => line2(d))
        //         .attr('fill', 'transparent')
        //         .attr('stroke', 'red')
        // }, (update) => {
        //     return update;
        // }, (exit) => {
        //     return exit;
        // });

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

        //generate gradient
        stage.selectAll('.d').data([dataset]).join((enter) => {
            const linearG = enter
                .append('defs')
                .append('linearGradient')
                .attr('id', 'myGradient2')
                .attr('gradientTransform', 'rotate(90)')
                .attr('x1', '0%')
                .attr('x2', '100%')
                .attr('y1', '100%') //must the the same value to fade the graidient at the right point
                .attr('y2', '100%'); //must the the same value to fade the graidient at the right point

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
            .y0((d: any) => yScale(2250))
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
            { date: '2018-06-01', iceSearches: 2350, electricSearches: 1016 },
            { date: '2018-07-01', iceSearches: 2501, electricSearches: 956 },
            { date: '2018-08-01', iceSearches: 2445, electricSearches: 1288 },
            { date: '2018-09-01', iceSearches: 2598, electricSearches: 1014 },
            { date: '2018-10-01', iceSearches: 3136, electricSearches: 987 },
            { date: '2018-11-01', iceSearches: 2975, electricSearches: 1367 },
            { date: '2018-12-01', iceSearches: 2875, electricSearches: 890 },
            { date: '2019-01-01', iceSearches: 2389, electricSearches: 1378 },
            { date: '2019-02-01', iceSearches: 2756, electricSearches: 1489 },
            { date: '2019-03-01', iceSearches: 2570, electricSearches: 1024 },
            { date: '2019-04-01', iceSearches: 2372, electricSearches: 998 },
            { date: '2019-05-01', iceSearches: 2641, electricSearches: 1378 },
            { date: '2019-06-01', iceSearches: 2101, electricSearches: 1598 },
            { date: '2019-07-01', iceSearches: 1989, electricSearches: 1689 },
            { date: '2019-08-01', iceSearches: 2401, electricSearches: 1788 },
            { date: '2019-09-01', iceSearches: 2490, electricSearches: 2400 },
            { date: '2019-10-01', iceSearches: 1807, electricSearches: 2589 },
            { date: '2019-11-01', iceSearches: 2010, electricSearches: 2785 },
            { date: '2019-12-01', iceSearches: 2310, electricSearches: 2893 },
            { date: '2020-01-01', iceSearches: 1997, electricSearches: 3856 },
            { date: '2020-02-01', iceSearches: 2187, electricSearches: 3792 },
            { date: '2020-03-01', iceSearches: 1937, electricSearches: 3101 },
            { date: '2020-04-01', iceSearches: 2256, electricSearches: 3928 },
            { date: '2020-05-01', iceSearches: 1912, electricSearches: 3420 },
            { date: '2020-06-01', iceSearches: 1034, electricSearches: 3465 },
            { date: '2020-07-01', iceSearches: 1894, electricSearches: 3864 },
            { date: '2020-08-01', iceSearches: 2081, electricSearches: 3998 },
            { date: '2020-09-01', iceSearches: 1908, electricSearches: 3678 },
            { date: '2020-10-01', iceSearches: 1678, electricSearches: 3729 },
            { date: '2020-11-01', iceSearches: 1863, electricSearches: 4102 },
            { date: '2020-12-01', iceSearches: 1965, electricSearches: 4289 },
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