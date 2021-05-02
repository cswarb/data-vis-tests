import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

export default () => {
    const ref = useRef<any>();

    function cb(dataset: any): void {
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
            <p>Heat map</p>

            <svg ref={ref}></svg>
        </React.Fragment>
    )
}