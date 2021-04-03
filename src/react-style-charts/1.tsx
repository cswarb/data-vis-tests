import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { animated, useSpring } from 'react-spring';

//https://wattenberger.com/blog/react-and-d3

const AnimatedCircle = ({ index }: any) => {
    const wasShowing = useRef(false);

    const style = useSpring({
        config: {
            duration: 1200,
        },
        r: 6,
        opacity: 1,
    });
    
    return (
        <animated.circle {...style}
            cx={index[0] * 15 + 10}
            cy="10"
            fill={
                'cornflowerblue'
            }
        />
    )
}

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
        setVisibleCircles(generateCircles())
    }, 10000);

    //Rather than use D3, use a 'React' way of displaying the data that is inline with how D3 works by...

    return (
        <React.Fragment>
            <p>Circles example: </p>

            <svg>
                {
                    //Looping through the dataset, and creating/destroying elements
                    visibleCircles.map(c => {
                        return <AnimatedCircle {...c} key={c} index={c}></AnimatedCircle>
                    })
                }
            </svg>
        </React.Fragment>
    )
}