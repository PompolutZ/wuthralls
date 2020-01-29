import React, { useState, useEffect } from 'react';
import AttackDie from '../../components/AttackDie';
import DefenceDie from '../../components/DefenceDie';
import MagicDie from '../../components/MagicDie';

import * as SVG from 'svg.js';
import { defineGrid, extendHex } from 'honeycomb-grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import { 
    cardsDb,
    boards as boardsData
} from '../../data';

const baseSize = 55;
const baseBoardWidth = 757;
const baseBoardHeight = 495;

const horizontalBoardHexes = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [5, 3],
    [6, 3],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
    [6, 4],
    [7, 4],
];

const noOnesHexesHorizontal = [
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5],
    [6, 5],
];

const renderHex = (hex, svg, color, lethals, blocked, starting) => {
    // render(draw, color) {
    //console.log('RENDER isLethal', hex, lethals.some(([x, y]) => x === hex.x && y === hex.y), blocked)

    const { x, y } = hex.toPoint();
    const corners = hex.corners();
    const hexCenter = hex.center();
    const width = hex.width();
    const height = hex.height();
    const isLethal = lethals.some(([x, y]) => x === hex.x && y === hex.y);
    const isBlocked = blocked.some(([x, y]) => x === hex.x && y === hex.y);
    const isStarting = starting.some(([x, y]) => x === hex.x && y === hex.y);

    const log = () => {
        const element = SVG.get(`hex${hex.x}${hex.y}`); //svg.children().find(c => c.node.id === `hex${hex.x}${hex.y}`);
        //console.log('HEX', element, hex, `hex${hex.x}${hex.y}`);
        console.log(svg.children().length, element);
        //this.style({ cursor: 'pointer', fill: 'red'})
    };

    console.log(width, height)

    const handleMouseOver = () => {
        const element = SVG.get(`hex${hex.x}${hex.y}`); //svg.children().find(c => c.node.id === `hex${hex.x}${hex.y}`);
        if (element) {
            element
                .stop(true, true)
                .attr({ 'stroke-width': 1 })
                .animate(175)
                .attr({ 'stroke-width': 3 });
        }
    };

    const handleMouseOut = () => {
        const element = SVG.get(`hex${hex.x}${hex.y}`);
        if (element) {
            element
                .stop(true, true)
                .attr({ 'stroke-width': 3 })
                .animate(175)
                .attr({ 'stroke-width': 1 });
            // element
            // // .stop(true, true)
            // // .stroke({ width: 3, color: color })
            // // .animate(1000)
            // .stroke({ width: 1, color: color });
        } //svg.children().find(c => c.node.id === `hex${hex.x}${hex.y}`);
    };

    // const lethalGradient = svg.gradient('radial', stop => {
    //     stop.at({ offset: 0.7, color: 'rgba(255,0,0,.2)', opacity: 1});
    //     stop.at({ offset: 0.8, color: 'rgba(255,0,0,.5)', opacity: 1});
    // });
    console.log(isLethal, isBlocked)
    svg.polygon(corners.map(({ x, y }) => `${x},${y}`))
        //.style({ filter: isLethal ? 'drop-shadow(0px 0px 10px red)' : 'drop-shadow(0px 0px 0px white)' })
        .fill(
            isBlocked 
                ? 'dimgray' 
                : isLethal 
                    ? 'red' 
                    : hex.y < 7
                        ? 'rgba(154,205,50, .2)'
                        : hex.y === 5
                            ? 'rgba(70,130,180, .2)'
                            : 'rgba(220,20,60, .2)'
        )
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .attr({ stroke: 'dimgray', 'stroke-width': 1 })
        .translate(x, y)
        .scale(0.9)
        .id(`hex${hex.x}${hex.y}`);
    
        if(isStarting) {
            svg.path("m 10.572581,21.214564 c 0,-0.21165 -0.7654993,-0.73053 -1.7011092,-1.153067 C 5.2659847,18.4332 4.8420488,17.951888 3.33374,13.774281 3.0860214,13.088167 2.5720905,12.526801 2.1916713,12.526801 1.8112521,12.526801 1.5,12.322668 1.5,12.073172 c 0,-0.249496 0.3112521,-0.453629 0.6916713,-0.453629 0.3804192,0 0.8866774,-0.561366 1.1250182,-1.24748 C 3.5550307,9.685949 4.0603108,8.546675 4.4395347,7.840341 4.8187582,7.1340088 5.1290323,6.1523293 5.1290323,5.6588317 c 0,-0.4934971 0.2023566,-0.7722045 0.4496815,-0.6193492 0.6470465,0.3998966 4.9324102,-1.6649547 5.1549702,-2.4838608 0.103005,-0.3790066 0.210962,-0.041502 0.239904,0.7500117 0.04562,1.2475379 -0.148774,1.5055811 -1.4602561,1.938409 C 7.7410182,5.8289589 5.8415474,7.684913 5.154646,9.502872 4.6009536,10.96828 4.8427338,11.615074 5.9496549,11.62963 c 0.6189664,0.0081 0.5653284,0.165323 -0.2777925,0.81406 -0.924329,0.711223 -0.9864158,0.958642 -0.5381768,2.144651 0.706304,1.868832 2.5885465,3.722844 4.3796463,4.313961 1.1609941,0.383162 1.5128781,0.754889 1.5128781,1.598187 0,0.604391 -0.102067,1.098893 -0.226815,1.098893 -0.124748,0 -0.226814,-0.173169 -0.226814,-0.384818 z m 2.303957,-0.595381 c -0.02945,-0.992626 0.32009,-1.379303 1.967943,-2.177014 1.989148,-0.962931 3.071138,-2.164895 3.891759,-4.323291 0.368966,-0.970455 0.258782,-1.215599 -0.806143,-1.793554 -0.688021,-0.373401 -0.932611,-0.68056 -0.553081,-0.694565 0.374244,-0.01381 0.943521,-0.192019 1.26506,-0.396021 1.419555,-0.900643 -2.041763,-5.665973 -4.509134,-6.2078986 -1.105174,-0.2427369 -1.284599,-0.4919988 -1.239595,-1.7220693 0.02894,-0.7910383 0.138999,-1.1320517 0.244573,-0.7578077 0.18554,0.6577222 4.347982,2.7300747 5.472339,2.72451 0.30404,-0.0015 0.441628,0.2869721 0.305752,0.64106 -0.135877,0.3540874 0.05038,1.1195863 0.413899,1.7011086 0.36352,0.581522 0.782861,1.585505 0.931867,2.231073 0.149008,0.645567 0.734659,1.399799 1.301448,1.676071 l 1.030525,0.502314 -1.017182,0.303847 c -0.689612,0.205998 -1.168358,0.865276 -1.486622,2.047214 -0.258191,0.958852 -0.668025,1.8661 -0.910741,2.016107 -0.242716,0.150006 -0.441302,0.771024 -0.441302,1.38004 0,0.766624 -0.252916,1.107301 -0.822053,1.107301 -1.133021,0 -4.488273,1.668189 -4.771644,2.372401 -0.12752,0.316903 -0.247971,0.03303 -0.267668,-0.630826 z m -1.005513,-3.329277 c -0.137399,-0.997984 -0.07749,-1.882561 0.133127,-1.965726 0.542168,-0.21408 0.477939,-2.34375 -0.07068,-2.34375 -0.249496,0 -0.470415,0.255166 -0.490932,0.567036 -0.185948,2.826636 -1.323584,5.364498 -1.323584,2.95268 0,-1.355446 -0.827955,-2.113874 -1.3628458,-1.248403 C 8.497153,15.670739 8.2584457,15.556628 7.8680865,14.827234 7.4786619,14.099588 7.4691135,13.667156 7.8327945,13.228947 8.1310465,12.869575 8.2146962,11.898558 8.0409862,10.812234 7.8812743,9.813452 7.9535362,8.633644 8.2015668,8.190437 8.5916025,7.493482 8.695176,7.578762 8.9681558,8.821631 c 0.173593,0.790364 0.181081,2.049592 0.016639,2.798286 -0.3724209,1.695621 0.9011649,2.459607 1.8765502,1.125688 0.516872,-0.706864 0.506748,-0.951285 -0.0656,-1.583719 -0.8683343,-0.959502 -0.859606,-1.643271 0.02531,-1.982847 0.535005,-0.2053 0.636768,-0.675706 0.427568,-1.976456 -0.228304,-1.4195313 -0.18515,-1.5647421 0.256227,-0.8621868 0.291923,0.4646649 0.418551,1.5363638 0.281396,2.3815528 -0.137155,0.845188 -0.05807,1.536707 0.175737,1.536707 0.23381,0 0.428235,-0.255166 0.432055,-0.567036 0.0047,-0.382695 0.144589,-0.349377 0.430334,0.102487 0.345745,0.546742 0.505576,0.463553 0.871558,-0.453629 l 0.44817,-1.123153 0.02876,1.098354 c 0.01581,0.604094 -0.302204,1.464057 -0.706707,1.911028 -0.906563,1.001739 -0.516443,2.207352 0.714267,2.207352 0.844566,0 0.893274,-0.203455 0.636607,-2.659111 -0.167651,-1.604002 -0.09681,-2.771052 0.178539,-2.941226 0.58311,-0.360382 1.102115,2.16887 0.740613,3.609208 -0.151245,0.602609 -0.04454,1.373328 0.23712,1.712709 0.667236,0.803971 0.139498,2.15117 -0.806867,2.059752 -1.48366,-0.14332 -1.872078,0.0518 -1.872078,0.940442 0,0.498992 -0.189936,0.907258 -0.422079,0.907258 -0.232143,0 -0.496183,0.4593 -0.586756,1.020666 -0.110905,0.687384 -0.246251,0.428166 -0.414494,-0.793851 z")
                .width(width * .8)
                .height(width * .8)
                .translate(x + width * .1 / 2 ,y + width * .8 / 2)
                .id('starting')
        }
};

