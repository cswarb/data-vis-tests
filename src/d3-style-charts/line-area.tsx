import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

//Line chart

export default () => {
    const ref = useRef<any>();

    function cb(dataset: any): void {
        var parseTime = d3.timeParse('%Y-%m-%d');

        const xAccessor = (d: any): any => parseTime(d.date);
        const yAccessor1 = (d: any) => d.electricSearches;
        const yAccessor2 = (d: any) => d.iceSearches;
        
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

        
        const xextent = d3.extent(dataset, (d) => xAccessor(d)) as any;
        const yextent = d3.extent([...dataset.map(yAccessor1), ...dataset.map(yAccessor2) ]) as any;
        const xScale = d3.scaleTime().domain(xextent).range([0, dimensions.boundedWidth]);
        const yScale = d3.scaleLinear().domain(yextent).range([dimensions.boundedHeight, 0]);
        const x = d3.axisBottom(xScale);
        const y = d3.axisLeft(yScale);
        const xAxis = stage.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${dimensions.boundedHeight})`).call(x);
        const yAxis = stage.append('g').attr('class', 'y-axis').call(y);

        const area1 = d3.area()
            // .x0((d) => xScale(xextent[0]))
            // .x1((d) => xScale(xextent[xextent.length - 1]))
            .x((d) => xScale(xAccessor(d)))
            .y0((d) => yScale(yextent[0]))
            .y1((d) => yScale(yAccessor1(d)))
        
        const area2 = d3.area()
            // .x0((d) => xScale(xextent[0]))
            // .x1((d) => xScale(xextent[xextent.length - 1]))
            .x((d) => xScale(xAccessor(d)))
            .y0((d) => yScale(yextent[0]))
            .y1((d) => yScale(yAccessor2(d)))

        dataArea.selectAll('.area-1').data([dataset]).join((enter) => {
            return enter
                .append('path')
                .attr('class', 'area-1')
                .attr('fill', '#006266')
                .attr('stroke', '#117277')
                .attr('opacity', '0.5')
                .attr('d', area1 as any)
                .on('mouseenter', (e, d) => {
                    d3.select(e.target).attr('opacity', 1).raise();
                })
                .on('mouseleave', (e, d) => {
                    d3.select(e.target).attr('opacity', 0.5).lower()
                });
        })
        
        dataArea.selectAll('.area-2').data([dataset]).join((enter) => {
            return enter
                .append('path')
                .attr('class', 'area-2')
                .attr('fill', 'yellow')
                .attr('stroke', 'yellow')
                .attr('opacity', '0.5')
                .attr('d', area2 as any)
                .on('mouseenter', (e, d) => {
                    d3.select(e.target).attr('opacity', 1).raise();
                })
                .on('mouseleave', (e, d) => {
                    d3.select(e.target).attr('opacity', 0.5).lower()
                });
        })
    };

    useEffect(() => {
        const data: any[] = [
            { date: '2018-06-01', iceSearches: 2350, electricSearches: 1016  },
            { date: '2018-07-01', iceSearches: 2501, electricSearches: 956  },
            { date: '2018-08-01', iceSearches: 2445, electricSearches: 1288  },
            { date: '2018-09-01', iceSearches: 2598, electricSearches: 1014  },
            { date: '2018-10-01', iceSearches: 3136, electricSearches: 987  },
            { date: '2018-11-01', iceSearches: 2975, electricSearches: 1367  },
            { date: '2018-12-01', iceSearches: 2875, electricSearches: 890  },
            { date: '2019-01-01', iceSearches: 2389, electricSearches: 1378  },
            { date: '2019-02-01', iceSearches: 2756, electricSearches: 1489  },
            { date: '2019-03-01', iceSearches: 2570, electricSearches: 1024  },
            { date: '2019-04-01', iceSearches: 2372, electricSearches: 998  },
            { date: '2019-05-01', iceSearches: 2641, electricSearches: 1378  },
            { date: '2019-06-01', iceSearches: 2101, electricSearches: 1598  },
            { date: '2019-07-01', iceSearches: 1989, electricSearches: 1689  },
            { date: '2019-08-01', iceSearches: 2401, electricSearches: 1788  },
            { date: '2019-09-01', iceSearches: 2490, electricSearches: 2467  },
            { date: '2019-10-01', iceSearches: 1807, electricSearches: 2589  },
            { date: '2019-11-01', iceSearches: 2010, electricSearches: 2785  },
            { date: '2019-12-01', iceSearches: 2310, electricSearches: 2893  },
            { date: '2020-01-01', iceSearches: 1997, electricSearches: 3856  },
            { date: '2020-02-01', iceSearches: 2187, electricSearches: 3792  },
            { date: '2020-03-01', iceSearches: 1937, electricSearches: 3101  },
            { date: '2020-04-01', iceSearches: 2256, electricSearches: 3928  },
            { date: '2020-05-01', iceSearches: 1912, electricSearches: 3420  },
            { date: '2020-06-01', iceSearches: 1034, electricSearches: 3465  },
            { date: '2020-07-01', iceSearches: 1894, electricSearches: 3864  },
            { date: '2020-08-01', iceSearches: 2081, electricSearches: 3998  },
            { date: '2020-09-01', iceSearches: 1908, electricSearches: 3678  },
            { date: '2020-10-01', iceSearches: 1678, electricSearches: 3729  },
            { date: '2020-11-01', iceSearches: 1863, electricSearches: 4102  },
            { date: '2020-12-01', iceSearches: 1965, electricSearches: 4289  },
        ];
        cb(data);
    });
    
    return (
        <React.Fragment>
            <p>I.C.E vs Electric area line</p>

            <svg ref={ref}>
                <defs>
                    <linearGradient x1="0%" y1="50%" x2="100%" y2="50%" id="myGradient" gradientTransform="rotate(90)">
                        <stop offset="0%" stop-opacity="1" stop-color="green" />
                        <stop offset="50%" stop-opacity="1" stop-color="transparent" />
                        <stop offset="100%" stop-opacity="1" stop-color="red" />
                    </linearGradient>
                </defs>
            </svg>
        </React.Fragment>
    )
}