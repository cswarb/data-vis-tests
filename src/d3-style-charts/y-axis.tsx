import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';


export default () => {
    const ref = useRef<any>();
    const data = [1, 2, 3, 4, 5];

    useEffect(() => {
        const svg = d3.select<any, any>(ref.current);
        const yScale = d3.scaleLinear<any, any, any>()
            .domain([1, 5])
            .range([0, 125])

        const xAxis = d3.axisLeft(yScale);

        xAxis(svg.append('g'));
    });
    
    return (
        <React.Fragment>
            <p>Y Axis example: </p>

            <svg ref={ref}></svg>
        </React.Fragment>
    )
}