const offset = 0;
const modifyNoOnesArray = (array, offset) => {
    return offset > 0
        ? array.map(([x, y]) => [x + offset, y]).slice(0, 7 - offset)
        : array.slice(0, 7 - Math.abs(offset));
};

function BoardPlacer({ scale, onInitiaScaleChange, boardOffset }) {
    const [scaleFactor, setScaleFactor] = useState(scale);
    const [draw, setDraw] = useState(null);
    const [boardWidth, setBoardWidth] = useState(baseBoardWidth + Math.abs(boardOffset) * 94);
    const [boardHeight, setBoardHeight] = useState(baseBoardHeight);

    useEffect(() => {
        const { offsetHeight, offsetWidth } = document.getElementById("main_container");
        console.log(offsetHeight, offsetWidth);
        let nextScaleFactor;
        if(offsetHeight > offsetWidth) {
            // scale based on width
            console.log(offsetWidth / baseBoardWidth);
            nextScaleFactor = offsetWidth / (baseBoardWidth + Math.abs(boardOffset) * 94); 
            setScaleFactor(nextScaleFactor);
            onInitiaScaleChange(nextScaleFactor);
        } else {
            setScaleFactor()
        }

        console.log('LOAD');
    }, []);

    useEffect(() => {
        setScaleFactor(scale);
        console.log('SCALE CHANGE')
    }, [scale])

    useEffect(() => {
        const { offsetHeight, offsetWidth } = document.getElementById("main_container");
        let nextScaleFactor;
        if(offsetHeight > offsetWidth) {
            // scale based on width
            console.log(offsetWidth / (baseBoardWidth + Math.abs(boardOffset) * 94));
            nextScaleFactor = offsetWidth / (baseBoardWidth + Math.abs(boardOffset) * 94);
            setScaleFactor(nextScaleFactor);
            onInitiaScaleChange(nextScaleFactor);
        } else {
            setScaleFactor()
        }

        console.log('OFFSET CHANGE')
    }, [boardOffset])

    useEffect(() => {
        const currentDraw = draw ? draw : SVG('svg_container');
        currentDraw.clear();
        const Hex = extendHex({
            orientation: 'flat',
            size: 55 * scaleFactor,
            origin: [0, -55 / 2 * scaleFactor],
        });

        const lethals = [
            ...boardsData[3].lethalHexes[0].map(([x, y]) => boardOffset < 0 ? [x + Math.abs(boardOffset), y] : [x, y]),
            ...boardsData[11].lethalHexes[0].map(([x, y]) => boardOffset > 0 ? [x + boardOffset, y + 6] : [x, y + 6]),
        ]

        const blocked = [
            ...boardsData[3].blockedHexes[0].map(([x, y]) => boardOffset < 0 ? [x + Math.abs(boardOffset), y] : [x, y]),
            ...boardsData[11].blockedHexes[0].map(([x, y]) => boardOffset > 0 ? [x + boardOffset, y + 6] : [x, y + 6]),
        ]

        const startingHexes = [
            ...boardsData[3].startingHexes[0].map(([x, y]) => boardOffset < 0 ? [x + Math.abs(boardOffset), y] : [x, y]),
            ...boardsData[11].startingHexes[0].map(([x, y]) => boardOffset > 0 ? [x + boardOffset, y + 6] : [x, y + 6]),
        ]

        const Grid = defineGrid(Hex);
        Grid
        (
            [
                [0,0], [1,0], [2,0],[3,0], [4,0],
                [0,1], [1,1], [2,1],[3,1], [4,1],
                [0,2], [1,2], [2,2],[3,2], [4,2],
                [0,3], [1,3], [2,3],[3,3], [4,3],
                [0,4], [1,4], [2,4],[3,4], [4,4],
                [0,5], [1,5], [2,5],[3,5], [4,5],
                [0,6], [1,6], [2,6],[3,6], [4,6],
                [0,7], [2,7], [4,7],
                [1,7], [3,7]
                // [1,1], [3,1],
                //[0,1], [1,1], [2,1],[3,1],[4,1]
            ]
        )
        // ([
        //     ...horizontalBoardHexes.map(([x, y]) => boardOffset < 0 ? [x + Math.abs(boardOffset), y] : [x, y]),
        //     ...modifyNoOnesArray(noOnesHexesHorizontal, boardOffset).map(([x, y]) => boardOffset < 0 ? [x + Math.abs(boardOffset), y] : [x, y]),
        //     ...horizontalBoardHexes.map(([x, y]) => boardOffset > 0 ? [x + boardOffset, y + 6] : [x, y + 6]),
        // ])
        .forEach(hex => {
            const { x, y } = hex.toPoint();
            // use hexSymbol and set its position for each hex
            renderHex(hex, currentDraw, 'magenta', [], [], []) //lethals, blocked, startingHexes);
        });
        if(!draw) {
            setDraw(currentDraw);
        }
    }, [scaleFactor]);

    return (
        <div id="main_container"
            style={{
                // backgroundColor: 'orangered',
                flex: 1,
                position: 'relative',
            }}
        >
            <img style={{ 
                width: baseBoardWidth * scaleFactor,
                height: baseBoardHeight * scaleFactor,
                position: 'absolute',
                left: boardOffset < 0 ? Math.abs(boardOffset) * (94 * scaleFactor) : 0,
                transform: 'translate(0, 50px) rotate(90deg)',
                transition: 'all .3s ease-out',
            }}
                src={`/assets/boards/10.jpg`} />
            {/* <img style={{ 
                width: baseBoardWidth * scaleFactor,
                height: baseBoardHeight * scaleFactor,
                position: 'absolute',
                top: baseBoardHeight * scaleFactor,
                left: boardOffset > 0 ? boardOffset * (94 * scaleFactor) : 0,
                transition: 'all .3s ease-out'
            }}
                src={`/assets/boards/12.jpg`} /> */}

            <div
                id="svg_container"
                style={{
                    width: baseBoardWidth * scaleFactor + (Math.abs(boardOffset) * (94 * scaleFactor)),
                    height: baseBoardHeight * 2 * scaleFactor,
                    // background: 'magenta',
                    position: 'absolute',
                    left: '62.5px',
                    top: '-12.5px'
                    // top: '50%',
                    // marginTop: -baseBoardHeight * 2 * scaleFactor / 2
                }}
            >
            </div>
        </div>
    );
}

