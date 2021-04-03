import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';


export default ({ chartData }: any) => {
    const ref = useRef<any>();

    function generateCircles(): Array<any> {
        return Array(6).fill(0).map(() => ([
            Math.random() * 80 + 10,
            Math.random() * 35 + 10,
        ]))
    }

    const [visibleCircles, setVisibleCircles] = useState(
        generateCircles()
    );

    setInterval(() => {
        setVisibleCircles([
            ...visibleCircles.slice(0, visibleCircles.length - 1),
        ]);
    }, 10000)

    //Use effect will be called on each update
    useEffect(() => {
        const svgElement = d3.select<any, any>(ref.current);

        svgElement
        //Select all future instances of relevant class/id/element
        .selectAll("circle")
        //Data join with these elements by passing data to them. This will bind DOM element 1 of array element 1, and so on
        .data<any[]>(visibleCircles, (d: any) => {
            return d;
        })
        .join(
            //Define each of the 3 stages of the general update pattern
            enter => (
                //What happens when new elements enter the stage
                enter.append("circle")
                    .attr("cx", (d, i) => {
                        return i * 15
                    })
                    .attr("cy", 10)
                    .attr("r", 0)
                    .attr("fill", "cornflowerblue")
                    .call((enter) => (
                        enter.transition()
                            .duration(1200)
                            .attr("cy", 10)
                            .attr("r", 6)
                            .style("opacity", 1)
                    ))
            ),
            update => (
                //What happens when elements that already exist get updated?
                update.attr("fill", "lightgrey")
            ),
            exit => (
                //What happends when an existing elements get remove from the dataset?
                exit.attr("fill", "tomato")
                    .transition()
                    .duration(1200)
                    .attr("r", 0)
                    .style("opacity", 0)
                    .remove()
            ),
        )
    }, [visibleCircles]);

    return (
        <React.Fragment>
            <p>Circles example: </p>
            <svg
                viewBox="0 0 100 20"
                //Use ref (like angular viewChild)
                ref={ref}
            />
        </React.Fragment>
    )
}