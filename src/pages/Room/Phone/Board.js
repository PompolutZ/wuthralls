import React, { useEffect, useState, useRef, useContext } from 'react';
import { defineGrid, extendHex } from 'honeycomb-grid';
import * as SVG from 'svg.js';
import { FirebaseContext } from '../../../firebase';
import { useAuthUser } from '../../../components/Session';
import { Typography } from '@material-ui/core';
import { 
    cardsDb,
    boards as boardsData
} from '../../../data';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ButtonBase from '@material-ui/core/ButtonBase';
import StartingHexElement from './StartingHexElement';
import Upgrade from '../../../components/CommonSVGs/Upgrade';

const baseSize = 55;

const boardHexesArray = [
    // first territory
    [0, 0], [1, 0], [2, 0], [3,0], [4,0], [5,0], [6,0], [7,0], 
    [0, 1], [1, 1], [2, 1], [3,1], [4,1], [5,1], [6,1],
    [0, 2], [1, 2], [2, 2], [3,2], [4,2], [5,2], [6,2], [7,2],
    [0, 3], [1, 3], [2, 3], [3,3], [4,3], [5,3], [6,3],
    [0, 4], [1, 4], [2, 4], [3,4], [4,4], [5,4], [6,4], [7,4],
    // no one territory
    [0, 5], [1, 5], [2, 5], [3,5], [4,5], [5,5], [6,5],
    //second territory
    [0, 6], [1, 6], [2, 6], [3,6], [4,6], [5,6], [6,6], [7,6], 
    [0, 7], [1, 7], [2, 7], [3,7], [4,7], [5,7], [6,7],
    [0, 8], [1, 8], [2, 8], [3,8], [4,8], [5,8], [6,8], [7,8],
    [0, 9], [1, 9], [2, 9], [3,9], [4,9], [5,9], [6,9],
    [0, 10], [1, 10], [2, 10], [3,10], [4,10], [5,10], [6,10], [7,10],     
];

const verticalBoardHexes = [
    [0,0], [1,0], [2,0],[3,0], [4,0],
    [0,1], [1,1], [2,1],[3,1], [4,1],
    [0,2], [1,2], [2,2],[3,2], [4,2],
    [0,3], [1,3], [2,3],[3,3], [4,3],
    [0,4], [1,4], [2,4],[3,4], [4,4],
    [0,5], [1,5], [2,5],[3,5], [4,5],
    [0,6], [1,6], [2,6],[3,6], [4,6],
    [0,7], [2,7], [4,7],
];

const horizontalBoardHexes = [
    [0, 0], [1, 0], [2, 0], [3,0], [4,0], [5,0], [6,0], [7,0], 
    [0, 1], [1, 1], [2, 1], [3,1], [4,1], [5,1], [6,1],
    [0, 2], [1, 2], [2, 2], [3,2], [4,2], [5,2], [6,2], [7,2],
    [0, 3], [1, 3], [2, 3], [3,3], [4,3], [5,3], [6,3],
    [0, 4], [1, 4], [2, 4], [3,4], [4,4], [5,4], [6,4], [7,4],
];

const noOnesHexesHorizontal = [
    [0, 5],[1, 5],[2, 5],[3, 5],[4, 5],[5, 5],[6, 5],
];

const modifyNoOnesArray = (array, offset) => {
    return offset > 0
        ? array.map(([x, y]) => [x + offset, y]).slice(0, 7 - offset)
        : array.slice(0, 7 - Math.abs(offset));
};

const renderHex = (hex, svg, color, lethals, blocked) => {
            // render(draw, color) {
    //console.log('RENDER isLethal', hex, lethals.some(([x, y]) => x === hex.x && y === hex.y), blocked)            

    const { x, y } = hex.toPoint();
    const corners = hex.corners();
    const isLethal = lethals.some(([x, y]) => x === hex.x && y === hex.y);
    const isBlocked = blocked.some(([x, y]) => x === hex.x && y === hex.y);

    const log = () => {
        const element = SVG.get(`hex${hex.x}${hex.y}`); //svg.children().find(c => c.node.id === `hex${hex.x}${hex.y}`);
        //console.log('HEX', element, hex, `hex${hex.x}${hex.y}`);
        console.log(svg.children().length, element);
        //this.style({ cursor: 'pointer', fill: 'red'})
    };

    const handleMouseOver = () => {
        const element = SVG.get(`hex${hex.x}${hex.y}`); //svg.children().find(c => c.node.id === `hex${hex.x}${hex.y}`);
        if(element) {
            element.stop(true, true).attr({ 'stroke-width': 1 }).animate(175).attr({ 'stroke-width': 3 });
        }
    }

    const handleMouseOut = () => {
        const element = SVG.get(`hex${hex.x}${hex.y}`);
        if(element) {
            element.stop(true, true).attr({ 'stroke-width': 3 }).animate(175).attr({ 'stroke-width': 1 });
        }
    }

    svg
        .polygon(corners.map(({ x, y }) => `${x * .96},${y * .96}`))
        //.style({ filter: isLethal ? 'drop-shadow(0px 0px 10px red)' : 'drop-shadow(0px 0px 0px white)' })
        .fill(isBlocked ? 'rgba(192,192,192, .5)' : 'rgba(192,192,192, 0)')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .attr({ stroke: isLethal ? 'red' : 'rgba(255,255,255,.7)', 'stroke-width': isLethal ? 3 : 1})
        .translate(x, y)
        .id(`hex${hex.x}${hex.y}`);
}

