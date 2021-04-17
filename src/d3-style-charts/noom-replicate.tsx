import * as d3 from 'd3';
import { extent } from 'd3';
import React, { useEffect, useRef } from 'react';

//Line chart

export default () => {
    const ref = useRef<any>();

    function cb(dataset: any): void {
        const parseTime = d3.timeParse('%Y-%m-%d');
        const xAccessor: any = (d: any) => parseTime(d.date);
        const yAccessor1 = (d: any) => d.weight1;
        const yAccessor2 = (d: any) => d.weight2;
        
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

        const mergedData = [...dataset.map(yAccessor1), ...dataset.map(yAccessor2) ];
        const xExtent: any = d3.extent(dataset.map(xAccessor));
        const yExtent: any = d3.extent(mergedData);

        const xScale = d3.scaleTime().domain(xExtent).range([0, dimensions.boundedWidth]);
        const yScale = d3.scaleLinear().domain(yExtent).range([dimensions.boundedHeight, 0]);

        const xAxis = d3.axisBottom(xScale).tickFormat((d: any, i: any) => {
            return i === 0 || i === dataset.length -1 ?  `Month ${i}` : ''
        });
        const yAxis = d3.axisLeft(yScale).tickFormat(d => '');

        const x = stage.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${dimensions.boundedHeight})`).call(xAxis);
        const y = stage.append('g').attr('class', 'y-axis').call(yAxis).call((selection) => {
            selection
            .selectAll('.tick')
            .attr('opacity', 0)
        }).call((selection) => {
            selection
            .append('text')
            .text('weight'.toUpperCase())
            .style('transform', 'rotate(270deg)')
            .attr('fill', 'white')
            .attr('x', (-dimensions.boundedHeight / 2) + 12)
            .attr('y', -20);
        });

        const line1 = d3.line()
            .x((d) => xScale(xAccessor(d)))
            .y((d) => yScale(yAccessor1(d)))
            .defined((d) => {
                return yAccessor1(d) !== null;
            })
            .curve(d3.curveBasis);
        
        const line2 = d3.line()
            .x((d) => xScale(xAccessor(d)))
            .y((d) => yScale(yAccessor2(d)))
            .defined((d) => {
                return yAccessor2(d) !== null;
            })
            .curve(d3.curveNatural);

        dataArea.selectAll('.line1')
            //Given we only want to plot a single line given all the data, we need to give the datajoin a single item with all the point required to plot the line
            //so wrap the data inside a single array
            .data([dataset])
            .join((enter) => {
                const e1 =  enter
                    .append('path')
                    .attr('d', line1)
                    .attr('class', 'line1')
                    .attr('stroke', '#55E6C1')
                    .attr('fill', 'none')
                    .attr('stroke-width', '4.5px');
                    
                 //circle on start #55E6C1 weight 1 line
                const staticCircle = enter.append('circle')
                    .attr('fill', '#55E6C1')
                    .attr('cx', 0)
                    .attr('cy', yScale(200))
                    .attr('r', 5);
                
                //bigger circle animating through #55E6C1 to end that pulses in and out weight 1 line
                const dynamicCircle = enter.append('circle')
                    .attr('class', 'pulse')
                    .attr('fill', '#55E6C1')
                    .attr('cx', 0)
                    .attr('stroke', '#9AECDB')
                    .attr('stroke-width', '2px')
                    .attr('r', 8)
                    .append('animateMotion')
                    .attr('path', line1)
                    .attr('dur', '2s')
                    .attr('fill', 'freeze')
                    .attr('calcMode', 'spline')
                    .attr('keyTimes', '0;1')
                    .attr('keySplines', '1 0.5 0.5 1')
                    .attr('repeatCount', '1')

                return e1;
        });
        //^ Equivalent to:
        //   dataArea
        //     .append('path')
        //     .datum(dataset)
        //     .attr('d', line1)
        //     .attr('class', 'line1')
        //     .attr('stroke', 'red')
        //     .attr('fill', 'none')
        //     .attr('stroke-width', '2px');
        
        dataArea.selectAll('.line2')
            .data([dataset])
            .join((enter) => {
                const e2 = enter
                    .append('path')
                    .attr('d', line2)
                    .attr('class', 'line2')
                    .attr('stroke', '#6D214F')
                    .attr('fill', 'none')
                    .attr('stroke-width', '2px');

                //purple circle on end of weight 2 line
                enter
                    .append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', 5)
                    .attr('fill', '#6D214F')
                    .append('animateMotion')
                    .attr('dur', '2s')
                    .attr('path', line2)
                    .attr('fill', 'freeze')
                    .attr('calcMode', 'spline')
                    .attr('keyTimes', '0;1')
                    .attr('keySplines', '1 0.5 0.5 1')
                    .attr('repeatCount', '1')

                return e2;
        });

        const MEDIAN_POINT = 200;

        dataArea
            .selectAll('.start')
            .data([MEDIAN_POINT])
            .join((enter) => {
                return enter.append('rect')
                    .attr('class', 'start')
                    .attr('x', 0)
                    .attr('y', d => yScale(d))
                    .attr('width', dimensions.boundedWidth)
                    .attr('height', 1)
                    .attr('fill', 'green')
            });

        //cartesian grid
        dataArea.selectAll('.grid-item').data(dataset).join((enter) => {
            return enter
                .append('rect')
                .attr('class', 'grid-item')
                .attr('x', (d) => xScale(xAccessor(d)))
                .attr('y', 0)
                .attr('width', '2px')
                .attr('height', d => `${dimensions.boundedHeight}px`)
                .attr('y', 0)
                .attr('fill', '#a3adb7')
                .attr('opacity', (d, i) => i % 2 === 0 ? 0.04 : 0.3)
        });

       
        //Shape that fills in weight1 line area
            //Same setup as how we setup d3.line(), but instead of y, there is y0 and y1
            const area = d3.area()
                .x(d => xScale(xAccessor(d))) // Position of both line breaks on the X axis
                .y0(d => yScale(yExtent[0])) // Y position of bottom line breaks (200 = bottom of svg area) - defines the baseline
                .y1(d => yScale(yAccessor1(d))) // Y position of top line breaks - defines the top line
                .defined((d) => {
                    return yAccessor1(d) !== null;
                })
                .curve(d3.curveBasis);

        dataArea.selectAll('area').data([dataset]).join((enter) => {
            return enter
            .append('path')
            .attr('class', area)
            .attr('fill', '#006266')
            .attr('d', area)
            .attr('opacity', 0.25)
        });
        
        //Shape that fills in weight2 line area down to start
        const area2 = d3.area()
            .x(d => xScale(xAccessor(d))) // Position of both line breaks on the X axis
            .y0(d => yScale(MEDIAN_POINT)) // Y position of bottom line breaks (200 = bottom of svg area) - defines the baseline
            .y1(d => yScale(yAccessor2(d))) // Y position of top line breaks - defines the top line
            .defined((d) => {
                return yAccessor2(d) !== null;
            })
            .curve(d3.curveNatural);

        dataArea.selectAll('area').data([dataset]).join((enter) => {
            return enter
                .append('path')
                .attr('class', area)
                .attr('fill', '#6D214F')
                .attr('d', area2)
                .attr('opacity', 0.15)
        });
    };

    useEffect(() => {
        const data: any[] = [
            { date: '2020-01-01', weight1: 200, weight2: 200  },
            { date: '2020-02-01', weight1: 200, weight2: 170  },
            { date: '2020-03-01', weight1: 200, weight2: 220  },
            { date: '2020-04-01', weight1: 200, weight2: 180  },
            { date: '2020-05-01', weight1: 200, weight2: 240  },
            { date: '2020-06-01', weight1: 175, weight2: 190  },
            { date: '2020-07-01', weight1: 150, weight2: 245  },
            { date: '2020-08-01', weight1: 125, weight2: 200  },
            { date: '2020-09-01', weight1: 100, weight2: 250  },
            { date: '2020-10-01', weight1: 100, weight2: 210  },
            { date: '2020-11-01', weight1: 100, weight2: 255  },
            { date: '2020-12-01', weight1: 100, weight2: 220  },
        ];
        cb(data);
    });
    
    return (
        <React.Fragment>
            <p>Noom replication</p>

            <svg ref={ref}></svg>
        </React.Fragment>
    )
}