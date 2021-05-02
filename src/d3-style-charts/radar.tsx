import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

// https://github.com/d3/d3-zoom
// https://observablehq.com/@d3/zoomable-scatterplot

export default () => {
    const ref = useRef<any>();

    function cb(dataset: any): void {
        var parseTime = d3.timeParse('%Y-%m-%d');

        const xAccessor = (d: any): any => parseTime(d.date);
        // const yAccessor1 = (d: any) => d.electricSearches;
        const yAccessor = (d: any) => d.iceSearches;
        
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
        const yExtent = d3.extent([ 2000, ...dataset.map(yAccessor) ]) as any;

        const xScale = d3.scaleBand().domain([ ...dataset.map((d: any) => xAccessor(d)) ]).range([0, dimensions.boundedWidth]).paddingInner(0.02);
        const yScale = d3.scaleLinear().domain(yExtent).range([dimensions.boundedHeight, 0]);

        const x = d3.axisBottom(xScale);
        const y = d3.axisLeft(yScale);

        stage.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${dimensions.boundedHeight})`).call(x);
        stage.append('g').attr('class', 'y-axis').call(y);

        dataArea.selectAll('.bar').data(dataset, (d: any) => d).join((enter) => {
            return enter
                .append('rect')
                .attr('class', 'bar')
                .attr('x', (d: any): any => xScale(xAccessor(d)))
                .attr('y', (d: any) => yScale(yAccessor(d)))
                .attr('width', xScale.bandwidth())
                .attr('height', (d) => {
                    console.log(d, ' : ', dimensions.boundedHeight, ' : ', yAccessor(d), ' : ', yScale(yAccessor(d)));
                    
                    return dimensions.boundedHeight - yScale(yAccessor(d))
                })
                .attr('fill', 'blue')
        })
    };

    useEffect(() => {
        const data: any[] = [
            { date: '2018-06-01', iceSearches: 2350  },
            { date: '2018-07-01', iceSearches: 2501  },
            { date: '2018-08-01', iceSearches: 2445  },
            { date: '2018-09-01', iceSearches: 2598  },
            { date: '2018-10-01', iceSearches: 3136 },
            { date: '2018-11-01', iceSearches: 2975 },
            { date: '2018-12-01', iceSearches: 2875 },
            { date: '2019-01-01', iceSearches: 2389 },
            { date: '2019-02-01', iceSearches: 2756 },
        ];
        cb(data);
    });
    
    return (
        <React.Fragment>
            <p>Bar test</p>

            <svg ref={ref}></svg>
        </React.Fragment>
    )
}