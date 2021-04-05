import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

//https://wattenberger.com/blog/d3-interactive-charts#getting-set-up

interface TaskOneData {
    AssignedToID: string;
    AuthorisedByID: string;
    Category: string;
    DeveloperHoursActual: string;
    DeveloperID: string;
    DeveloperPerformance: string;
    HoursActual: string;
    HoursEstimate: string;
    Priority: string;
    ProjectBreakdownCode: string;
    ProjectCode: string;
    RaisedByID: string;
    StatusCode: string;
    SubCategory: string;
    Summary: string;
    TaskNumber: string;
    TaskPerformance: string;
}

export default () => {
    const ref = useRef<any>();

    d3.csv('https://raw.githubusercontent.com/Wattenberger/d3-walkthroughs/master/interactions/data.csv').then((res: any) => {
        cb(res);
    });

    function cb(dataset: TaskOneData[]): void {
        console.log('dataset: ', dataset[0]);
        
        //1: Setup data
        const summaryAccessor = (d: TaskOneData) => d.Summary;
        const actualHoursAccessor = (d: TaskOneData) => +d.HoursActual;
        const developerHoursAccessor = (d: TaskOneData) => +d.DeveloperHoursActual;
        const hoursEstimateAccessor = (d: TaskOneData) => +d.HoursEstimate;
        const diffAccessor = (d: TaskOneData) => hoursEstimateAccessor(d) - actualHoursAccessor(d);

        // Only use the first estimate per task (with highest actual hours)
        let usedTasks: any = {};
        dataset = dataset.filter((d: TaskOneData) => {
            const hours = actualHoursAccessor(d);
            if (usedTasks[summaryAccessor(d)]) {
                const hasHigherValue = hours > usedTasks[summaryAccessor(d)];
                if (!hasHigherValue) return false;
            }
            usedTasks[summaryAccessor(d)] = hours;
            return actualHoursAccessor(d) > 10;
        })
        dataset = dataset.filter((d: TaskOneData) => (
            diffAccessor(d) >= -50
            && diffAccessor(d) <= 50
        ));
        const yAccessor = (d: TaskOneData[]) => d.length;

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

        const bg = stage
            .append('g')
            .attr('class', 'background');

        bg
            .append('rect')
            .attr('fill', 'transparent')
            .attr('width', '100%')
            .attr('height', '100%');

        stage.append('g')
            .attr('class', 'bins');

        stage.append('line')
            .attr('class', 'mean');

        stage.append('g')
            .attr('class', 'x-axis')
            .style('transform', `translateY(${dimensions.boundedHeight}px)`)
            .append('text')
            .attr('class', 'x-axis-label')

        const minMax = d3.extent(dataset, diffAccessor) as any;
        const xScale = d3.scaleLinear().domain(minMax).range([0, dimensions.boundedWidth]).nice();

        const binsGenerator = d3.bin()
            .domain(xScale.domain() as any)
            .value(diffAccessor as any)
            .thresholds(30);

        const bins = binsGenerator(dataset as any);

        // Scales
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins as any, yAccessor) as any])
            .range([ dimensions.boundedHeight, 0])
            .nice();

        const binGroups = stage
            .select('.bins')
            .selectAll('.bin')
            .data(bins);

        const newBinGroups = binGroups
            .join((enter): any => {
                return enter.append('g').attr('class', 'bin')
                .append('rect')
                .attr('x', (d: any) => xScale(d.x0) + 10)
                .attr('y', (d: any) => yScale(yAccessor(d)))
                .attr('height', (d: any) => dimensions.boundedHeight - yScale(yAccessor(d)))
                .attr('width', (d: any) => d3.max([0, xScale(d.x1) - xScale(d.x0) - 10]) as any);
            },
            (update) => {
                return update;
            },
            (exit) => {
                return exit.remove();
            });
            
        const mean = d3.mean(dataset, diffAccessor) as any;

        const meanLine = stage.selectAll('.mean')
            .attr('stroke', '#c7ecee')
            .attr('stroke-dasharray', '2px 4px')
            .attr('x1', xScale(mean))
            .attr('x2', xScale(mean))
            .attr('y1', -20)
            .attr('y2', dimensions.boundedHeight);

        const meanLabel = stage.append('text')
            .attr('class', 'mean-label')
            .attr('x', xScale(mean))
            .attr('y', -25)
            .text('mean');

        const xAxisGenerator = d3.axisBottom(xScale);
        const xAxis = stage.select('.x-axis')
            .call(xAxisGenerator as any);

        //Static items
        const xAxisLabel = xAxis.select('.x-axis-label')
            .attr('x', dimensions.boundedWidth / 2)
            .attr('y', dimensions.margin.bottom - 10)
            .attr('fill', 'white')
            .text('Hours over-estimated');
        const backgroundLeft = bg.append('rect')
            .attr('class', 'background left-side-background')
            .attr('y', -20)
            .attr('fill', 'grey')
            .attr('width', dimensions.boundedWidth / 2)
            .attr('height', dimensions.boundedHeight + 20);
        const backgroundRight = bg.append('rect')
            .attr('class', 'background right-side-background')
            .attr('x', dimensions.boundedWidth / 2 + 1)
            .attr('y', -20)
            .attr('fill', 'white')
            .attr('width', dimensions.boundedWidth / 2 - 1)
            .attr('height', dimensions.boundedHeight + 20);
        const leftSideLabel = bg.append('text')
            .attr('class', 'label left-side-label')
            .attr('x', 10)
            .attr('y', 0)
            .text('Under-estimated');
        const rightSideLabel = bg.append('text')
            .attr('class', 'label right-side-label')
            .attr('x', dimensions.boundedWidth - 120)
            .attr('y', 0)
            .text('Over-estimated');
    };
    
    return (
        <React.Fragment>
            <p>Task 1 - Under/Over estimated stories chart: </p>

            <svg ref={ref}></svg>
        </React.Fragment>
    )
}