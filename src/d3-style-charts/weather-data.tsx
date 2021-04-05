import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import * as weatherData from '../weather.json';

//https://www.newline.co/courses/fullstack-d3-masterclass/loading-the-weather-dataset

export default () => {
    const ref = useRef<any>();

    function cb(dataset: any): void {
        var parseTime = d3.timeParse('%Y-%m-%d');
        const data = dataset.default.reduce((acc: Array<any>, d: any) => {
            acc.push({
                ...d,
                date: parseTime(d.date)
            });
            return acc;
        }, []);
        console.log('data: ', data);

        const xAccessor = (d: any) => d.date;
        const yAccessor = (d: any) => d.temperatureHigh;
        
        //data / temperatureHigh

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

        const dataArea = stage.append('g')
            .attr('class', 'data');


        //X
        const minMax = d3.extent(data, d => xAccessor(d)) as any;
        // const xAxis = d3.scaleTime().domain(data.map((d: any) => xAccessor(d))).range([ 0, dimensions.boundedWidth]);
        const xAxis = d3.scaleTime()
            .domain(minMax)
            .range([0, dimensions.boundedWidth])
            .nice();

        var formatMillisecond = d3.timeFormat(".%L"),
            formatSecond = d3.timeFormat(":%S"),
            formatMinute = d3.timeFormat("%I:%M"),
            formatHour = d3.timeFormat("%I %p"),
            formatDay = d3.timeFormat("%a %d"),
            formatWeek = d3.timeFormat("%b %d"),
            formatMonth = d3.timeFormat("%B"),
            formatYear = d3.timeFormat("%Y");

        function multiFormat(date: any) {
            return (d3.timeSecond(date) < date ? formatMillisecond
                : d3.timeMinute(date) < date ? formatSecond
                    : d3.timeHour(date) < date ? formatMinute
                        : d3.timeDay(date) < date ? formatHour
                            : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
                                : d3.timeYear(date) < date ? formatMonth
                                    : formatYear)(date);
        }

        const axisBottom = d3.axisBottom(xAxis)
            .tickFormat(multiFormat);
        stage.append('g').attr('class', 'x-axis').style('transform', `translateY(${dimensions.boundedHeight}px)`).call(axisBottom as any);

        const g = d3.scaleTime().domain([Date.now(), Date.now() + 24 * 60 * 60 * 1000]);
        console.log('scaleTime', g(new Date()))
        
        //Y
        const yExtent = d3.extent(data, (d: any) => yAccessor(d)) as any;
        const yAxis = d3.scaleLinear().domain(yExtent).range([ dimensions.boundedHeight, 0 ]).nice();

        const axisLeft = d3.axisLeft(yAxis);
        stage.append('g').attr('class', 'y-axis').call(axisLeft as any);


        const lineData = d3.line()
            .x((d: any): any =>  { return xAxis(xAccessor(d)) })
            .y((d: any): any => { return yAxis(yAccessor(d)) })
            .curve(d3.curveCardinal);

        //Line
        dataArea.append('path')
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr('class', 'line')
            .attr('d', (d: any): any => {
                return lineData(d);
            });


            // .selectAll('.line')
            // .data(data)
            // .join((enter): any => {
            //     return enter
                    
            // });
    };

    useEffect(() => {
        cb(weatherData);
    });
    
    return (
        <React.Fragment>
            <p>Weather data</p>

            <svg ref={ref}></svg>
        </React.Fragment>
    )
}