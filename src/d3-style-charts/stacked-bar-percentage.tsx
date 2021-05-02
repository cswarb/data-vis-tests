import * as d3 from 'd3';
import { timeParse } from 'd3';
import React, { useEffect, useRef } from 'react';

// http://using-d3js.com/05_06_stacks.html

export default () => {
    const ref = useRef<any>();

    function cb(data: any): void {
        const dataset = data.map((d: any) => {
            const totalSearches: any = Object.values(d.searches).reduce((acc: any, v: any) => acc + v, 0);

            const de = Object.keys(d.searches).reduce((acc: any, key: any): any => {
                acc[key] = (d.searches[key] / totalSearches) * 100;
                return acc;
            }, {});

            return {
                ...d,
                searches: de
            };
        });

        console.log('dataset: ', dataset);

        var parseTime = d3.timeParse('%Y-%m-%d');
        const xAccessor = (d: any): any => parseTime(d.date);
        const yAccessor = (d: any) => d.searches;
        
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

        const yExtent: any = d3.extent(dataset, (d: any): any => {
            return Object.values(yAccessor(d)).reduce((acc: any, v: any): any => {
                return acc + v;
            }, 0);
        });

        var ordinalScale = d3.scaleOrdinal()
            .domain(['porsche', 'bmw', 'alpine'])
            .range(['yellow', 'green', 'red']);

        //STACK
        const stackData = d3.stack()
            .keys(['porsche', 'bmw', 'alpine'])
            .value((obj: any, key: any): any => {
                console.log('stackData: ', obj, key, obj.searches[key]);
                return obj.searches[key]
            })
        const stackGeneratorData = stackData(dataset);
        console.log('stackGeneratorData: ', stackGeneratorData);

        //DOMAIN
        const xScale = d3.scaleBand().domain(dataset.map(xAccessor)).range([0, dimensions.boundedWidth ]).paddingInner(0.05)
        const yScale = d3.scaleLinear().domain([0, yExtent[1] ]).range([dimensions.boundedHeight, 0 ]);

        const x = d3.axisBottom(xScale).tickFormat((d, i) => {
            return `Month ${i + 1}`
        })
        const y = d3.axisLeft(yScale);

        const xAxis = stage.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${dimensions.boundedHeight})`).call(x);
        const yAxis = stage.append('g').attr('class', 'y-axis').call(y);

        //data join
        const stackGroups = dataArea.selectAll('.groups').data(stackGeneratorData, (d: any) => d).join((enter) => {
            return enter.append('g')
                .attr('class', 'groups')
                .attr('fill', (d): any => {
                    return ordinalScale(d.key);
                });
        })
        
        stackGroups.selectAll('.bar').data((d) => d).join((enter): any => {
             enter.append('rect')
                .attr('class', 'bar')
                .attr('x', (d: any): any => {
                    return xScale(xAccessor(d.data));
                })
                .attr('y', (d: any): any => {
                    return yScale(d[1]);
                })
                .attr('height', (d: any): any => {
                    return yScale(d[0]) - yScale(d[1]);
                })
                .attr('width', xScale.bandwidth())
                
            enter.append('text')
                .attr('x', (d: any): any => {
                    return (xScale.bandwidth() / 2) as any + xScale(xAccessor(d.data) as any) as any;
                })
                .attr('y', (d: any): any => {
                    return (yScale(d[0]) - yScale(d[1])) / 2;
                })
                .attr('fill', 'black')
                .text((d: any): any => {
                    console.log('rect d: ', d);
                    return d.data.key;
                })
        });
    };

    useEffect(() => {
        const data: any[] = [
            { date: '2018-06-01', searches: { 'porsche': 1234, 'bmw': 2747, 'alpine': 902 } },
            { date: '2018-07-01', searches: { 'porsche': 1568, 'bmw': 2680, 'alpine': 1021 } },
            { date: '2018-08-01', searches: { 'porsche': 1074, 'bmw': 3876, 'alpine': 678 } },
            { date: '2018-09-01', searches: { 'porsche': 1889, 'bmw': 2967, 'alpine': 295 } },
            { date: '2018-10-01', searches: { 'porsche': 1746, 'bmw': 2198, 'alpine': 593 } },
            { date: '2018-11-01', searches: { 'porsche': 2195, 'bmw': 1987, 'alpine': 954 } },
            { date: '2018-12-01', searches: { 'porsche': 1907, 'bmw': 1846, 'alpine': 1046 } },
            { date: '2019-01-01', searches: { 'porsche': 1580, 'bmw': 1750, 'alpine': 1089 } },
            { date: '2019-02-01', searches: { 'porsche': 1057, 'bmw': 2306, 'alpine': 1204 } },
        ];
        cb(data);
    });
    
    return (
        <React.Fragment>
            <p>Stacked bar percentage</p>

            <svg ref={ref}></svg>
        </React.Fragment>
    )
}