const highlightHex = (hex, svg, lethals, blocked) => {
    const { x, y } = hex.toPoint();
    const corners = hex.corners();
    const isLethal = lethals.some(([x, y]) => x === hex.x && y === hex.y);
    const isBlocked = blocked.some(([x, y]) => x === hex.x && y === hex.y);

    const hexElement = SVG.get(`hex${hex.x}${hex.y}`);
    console.log(hexElement, hex.x);
    if(hexElement) {
        hexElement
        .stop(true, true)
        .fill({ opacity: 1, color: isLethal ? 'red' : 'white' })
        .animate(500)
        .fill({ opacity: isBlocked ? .5 : 0, color: isLethal ? 'red' : 'white' });
    }
}

const getGridFactory = (scaleFactor, orientation) => {
    const hexProto = {
        baseSize: baseSize,
        scaleFactor: .5,
        orientation: orientation === 'horizontal' ? 'pointy' : 'flat',
        size: 55 * scaleFactor,
        origin: orientation === 'horizontal' ? [0, -55 / 2 * scaleFactor] : [-55 / 2 * scaleFactor, 0],
        highlight(svg) {
            svg
                .stop(true, true)
                .fill({ opacity: 1, color: 'white' })
                .animate(500)
                .fill({ opacity: 0, color: 'white' });
        },
    };
    
    const Hex = extendHex(hexProto);
    return defineGrid(Hex);
}

const getGrid = (scaleFactor, orientation, offset) =>  {
    const hexProto = {
        baseSize: baseSize,
        scaleFactor: .5,
        orientation: orientation === 'horizontal' ? 'pointy' : 'flat',
        size: 55 * scaleFactor,
        origin: orientation === 'horizontal' ? [0, -55 / 2 * scaleFactor] : [-55 / 2 * scaleFactor, 0],
        highlight(svg) {
            svg
                .stop(true, true)
                .fill({ opacity: 1, color: 'white' })
                .animate(500)
                .fill({ opacity: 0, color: 'white' });
        },
    };
    
    const Hex = extendHex(hexProto);
    const Grid = defineGrid(Hex);

    return Grid(orientation === 'horizontal' ? [
            ...horizontalBoardHexes.map(([x, y]) => offset < 0 ? [x + Math.abs(offset), y] : [x, y]),
            ...modifyNoOnesArray(noOnesHexesHorizontal, offset).map(([x, y]) => offset < 0 ? [x + Math.abs(offset), y] : [x, y]),
            ...horizontalBoardHexes.map(([x, y]) => offset > 0 ? [x + offset, y + 6] : [x, y + 6]),
        ] : [
            ...verticalBoardHexes,
            ...[[1,7], [3,7]],
            ...verticalBoardHexes.map(([x, y]) => [x, y + 8])
        ]
    );
}