export default function Playground() {
    const [scale, setScale] = useState(.5);
    const [offset, setOffset] = useState(0);

    const increaseScale = () => {
        setScale(scale => scale + .2);
    }

    const decreaseScale = () => {
        setScale(scale => scale - .2);
    }

    const changeOffsetLeft = () => {
        setOffset(offset => offset > -4 ? offset - 1 : -4)
    }

    const changeOffsetRight = () => {
        setOffset(offset => offset > 3 ? 4 : offset + 1);
    }

    return (
        <div
            style={{
                // background: 'magenta',
                width: '100%',
                height: '100%',
                display: 'flex',
            }}
        >
            <div style={{ backgroundColor: 'orange', flex: '0 1 10%' }}></div>
            <div
                style={{
                    // backgroundColor: 'teal',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{ backgroundColor: 'orange', flex: '0 1 10%', display: 'flex' }}
                >
                    <ButtonBase style={{ flex: 1}} onClick={increaseScale}>Up</ButtonBase>
                    <ButtonBase style={{ flex: 1}} onClick={decreaseScale}>Down</ButtonBase>
                </div>
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        overflow: 'auto',
                    }}
                >
                    <BoardPlacer scale={scale} onInitiaScaleChange={setScale} boardOffset={offset} />
                </div>
                <div
                    style={{ backgroundColor: 'orange', flex: '0 1 10%', display: 'flex' }}
                >
                    <ButtonBase style={{ flex: 1}} onClick={changeOffsetLeft}>Left</ButtonBase>
                    <ButtonBase style={{ flex: 1}} onClick={changeOffsetRight}>Right</ButtonBase>
                </div>
            </div>
            <div style={{ backgroundColor: 'orange', flex: '0 1 10%' }}></div>
        </div>
    );
}
