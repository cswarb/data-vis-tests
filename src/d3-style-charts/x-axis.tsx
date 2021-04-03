import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';


export default () => {
    const ref = useRef<any>();
    const data = [1, 2, 3, 4, 5];

    useEffect(() => {
        const svg = d3.select<any, any>(ref.current);
        const xScale = d3.scaleLinear<any, any, any>()
            .domain([1, 5])
            .range([0, 1000])

        const xAxis = d3.axisBottom(xScale);

        xAxis(svg.append('g'));
    });
    
    return (
        <React.Fragment>
            <p>X Axis example: </p>

            <svg ref={ref}></svg>
        </React.Fragment>
    )
}