export default function Board({ state, selectedElement, scaleFactor, onScaleFactorChange }) {
    const baseBoardWidth = 757;
    const baseBoardHeight = 495;
    const baseSize = 55;
    const pointyTokenBaseWidth = 95;

    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const rootRef = useRef(null);
    const [svg, setSvg] = React.useState(null);
    const [grid, setGrid] = React.useState(null);
    const [tokenHexes, setTokenHexes] = useState(state.board.tokens);
    const [fighters, setFighters] = useState(state.board.fighters);
    const [scatterToken, setScatterToken] = useState({
        id: 'SCATTER_TOKEN',
        type: 'SCATTER_TOKEN',
        isOnBoard: false,
        rotationAngle: 0,
        onBoard: {x: -1, y: -1},
        top: -10000,
        left: -10000,
    })    
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    //const [scaleFactor, setScaleFactor] = useState(.5);
    const [scaleFactorModifier, setScaleFactorModifier] = useState(1);
    const [myData, setMyData] = useState(state[myself.uid]);
    const [opponentData, setOpponentData] = useState(state.players.length > 1 ? state[state.players.find(p => p !== myself.uid)] : null)
    const [startingHexes, setStartingHexes] = useState(state.status.stage === 'READY' ?
        state.status.orientation === 'horizontal' ? [
            ...boardsData[state.status.top.id][state.status.orientation].startingHexes[state.status.top.rotate].map(([x, y]) => state.status.offset < 0 ? [x + Math.abs(state.status.offset), y] : [x, y]),
            ...boardsData[state.status.bottom.id][state.status.orientation].startingHexes[state.status.bottom.rotate].map(([x, y]) => state.status.offset > 0 ? [x + state.status.offset, y + 6] : [x, y + 6]),
        ] : [
            ...boardsData[state.status.top.id][state.status.orientation].startingHexes[state.status.top.rotate], // .map(([x, y]) => offset < 0 ? [x + Math.abs(offset), y] : [x, y])
            ...boardsData[state.status.bottom.id][state.status.orientation].startingHexes[state.status.bottom.rotate].map(([x, y]) => [x, y + 8]),
        ] : []
    )
    
    useEffect(() => {
        if(state.status.stage !== 'READY') return;

        const mainContainer = document.getElementById('mainContainer');
    }, []);

    useEffect(() => {

        if(state.status.stage !== 'READY') return;
        
        const currentSvg = svg ? svg : SVG(rootRef.current);
        currentSvg.clear();
        setSvg(currentSvg);
        const initGrid = getGrid(scaleFactor, state.status.orientation, state.status.offset);

        const lethals = state.status.orientation === 'horizontal' ? [
            ...boardsData[state.status.top.id][state.status.orientation].lethalHexes[state.status.top.rotate].map(([x, y]) => state.status.offset < 0 ? [x + Math.abs(state.status.offset), y] : [x, y]),
            ...boardsData[state.status.bottom.id][state.status.orientation].lethalHexes[state.status.bottom.rotate].map(([x, y]) => state.status.offset > 0 ? [x + state.status.offset, y + 6] : [x, y + 6]),
        ] : [
            ...boardsData[state.status.top.id][state.status.orientation].lethalHexes[state.status.top.rotate], // .map(([x, y]) => offset < 0 ? [x + Math.abs(offset), y] : [x, y])
            ...boardsData[state.status.bottom.id][state.status.orientation].lethalHexes[state.status.bottom.rotate].map(([x, y]) => [x, y + 8]),
        ]

        const blocked = state.status.orientation === 'horizontal' ? [
            ...boardsData[state.status.top.id][state.status.orientation].blockedHexes[state.status.top.rotate].map(([x, y]) => state.status.offset < 0 ? [x + Math.abs(state.status.offset), y] : [x, y]),
            ...boardsData[state.status.bottom.id][state.status.orientation].blockedHexes[state.status.bottom.rotate].map(([x, y]) => state.status.offset > 0 ? [x + state.status.offset, y + 6] : [x, y + 6]),
        ] : [
            ...boardsData[state.status.top.id][state.status.orientation].blockedHexes[state.status.top.rotate], // .map(([x, y]) => offset < 0 ? [x + Math.abs(offset), y] : [x, y])
            ...boardsData[state.status.bottom.id][state.status.orientation].blockedHexes[state.status.bottom.rotate].map(([x, y]) => [x, y + 8]),
        ]

        initGrid.forEach(hex => {
            renderHex(hex, currentSvg, 'rgba(255,255,255, 1)', lethals, blocked);
        })
        setGrid(initGrid);
    }, [scaleFactor])

    useEffect(() => {
        //console.log('Board.OnSelectedElementChange', selectedElement);

        if(selectedElement && selectedElement.type === 'SCATTER_TOKEN') {
            setScatterToken({
                ...scatterToken,
                rotationAngle: selectedElement.rotationAngle,
                isOnBoard: selectedElement.isOnBoard,
            });
        }

        if(!selectedElement){
            setSelectedTokenId(null);
        } else {
            setSelectedTokenId(selectedElement.id);
        }
    }, [selectedElement]);

    useEffect(() => {
        setTokenHexes(state.board.tokens);
        setFighters(state.board.fighters);

        if(state.status.stage === 'READY') {
            setStartingHexes(
                state.status.orientation === 'horizontal' ? [
                    ...boardsData[state.status.top.id][state.status.orientation].startingHexes[state.status.top.rotate].map(([x, y]) => state.status.offset < 0 ? [x + Math.abs(state.status.offset), y] : [x, y]),
                    ...boardsData[state.status.bottom.id][state.status.orientation].startingHexes[state.status.bottom.rotate].map(([x, y]) => state.status.offset > 0 ? [x + state.status.offset, y + 6] : [x, y + 6]),
                ] : [
                    ...boardsData[state.status.top.id][state.status.orientation].startingHexes[state.status.top.rotate], // .map(([x, y]) => offset < 0 ? [x + Math.abs(offset), y] : [x, y])
                    ...boardsData[state.status.bottom.id][state.status.orientation].startingHexes[state.status.bottom.rotate].map(([x, y]) => [x, y + 8]),
                ]
            );
        }
    }, [state]);

    useEffect(() => {
        const featureTokens = Object.entries(tokenHexes).filter(([k, v]) => {
            return k.startsWith('Feature') && v.isOnBoard && !v.isRevealed;
        });

        if(featureTokens.length < 5) return;

        const update = {
            ...tokenHexes,
            ...featureTokens.reduce((r, [k, v]) => ({...r, [k]: {...v, isRevealed: true, isLethal: false, }}), {})
        };
        setTokenHexes(update);

        // console.log('TOKEN HEXES', tokenHexes);
        firebase.updateBoardProperty(state.id, 'board.tokens', update);
        firebase.addGenericMessage2(state.id, {
            author: 'Katophrane',
            type: 'INFO',
            value: `All feature hexes has been revealed.`,
        })
    }, [tokenHexes]);

    const handleIncreazeScaleFactor = () => {
        onScaleFactorChange(prev => prev * 1.2);
    }

    const handleDecreaseScaleFactor = () => {
        onScaleFactorChange(prev => prev * .8);
    }

    const handleClick = e => {
        const { offsetX, offsetY } = e.nativeEvent;
        const hex = getGridFactory(scaleFactor, state.status.orientation).pointToHex([offsetX, offsetY]);
        const hexes = state.status.orientation === 'horizontal' ? [
            ...horizontalBoardHexes.map(([x, y]) => state.status.offset < 0 ? [x + Math.abs(state.status.offset), y] : [x, y]),
            ...modifyNoOnesArray(noOnesHexesHorizontal, state.status.offset).map(([x, y]) => state.status.offset < 0 ? [x + Math.abs(state.status.offset), y] : [x, y]),
            ...horizontalBoardHexes.map(([x, y]) => state.status.offset > 0 ? [x + state.status.offset, y + 6] : [x, y + 6]),
        ] : [
            ...verticalBoardHexes,
            ...[[1,7], [3,7]],
            ...verticalBoardHexes.map(([x, y]) => [x, y + 8])
        ];
        const isHexOnBoard = hexes.find(([x, y]) => hex.x === x && hex.y === y);

        if(!isHexOnBoard) return;
        const lethals = state.status.orientation === 'horizontal' ? [
            ...boardsData[state.status.top.id][state.status.orientation].lethalHexes[state.status.top.rotate].map(([x, y]) => state.status.offset < 0 ? [x + Math.abs(state.status.offset), y] : [x, y]),
            ...boardsData[state.status.bottom.id][state.status.orientation].lethalHexes[state.status.bottom.rotate].map(([x, y]) => state.status.offset > 0 ? [x + state.status.offset, y + 6] : [x, y + 6]),
        ] : [
            ...boardsData[state.status.top.id][state.status.orientation].lethalHexes[state.status.top.rotate], // .map(([x, y]) => offset < 0 ? [x + Math.abs(offset), y] : [x, y])
            ...boardsData[state.status.bottom.id][state.status.orientation].lethalHexes[state.status.bottom.rotate].map(([x, y]) => [x, y + 8]),
        ]

        const blocked = state.status.orientation === 'horizontal' ? [
            ...boardsData[state.status.top.id][state.status.orientation].blockedHexes[state.status.top.rotate].map(([x, y]) => state.status.offset < 0 ? [x + Math.abs(state.status.offset), y] : [x, y]),
            ...boardsData[state.status.bottom.id][state.status.orientation].blockedHexes[state.status.bottom.rotate].map(([x, y]) => state.status.offset > 0 ? [x + state.status.offset, y + 6] : [x, y + 6]),
        ] : [
            ...boardsData[state.status.top.id][state.status.orientation].blockedHexes[state.status.top.rotate], // .map(([x, y]) => offset < 0 ? [x + Math.abs(offset), y] : [x, y])
            ...boardsData[state.status.bottom.id][state.status.orientation].blockedHexes[state.status.bottom.rotate].map(([x, y]) => [x, y + 8]),
        ]

        if(hex) {
            // console.log("ping")
            highlightHex(hex, svg, lethals, blocked);
            if(selectedTokenId) {
                if(selectedElement.type === 'SCATTER_TOKEN') {
                    console.log('SCATTER', hex);
                    setScatterToken({
                        ...scatterToken,
                        onBoard: { x: hex.x, y: hex.y }
                    })
                } else if(selectedElement.type === 'FIGHTER') {
                    const updatedFighter = {
                        ...fighters[selectedTokenId],
                        from: fighters[selectedTokenId].isOnBoard ? fighters[selectedTokenId].onBoard : {x: -1, y: -1 },
                        isOnBoard: true,
                        onBoard: { x: hex.x, y: hex.y },
                    }
                    
                    setFighters({
                        ...fighters,
                        [selectedTokenId]: updatedFighter,
                    });

                    firebase.updateBoardProperty(state.id, `board.fighters.${selectedTokenId}`, updatedFighter);
                    firebase.addGenericMessage2(state.id, {
                        author: 'Katophrane',
                        type: 'INFO',
                        subtype: 'PLACEMENT',
                        value: `${myself.username} placed ${selectedTokenId.startsWith(myself.uid) ? 'HIS' : 'ENEMIES'} ${fighters[selectedTokenId].name} to (${hex.x},${hex.y}).`,
                    })
                } else {
                    // console.log("ping");
                    const updatedToken = {
                        ...tokenHexes[selectedTokenId],
                        from: tokenHexes[selectedTokenId].isOnBoard ? tokenHexes[selectedTokenId].onBoard : {x: -1, y: -1 },
                        isOnBoard: true,
                        onBoard: { x: hex.x, y: hex.y },
                    };
                    firebase.updateBoardProperty(state.id, `board.tokens.${selectedTokenId}`, updatedToken);
                    firebase.addGenericMessage2(state.id, {
                        author: 'Katophrane',
                        type: 'INFO',
                        subtype: 'PLACEMENT',
                        value: `${myself.username} placed ${selectedTokenId} to (${hex.x},${hex.y}).`,
                    })
                    setTokenHexes({
                        ...tokenHexes,
                        [selectedTokenId]: updatedToken 
                    })
                }
            } else {
                const anyFighter = Object.entries(fighters).find(([fighterId, f]) => f.onBoard.x === hex.x && f.onBoard.y === hex.y);
                console.log('ANY FIGHTER?:', anyFighter);
            }
        }
    }

    if(state.status.stage !== 'READY') {
        return (
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <div style={{ margin: 'auto'}}>
                    Waiting for players to select board pieces...
                </div>
            </div>
        )
    }

    const scatterTokenHex = scatterToken && scatterToken.isOnBoard ? getGrid(scaleFactor, state.status.orientation, state.status.offset).get(scatterToken.onBoard) : null;
    const { x: scatterTokenX, y: scatterTokenY } = scatterTokenHex ? scatterTokenHex.toPoint() : { x: -10, y: -10};
    const myHand = myData && myData.hand ? myData.hand.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })) : [];
    const opponentHand = opponentData && opponentData.hand ? opponentData.hand.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })) : [];

    return (
        <div id="mainContainer" style={{ display: 'flex', flexFlow: 'row wrap', backgroundColor: 'dimgray', color: 'white', margin: 'auto' }}>
            <div style={{ flex: '0 0 100%', display: 'flex', borderBottom: '1px solid lighgray', paddingBottom: '.2rem', marginBottom: '.2rem', alignItems: 'center' }}>
                {
                    myData && (
                        <div style={{ display: 'flex', flexDirection: 'row-reverse', flex: 1, borderRight: '1px solid gray', paddingRight: '.2rem', alignItems: 'center' }}>
                            <img src={`/assets/factions/${myData.faction}-icon.png`} style={{ width: '1.5rem', height: '1.5rem' }} />
                            <div style={{ marginRight: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'goldenrod', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                                <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{myData.gloryScored}</Typography>
                            </div>
                            <div style={{ marginRight: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'darkgray', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                                <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{myData.glorySpent}</Typography>
                            </div>
                            <div style={{ marginRight: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'teal', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                                <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{myData.activationsLeft}</Typography>
                            </div>
                            <div style={{ marginRight: '.2rem', width: '1rem', height: '1.5rem', backgroundColor: 'goldenrod', borderRadius: '.2rem', color: 'white', display: 'flex' }}>
                                <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{myHand.filter(c => c.type === 0).length}</Typography>
                            </div>
                            <div style={{ marginRight: '.2rem', width: '1rem', height: '1.5rem', backgroundColor: 'teal', borderRadius: '.2rem', color: 'white', display: 'flex' }}>
                                <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{myHand.filter(c => c.type !== 0).length}</Typography>
                            </div>
                            <ButtonBase onClick={handleIncreazeScaleFactor} style={{ flex: 1}}>
                                <ZoomInIcon />
                            </ButtonBase>
                        </div>
                    )
                }
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto .5rem auto .5rem' }}>
                    <Typography style={{ fontSize: '.7rem'}}>{state.status.round}</Typography>
            <Typography style={{ fontSize: '.5rem'}}>round</Typography>
                </div>
                {
                    opponentData && (
                        <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                            <img src={`/assets/factions/${opponentData.faction}-icon.png`} style={{ width: '1.5rem', height: '1.5rem', borderLeft: '1px solid gray', paddingLeft: '.2rem' }} />
                            <div style={{ marginLeft: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'goldenrod', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                                <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{opponentData.gloryScored}</Typography>
                            </div>
                            <div style={{ marginLeft: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'darkgray', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                                <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{opponentData.glorySpent}</Typography>
                            </div>
                            <div style={{ marginLeft: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'teal', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                                <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{opponentData.activationsLeft}</Typography>
                            </div>
                            <div style={{ marginLeft: '.2rem', width: '1rem', height: '1.5rem', backgroundColor: 'goldenrod', borderRadius: '.2rem', color: 'white', display: 'flex' }}>
                                <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{opponentHand.filter(c => c.type === 0).length}</Typography>
                            </div>
                            <div style={{ marginLeft: '.2rem', width: '1rem', height: '1.5rem', backgroundColor: 'teal', borderRadius: '.2rem', color: 'white', display: 'flex' }}>
                                <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{opponentHand.filter(c => c.type !== 0).length}</Typography>
                            </div>
                            <ButtonBase onClick={handleDecreaseScaleFactor}>
                                <ZoomOutIcon />
                            </ButtonBase>
                        </div>
                    )
                }
            </div>
            <div style={{ display: 'flex', flex: '1 0 100%', backgroundColor: 'dimgray', }}>
                <div
                    style={{
                        position: 'relative',
                        width: state.status.orientation === 'horizontal' ? baseBoardWidth * scaleFactor + (Math.abs(state.status.offset) * (94 * scaleFactor)) : baseBoardHeight * scaleFactor, //baseBoardWidth * scaleFactor, //baseBoardHeight * 2 * scaleFactor,//baseBoardWidth * scaleFactor + (Math.abs(boardOffset) * (94 * scaleFactor)),
                        height: state.status.orientation === 'horizontal' ? baseBoardHeight * 2 * scaleFactor : baseBoardWidth * 2 * scaleFactor, //baseBoardWidth * scaleFactor * 2, //baseBoardHeight * 2 * scaleFactor,
                        margin: 'auto',
                        filter: 'drop-shadow(5px 5px 10px black)'
                    }}
                >
                    <TopBoard baseBoardWidth={baseBoardWidth}
                        baseBoardHeight={baseBoardHeight}
                        boardId={state.status.top.id}
                        orientation={state.status.orientation}
                        offset={state.status.offset}
                        rotate={state.status.top.rotate}
                        scaleFactor={scaleFactor} />
                    {/* <img
                        src={`/assets/boards/${state.status.top.id}${state.status.orientation === 'horizontal' ? '' : 'v'}.jpg`}
                        //src={`/assets/boards/1.jpg`}
                        alt="board"
                        style={{
                            opacity: .8,
                            width: state.status.orientation === 'horizontal' ? baseBoardWidth * scaleFactor : baseBoardHeight * scaleFactor,
                            height: state.status.orientation === 'horizontal' ? baseBoardHeight * scaleFactor : baseBoardWidth * scaleFactor,
                            position: 'absolute',
                            left: state.status.orientation === 'horizontal' && state.status.offset < 0 ? (Math.abs(state.status.offset) * (94 * scaleFactor)) : 0,
                            zIndex: '1',
                            transformOrigin: 'center center',
                            transform: `rotate(${state.status.top.rotate}deg)`,
                            // transform: `rotate(0deg)`,
                        }}
                    /> */}
                    <img
                        //src={`/assets/boards/10.jpg`}
                        src={`/assets/boards/${state.status.bottom.id}${state.status.orientation === 'horizontal' ? '' : 'v'}.jpg`}
                        alt="board2"
                        style={{
                            opacity: .8,
                            width: state.status.orientation === 'horizontal' ? baseBoardWidth * scaleFactor : baseBoardHeight * scaleFactor,
                            height: state.status.orientation === 'horizontal' ? baseBoardHeight * scaleFactor : baseBoardWidth * scaleFactor,
                            position: 'absolute',
                            zIndex: '1',
                            top: state.status.orientation === 'horizontal' ? baseBoardHeight * scaleFactor : baseBoardWidth * scaleFactor,
                            left: state.status.orientation === 'horizontal' && state.status.offset > 0 ? (Math.abs(state.status.offset) * (94 * scaleFactor)) : 0,
                            transformOrigin: 'center center',
                            transform: `rotate(${state.status.bottom.rotate}deg)`,
                            //transform: `rotate(0deg)`,
                        }}
                    />
                    {
                        startingHexes.map((hex) => {
                            const { x, y } = getGrid(scaleFactor, state.status.orientation, state.status.offset).get(hex).toPoint();
                            return (
                                <StartingHexElement key={`${hex[0]}:${hex[1]}`} x={state.status.orientation === 'horizontal' ? x : x + (baseSize * scaleFactor) / 2 + 4} y={state.status.orientation === 'horizontal' ? y : y - (baseSize * scaleFactor) / 2 - 4} pointyTokenBaseWidth={pointyTokenBaseWidth} scaleFactor={scaleFactor} baseSize={baseSize} />
                            ); 
                        })
                    }
                    <div
                        style={{
                            width: state.status.orientation === 'horizontal' ? baseBoardWidth * scaleFactor + (Math.abs(state.status.offset) * (94 * scaleFactor)) : baseBoardHeight * scaleFactor, //baseBoardWidth * scaleFactor, //baseBoardHeight * 2 * scaleFactor,//baseBoardWidth * scaleFactor + (Math.abs(boardOffset) * (94 * scaleFactor)),
                            height: state.status.orientation === 'horizontal' ? baseBoardHeight * 2 * scaleFactor : baseBoardWidth * 2 * scaleFactor, //baseBoardWidth * scaleFactor * 2, //baseBoardHeight * 2 * scaleFactor,
                            position: 'absolute',
                            top: state.status.orientation === 'horizontal' ? '50%' : 0,
                            left: state.status.orientation === 'horizontal' ? 0 : '50%',
                            marginTop: state.status.orientation === 'horizontal' ? -baseBoardHeight * 2 * scaleFactor / 2 : 0,
                            marginLeft: state.status.orientation === 'horizontal' ? 0 : -(baseBoardHeight * scaleFactor) / 2,
                            zIndex: 700,
                        }}
                        ref={rootRef}
                        onClick={handleClick}
                    />
                    {
                        tokenHexes && Object.entries(tokenHexes).map(([k, hex], index) => {
                            
                            if(k.startsWith('Lethal') && hex.isOnBoard) {
                                const {x, y} = getGrid(scaleFactor, state.status.orientation, state.status.offset).get(hex.onBoard).toPoint();
                                return (
                                    <div key={k} style={{
                                        position: 'absolute',
                                        zIndex: 500,
                                        width: pointyTokenBaseWidth * scaleFactor,
                                        top: state.status.orientation === 'horizontal' ? y + (baseSize * scaleFactor) / 2 : y -4,
                                        left: state.status.orientation === 'horizontal' ? x : x + (baseSize * scaleFactor) / 2 + 4,
                                        transform: `rotate(${state.status.orientation === 'horizontal' ? 0 : 30}deg)`,
                                        transformOrigin: 'center center',
                                    }}>
                                        <img
                                            src={`/assets/tokens/lethal.png`}
                                            style={{
                                                width: pointyTokenBaseWidth * scaleFactor,
                                            }}
                                        />
                                        <div style={{ 
                                            position: 'absolute',
                                            zIndex: 501,
                                            width: pointyTokenBaseWidth * scaleFactor,
                                            height: pointyTokenBaseWidth * scaleFactor,
                                            borderRadius: `${pointyTokenBaseWidth * scaleFactor / 2}px`, 
                                            top: '5px',
                                            left: 0,
                                            boxShadow: k === selectedTokenId ? '0 0 35px 13px rgba(255,0,0, .7)' : '0 0 12.5px 5px rgba(255,0,0, .7)',
                                        }} />
                                    </div>
                                );
                            }

                            if(k.startsWith('Feature') && hex.isOnBoard) {
                                const {x, y} = getGrid(scaleFactor, state.status.orientation, state.status.offset).get(hex.onBoard).toPoint();
                                return (
                                    <div key={k} style={{
                                        position: 'absolute',
                                        zIndex: 500,
                                        width: pointyTokenBaseWidth * scaleFactor,
                                        top: state.status.orientation === 'horizontal' ? y + (baseSize * scaleFactor) / 2 : y -4,
                                        left: state.status.orientation === 'horizontal' ? x : x + (baseSize * scaleFactor) / 2,
                                        transform: `rotate(${state.status.orientation === 'horizontal' ? 0 : 30}deg)`,
                                        transformOrigin: 'center center',
                                        }}>
                                        <img
                                                src={
                                                    hex.isLethal
                                                        ? `/assets/tokens/feature_back.png`
                                                        : `/assets/tokens/feature_front_${hex.number}.png`
                                                }
                                                style={{ width: pointyTokenBaseWidth * scaleFactor, }} />
                                        <div style={{ 
                                            position: 'absolute',
                                            zIndex: 501,
                                            width: pointyTokenBaseWidth * scaleFactor,
                                            height: pointyTokenBaseWidth * scaleFactor,
                                            borderRadius: `${pointyTokenBaseWidth * scaleFactor / 2}px`, 
                                            top: '5px',
                                            left: 0,
                                            boxShadow: k === selectedTokenId ? `0 0 35px 13px ${hex.isLethal ? 'rgba(255,0,0, .7)' : 'rgba(255,215,0, .7)'}` : `0 0 12.5px 5px ${hex.isLethal ? 'rgba(255,0,0, .7)' : 'rgba(255,215,0, .7)'}`,
                                        }} />
                                    </div>
                                );
                            }
                        })
                    }
                    {
                        fighters && Object.entries(fighters).map(([k, fighter]) => {
                            if(fighter.isOnBoard) {
                                const { x, y } = getGrid(scaleFactor, state.status.orientation, state.status.offset).get(fighter.onBoard).toPoint();

                                return (
                                    <div
                                        key={k}
                                        style={{
                                            position: 'absolute',
                                            zIndex: !fighter.subtype ? 600 : 599,
                                            width: 80 * scaleFactor,
                                            height: 80 * scaleFactor,
                                            top: state.status.orientation === 'horizontal' ? y + ((95 - 80) * scaleFactor) * 2.75 -4 : y, //  + (((95 - 80) * scaleFactor) * 2.75 -4) * .5
                                            left: state.status.orientation === 'horizontal' ? x + ((95 - 80) * scaleFactor) / 2 -4 : x + (baseSize * scaleFactor) / 2 + 4, // + (((95 - 80) * scaleFactor) / 2 -4) * .5
                                            border: k.startsWith(myself.uid) ? '3px solid limegreen' : '3px solid red',
                                            borderRadius: 80,
                                            boxShadow: k === selectedTokenId ? k.startsWith(myself.uid) ? '0 0 7px 7px limegreen' : '0 0 7px 7px red' : '',
                                        }}>
                                            <img src={`/assets/fighters/${fighter.icon}-icon.png`} style={{ width: '100%', transform: !k.startsWith(myself.uid) ? 'scaleX(-1)' : '', }} />
                                            {
                                                !fighter.subtype && (
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        zIndex: 601, 
                                                        width: '2rem', 
                                                        height: '2rem', 
                                                        backgroundColor: 'darkred',
                                                        display: 'flex',
                                                        border: '1px solid white',
                                                        borderRadius: '1rem',
                                                        top: '-.5rem',
                                                        left: '-.5rem',
                                                        transformOrigin: 'center center',
                                                        transform: `scale(${scaleFactor})`,
                                                        boxSizing: 'boarder-box', verticalAlign: 'middle' }}>
                                                        <Typography style={{ fontSize: '1.5rem', margin: 'auto', color: 'white', verticalAlign: 'middle'}}>{fighter.wounds}</Typography>
                                                    </div>
                                                )
                                            }
                                            {
                                                fighter.tokens && (
                                                    <div style={{ 
                                                        position: 'absolute',
                                                        display: 'flex',
                                                        bottom: -((75 / 2) * scaleFactor) / 2,
                                                    }}>
                                                        {
                                                            fighter.tokens.split(',').map((t, idx) => (
                                                                <div key={idx} style={{
                                                                    backgroundImage: `url(/assets/other/${t}.png)`,
                                                                    width: (75 / 2) * scaleFactor,
                                                                    height: (75 / 2) * scaleFactor,
                                                                    backgroundSize: 'cover',
                                                                    boxSizing: 'border-box',
                                                                    border: '1px solid white',
                                                                    marginRight: '.2rem'
                                                                }} />
                                                            ))
                                                        }
                                                    </div>
                                                )
                                            }
                                    </div>
                                )
                            }
                        })
                    }
                    {
                        scatterToken && scatterToken.isOnBoard && (
                            <img
                                src={`/assets/other/scatter.png`}
                                style={{
                                    position: 'absolute',
                                    zIndex: 550,
                                    width: pointyTokenBaseWidth * scaleFactor,
                                    top: scatterTokenY < 0 ? -10000 : state.status.orientation === 'horizontal' ? scatterTokenY + (baseSize * scaleFactor) / 2 : scatterTokenY - 4,
                                    left: scatterTokenX < 0 ? -10000 : state.status.orientation === 'horizontal' ? scatterTokenX : scatterTokenX + (baseSize * scaleFactor) / 2,
                                    transform: `rotate(${scatterToken.rotationAngle}deg)`, 
                                    transformOrigin: 'center center',
                                }}
                            />
                        )
                    }
                </div>
            </div>
            <div style={{ flex: '0 0 100%', height: '3rem'}}>

            </div>
        </div>
    );
}

const TopBoard = React.memo(({ baseBoardWidth, baseBoardHeight, boardId, orientation, offset, rotate, scaleFactor }) => 
<img
    src={`/assets/boards/${boardId}${orientation === 'horizontal' ? '' : 'v'}.jpg`}
    //src={`/assets/boards/1.jpg`}
    alt="board"
    style={{
        opacity: .8,
        width: orientation === 'horizontal' ? baseBoardWidth * scaleFactor : baseBoardHeight * scaleFactor,
        height: orientation === 'horizontal' ? baseBoardHeight * scaleFactor : baseBoardWidth * scaleFactor,
        position: 'absolute',
        left: orientation === 'horizontal' && offset < 0 ? (Math.abs(offset) * (94 * scaleFactor)) : 0,
        zIndex: '1',
        transformOrigin: 'center center',
        transform: `rotate(${rotate}deg)`,
        // transform: `rotate(0deg)`,
    }}
/>
)

