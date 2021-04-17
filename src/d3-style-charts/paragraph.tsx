import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

export default () => {
    const ref = useRef<any>();

    useEffect(() => {
        const data = [1, 2, 3, 4, 5];
        const dataTwo = [2,3,4,5,6];

        const width = 1000;
        let chartDimensions: any = {
            width: width,
            height: 100,
            margin: {
                top: 50,
                right: 0,
                bottom: 50,
                left: 0,
            },
        };

        function calculateBoundedDimensions(currentDimensions: any) {
            return {
                ...currentDimensions,
                boundedWidth: currentDimensions.width
                    - currentDimensions.margin.left
                    - currentDimensions.margin.right,
                boundedHeight: currentDimensions.height
                    - currentDimensions.margin.top
                    - currentDimensions.margin.bottom,
            }
        };
        const dimensions = calculateBoundedDimensions(chartDimensions);

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

        let xScale = d3.scaleLinear().domain(d3.extent(data) as any).range([0, dimensions.boundedWidth]);
        let xAxis = d3.axisBottom(xScale);

        stage.append('g').attr('class', 'x-axis').call(xAxis);

        function dataUpdate(dt: any) {
            xScale = d3.scaleLinear().domain(d3.extent(dt) as any).range([0, dimensions.boundedWidth]);
            xAxis = d3.axisBottom(xScale);

            stage.select('.x-axis').call(xAxis as any);

            dataArea.selectAll('.items').data(dt, (d: any) => d).join((enter) => {
                return enter
                    .append('text')
                    .text((d: any) => d.toString())
                    .attr('class', 'items')
                    .attr('fill', 'white')
                    .attr('font-size', '20px')
                    .attr('y', 30)
                    .attr('opacity', 0)
                    .attr('x', (d: any) => xScale(d))
                    .call((selection) => {
                        selection.transition().delay((d: any, i: number) => i * 750).duration(500).attr('y', '-10').attr('opacity', '1')
                    })
            }, (update) => {
                return update.attr('fill', 'green')
                    .text((d: any) => d.toString())
                    .attr('x', (d: any) => xScale(d))
                    .call((selection) => {
                        selection.transition().delay((d: any, i: number) => i * 750).duration(500).attr('y', '-10').attr('opacity', '1')
                    })
            }, (exit) => {
                return exit.call((selection) => {
                    selection.transition().delay((d: any, i: number) => i * 750).duration(500).attr('fill', 'red').remove();
                })
            });
        };

        dataUpdate(data);

        setTimeout(() => {
            dataUpdate(dataTwo);
        }, 2000);
    });
    
    return (
        <React.Fragment>
            <p>Paragraph data</p>

            <svg ref={ref}></svg>
        </React.Fragment>
    )
}