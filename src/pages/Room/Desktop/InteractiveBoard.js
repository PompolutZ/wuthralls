import React, { useRef, useState, useEffect } from 'react';
import * as SVG from 'svg.js';
import { defineGrid, extendHex } from 'honeycomb-grid';
import Button from '@material-ui/core/Button';

const boardBaseWidth = 757;
const boardBaseHeight = 495;
const scaleFactor = .5;
const baseSize = 55;

const boardPointyArray = [
    [0, 0], [1, 0], [2, 0], [3,0], [4,0], [5,0], [6,0], [7,0], 
    [0, 1], [1, 1], [2, 1], [3,1], [4,1], [5,1], [6,1],
    [0, 2], [1, 2], [2, 2], [3,2], [4,2], [5,2], [6,2], [7,2],
    [0, 3], [1, 3], [2, 3], [3,3], [4,3], [5,3], [6,3],
    [0, 4], [1, 4], [2, 4], [3,4], [4,4], [5,4], [6,4], [7,4],
];

const boardFlatArray = [];

export default function InteractiveBoard({ orientation, scaleFactor }) {
    const [svg, setSvgSingleton] = useState(null);
    const [placement, setPlacement] = useState(orientation);
    const [grid, setGrid] = React.useState(null);

    useEffect(() => {
        redraw();
    }, [orientation, scaleFactor]);

    const redraw = () => {
        let currentSvg = svg || SVG(document.getElementById('svgContainer'));
        currentSvg.clear();
        console.log(orientation);
        const hexProto = {
            orientation: orientation,
            size: 55 * scaleFactor,
            origin: [0, -55 / 2 * scaleFactor],
            render(draw) {
                const { x, y } = this.toPoint();
                const corners = this.corners();
                console.log(this.orientation, corners);
                this.draw = draw
                    .polygon(corners.map(({ x, y }) => `${x},${y}`))
                    .fill('rgba(192,192,192, 0)')
                    .stroke({ width: 1, color: 'magenta' })
                    .translate(x, y);
            }
        };

        // const hexFlatProto = {
        //     orientation: 'flat',
        //     size: 55 * scaleFactor,
        //     origin: [0, -55 / 2 * scaleFactor],
        //     render(draw) {
        //         const { x, y } = this.toPoint();
        //         const corners = this.corners();
        //         console.log(this.orientation, corners);
        //         this.draw = draw
        //             .polygon(corners.map(({ x, y }) => `${x},${y}`))
        //             .fill('rgba(192,192,192, 0)')
        //             .stroke({ width: 1, color: 'magenta' })
        //             .translate(x, y);
        //     }
        // };

        const Hex = extendHex(hexProto);
        const GridFactory = defineGrid(Hex);
        const hexoGrid = GridFactory(boardPointyArray
            // first territory
            // no one territory
            // [0, 5], [1, 5], [2, 5], [3,5], [4,5], [5,5], [6,5],
            // //second territory
            // [0, 6], [1, 6], [2, 6], [3,6], [4,6], [5,6], [6,6], [7,6], 
            // [0, 7], [1, 7], [2, 7], [3,7], [4,7], [5,7], [6,7],
            // [0, 8], [1, 8], [2, 8], [3,8], [4,8], [5,8], [6,8], [7,8],
            // [0, 9], [1, 9], [2, 9], [3,9], [4,9], [5,9], [6,9],
            // [0, 10], [1, 10], [2, 10], [3,10], [4,10], [5,10], [6,10], [7,10],            
        );
        
        hexoGrid.forEach(hex => hex.render(currentSvg, 'teal'));
        setGrid(hexoGrid);
        setSvgSingleton(currentSvg);
    }

    const handleChangePlacement = () => {
        setPlacement(prev => prev === 'pointy' ? 'flat' : 'pointy' );
    }

    return (
        <div style={{ minHeight: 300, backgroundColor: 'lightgray', display: 'flex', flex: '1 0 auto', flexFlow: 'column nowrap', alignItems: 'center', overflow: 'scroll' }}>
            <div style={{ 
                    position: 'relative',                     
                    margin: '2rem',
                    width: orientation === 'pointy' ? boardBaseWidth * scaleFactor : boardBaseHeight * scaleFactor, 
                    height: orientation === 'pointy' ? boardBaseHeight * scaleFactor : boardBaseWidth * scaleFactor,
                 }}>
                <img src={`/assets/boards/1.jpg`} style={{ 
                    position: 'absolute',
                    width: boardBaseWidth * scaleFactor, 
                    height: boardBaseHeight * scaleFactor,
                    opacity: .5,
                    transform: orientation === 'pointy' ? 'rotate(0deg)' : `translate(${-boardBaseHeight * scaleFactor} 0) rotate(90deg)`,
                    transformOrigin: 'top left',
                     }} />
                <div id="svgContainer" style={{ 
                    width: boardBaseWidth * scaleFactor, 
                    height: boardBaseHeight * scaleFactor,
                    boxSizing: 'border-box', 
                    zIndex: 1,
                    position: 'absolute',}}>

                </div>

            </div>
        </div>
    )
}