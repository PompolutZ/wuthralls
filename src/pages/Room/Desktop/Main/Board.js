import React, { useEffect, useState, useRef, useContext } from 'react';
import { defineGrid, extendHex } from 'honeycomb-grid';
import * as SVG from 'svg.js';
import { FirebaseContext } from '../../../../firebase';
import { useAuthUser } from '../../../../components/Session';
import { Typography } from '@material-ui/core';
import { 
    cardsDb,
    boards as boardsData
} from '../../../../data';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ButtonBase from '@material-ui/core/ButtonBase';
import StartingHex from '../../../../components/CommonSVGs/StartingHex';
import StartingHexElement from './StartingHexElement';


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

const renderHex = (hex, svg, color, lethals, blocked) => {
            // render(draw, color) {
    console.log('RENDER isLethal', hex, lethals.some(([x, y]) => x === hex.x && y === hex.y), blocked)            

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
            // element
            // // .stop(true, true)
            // // .stroke({ width: 3, color: color })
            // // .animate(1000)
            // .stroke({ width: 1, color: color });
        } //svg.children().find(c => c.node.id === `hex${hex.x}${hex.y}`);
    }


    // const lethalGradient = svg.gradient('radial', stop => {
    //     stop.at({ offset: 0.7, color: 'rgba(255,0,0,.2)', opacity: 1});
    //     stop.at({ offset: 0.8, color: 'rgba(255,0,0,.5)', opacity: 1});
    // });

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

const highlightHex = (hex, svg) => {
    const { x, y } = hex.toPoint();
    const corners = hex.corners();

    const hexElement = SVG.get(`hex${hex.x}${hex.y}`);
    if(hexElement) {
        hexElement
        .stop(true, true)
        .fill({ opacity: 1, color: 'white' })
        .animate(500)
        .fill({ opacity: 0, color: 'white' });
    }
    // svg
    //     .polygon(corners.map(({ x, y }) => `${x},${y}`))
    //     .translate(x, y)
        // .stop(true, true)
        // .fill({ opacity: 1, color: 'white' })
        // .animate(3000)
        // .fill({ opacity: 0, color: 'white' });
}

const getGridFactory = scaleFactor => {
    const hexProto = {
        baseSize: baseSize,
        scaleFactor: .5,
        orientation: 'pointy',
        size: 55 * scaleFactor,
        origin: [0, -55 / 2 * scaleFactor],
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

const getGrid = scaleFactor =>  {
    const hexProto = {
        baseSize: baseSize,
        scaleFactor: .5,
        orientation: 'pointy',
        size: 55 * scaleFactor,
        origin: [0, -55 / 2 * scaleFactor],
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

    return Grid(boardHexesArray);
}

export default function Board({ state, selectedElement }) {
    const baseBoardWidth = 757;
    const baseBoardHeight = 495;
    const baseSize = 55;
    const pointyTokenBaseWidth = 95;

    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const rootRef = useRef(null);
    // const [selectedBoardElement, setSelectedBoardElement] = useState(selectedElement);
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
    const [scaleFactor, setScaleFactor] = useState(.5);
    const [scaleFactorModifier, setScaleFactorModifier] = useState(1);
    const [myData, setMyData] = useState(state[myself.uid]);
    const [opponentData, setOpponentData] = useState(state.players.length > 1 ? state[state.players.find(p => p !== myself.uid)] : null)
    const [startingHexes, setStartingHexes] = useState(
        [
            ...boardsData[state.board.map.top.id].startingHexes[state.board.map.bottom.rotate],
            ...boardsData[state.board.map.bottom.id].startingHexes[state.board.map.bottom.rotate].map(([x, y]) => [x, y + 6]),
        ]
    )
    
    useEffect(() => {
        if(!state.board.map) return;

        const mainContainer = document.getElementById('mainContainer');
        
        const nextScaleFactor = (mainContainer ? (mainContainer.offsetHeight / (baseBoardHeight * 2)) * 1.2 : scaleFactor) * scaleFactorModifier;
        setScaleFactor(nextScaleFactor);
        console.log('RECALC SIZE', mainContainer.offsetHeight, nextScaleFactor);
        console.log(state);
    }, []);

    useEffect(() => {

        if(!state.board || !state.board.map || !state.board.map.top || !state.board.map.bottom) return;
        const currentSvg = svg ? svg : SVG(rootRef.current);
        currentSvg.clear();
        setSvg(currentSvg);
        const initGrid = getGrid(scaleFactor);
        console.log(initGrid.get([3, 5]).toPoint())

        const lethals = [
            ...boardsData[state.board.map.top.id].lethalHexes[state.board.map.top.rotate],
            ...boardsData[state.board.map.bottom.id].lethalHexes[state.board.map.bottom.rotate].map(([x, y]) => [x, y + 6]),
        ]

        const blocked = [
            ...boardsData[state.board.map.top.id].blockedHexes[state.board.map.top.rotate],
            ...boardsData[state.board.map.bottom.id].blockedHexes[state.board.map.bottom.rotate].map(([x, y]) => [x, y + 6]),
        ]

        initGrid.forEach(hex => {
            renderHex(hex, currentSvg, 'rgba(255,255,255, 1)', lethals, blocked);
        })
        setGrid(initGrid);
    }, [scaleFactor])

    useEffect(() => {
        console.log('Board.OnSelectedElementChange', selectedElement);

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
        setStartingHexes(
            [
                ...boardsData[state.board.map.top.id].startingHexes[state.board.map.top.rotate],
                ...boardsData[state.board.map.bottom.id].startingHexes[state.board.map.bottom.rotate].map(([x, y]) => [x, y + 6]),
            ]
        );
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

        console.log('TOKEN HEXES', tokenHexes);
        firebase.updateBoardProperty(state.id, 'board.tokens', update);
        firebase.addGenericMessage2(state.id, {
            author: 'Katophrane',
            type: 'INFO',
            value: `All feature hexes has been revealed.`,
        })
    }, [tokenHexes]);

    const handleIncreazeScaleFactor = () => {
        setScaleFactor(prev => prev * 1.2);
        // const nextScaleFactorMod = scaleFactorModifier + 0.2;
        // setScaleFactorModifier(nextScaleFactorMod);
        // const mainContainer = document.getElementById('mainContainer');
        // const nextScaleFactor = (mainContainer ? (mainContainer.offsetHeight / (baseBoardHeight * 2)) * 1.2 : scaleFactor) * nextScaleFactorMod;
        // setScaleFactor(nextScaleFactor);
        // console.log('INCREASE', nextScaleFactorMod, nextScaleFactor);
    }

    const handleDecreaseScaleFactor = () => {
        // const nextScaleFactorMod = scaleFactorModifier - 0.2;
        // setScaleFactorModifier(nextScaleFactorMod);
        // const mainContainer = document.getElementById('mainContainer');
        // const nextScaleFactor = (mainContainer ? (mainContainer.offsetHeight / (baseBoardHeight * 2)) * 1.2 : scaleFactor) * nextScaleFactorMod;
        // setScaleFactor(nextScaleFactor);
        // console.log('DECREASE', nextScaleFactorMod, nextScaleFactor);
        setScaleFactor(prev => prev * .8);
    }

    const handleClick = e => {
        const { offsetX, offsetY } = e.nativeEvent;
        const hex = getGridFactory(scaleFactor).pointToHex([offsetX, offsetY]);
        console.log(hex);
        const isHexOnBoard = boardHexesArray.find(([x, y]) => hex.x === x && hex.y === y);
        if(!isHexOnBoard) return;
        if(hex) {
            highlightHex(hex, svg);
            if(selectedTokenId) {
                if(selectedElement.type === 'SCATTER_TOKEN') {
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
            }
        }
    }

    if(!state.board.map || !state.board.map.top || !state.board.map.bottom) {
        return (
            <div style={{ display: 'flex' }}>
                Waiting for players to select board pieces
            </div>
        )
    }

    const scatterTokenHex = scatterToken && scatterToken.isOnBoard ? getGrid(scaleFactor).get(scatterToken.onBoard) : null;
    const { x: scatterTokenX, y: scatterTokenY } = scatterTokenHex ? scatterTokenHex.toPoint() : { x: -10, y: -10};
    const myHand = myData && myData.hand ? myData.hand.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })) : [];
    const opponentHand = opponentData && opponentData.hand ? opponentData.hand.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })) : [];

    return (
        <div id="mainContainer" style={{ display: 'flex', flexFlow: 'row wrap', backgroundColor: 'lightskyblue', margin: 'auto' }}>
            <div style={{ flex: '0 0 100%', display: 'flex', borderBottom: '1px solid lighgray', paddingBottom: '.2rem', marginBottom: '.2rem', alignItems: 'center' }}>
                <ButtonBase onClick={handleIncreazeScaleFactor} style={{ flex: 1}}>
                    <ZoomInIcon />
                </ButtonBase>
                <ButtonBase onClick={handleDecreaseScaleFactor}>
                    <ZoomOutIcon />
                </ButtonBase>
{/* 
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
                        </div>
                    )
                } */}
            </div>
            <div style={{ display: 'flex', flex: '1 0 100%', backgroundColor: 'white', }}>
                <div
                    style={{
                        backgroundColor: 'white',
                        position: 'relative',
                        width: baseBoardWidth * scaleFactor,
                        height: (baseBoardHeight * scaleFactor) * 2,
                        margin: 'auto',
                    }}
                >
                    <img
                        src={`/assets/boards/${state.board.map.top.id}.jpg`}
                        //src={`/assets/boards/1.jpg`}
                        alt="board"
                        style={{
                            width: baseBoardWidth * scaleFactor,
                            height: baseBoardHeight * scaleFactor,
                            position: 'absolute',
                            zIndex: '1',
                            transformOrigin: 'center center',
                            transform: `rotate(${state.board.map.top.rotate}deg)`,
                            // transform: `rotate(0deg)`,
                        }}
                    />
                    <img
                        //src={`/assets/boards/10.jpg`}
                        src={`/assets/boards/${state.board.map.bottom.id}.jpg`}
                        alt="board2"
                        style={{
                            width: baseBoardWidth * scaleFactor,
                            height: baseBoardHeight * scaleFactor,
                            position: 'absolute',
                            zIndex: '1',
                            top: baseBoardHeight * scaleFactor,
                            left: 0,
                            transformOrigin: 'center center',
                            transform: `rotate(${state.board.map.bottom.rotate}deg)`,
                            //transform: `rotate(0deg)`,
                        }}
                    />
                    {
                        startingHexes.map((hex) => {
                            const { x, y } = getGrid(scaleFactor).get(hex).toPoint();
                            return (
                                <StartingHexElement key={`${hex[0]}:${hex[1]}`} x={x} y={y} pointyTokenBaseWidth={pointyTokenBaseWidth} scaleFactor={scaleFactor} baseSize={baseSize} />
                                // <div key={`${hex[0]}:${hex[1]}`}
                                //     style={{
                                //         position: 'absolute',
                                //         zIndex: 2,
                                //         width: pointyTokenBaseWidth * scaleFactor,
                                //         height: pointyTokenBaseWidth * scaleFactor,
                                //         top: y + (baseSize * scaleFactor) / 2,
                                //         left: x,
                                //         display: 'flex',
                                //         flexDirection: 'column',
                                //         alignItems: 'center',
                                //     }}>
                                //         <StartingHex style={{ width: '75%', height: '75%', margin: 'auto', paddingTop: '.5rem', color: 'rgba(211,211,211,.7)' }} />
                                //     </div>
                            ); 
                        })
                    }
                    <div
                        style={{
                            position: 'absolute',
                            width: baseBoardWidth * scaleFactor,
                            height: (baseBoardHeight * scaleFactor) * 2,
                            zIndex: 600,
                        }}
                        ref={rootRef}
                        onClick={handleClick}
                    />
                    {
                        tokenHexes && Object.entries(tokenHexes).map(([k, hex], index) => {
                            
                            if(k.startsWith('Lethal') && hex.isOnBoard) {
                                const {x, y} = getGrid(scaleFactor).get(hex.onBoard).toPoint();
                                return (
                                    <div key={k} style={{
                                        position: 'absolute',
                                        zIndex: 500,
                                        width: pointyTokenBaseWidth * scaleFactor,
                                        top: y + (baseSize * scaleFactor) / 2,
                                        left: x,
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
                                const {x, y} = getGrid(scaleFactor).get(hex.onBoard).toPoint();
                                return (
                                    <div key={k} style={{
                                        position: 'absolute',
                                        zIndex: 500,
                                        width: pointyTokenBaseWidth * scaleFactor,
                                        top: y + (baseSize * scaleFactor) / 2,
                                        left: x,
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
                                const { x, y } = getGrid(scaleFactor).get(fighter.onBoard).toPoint();

                                return (
                                    <div
                                        key={k}
                                        style={{
                                            position: 'absolute',
                                            backgroundImage: `url(/assets/fighters/${fighter.icon}-icon.png)`,
                                            backgroundSize: 'cover',
                                            zIndex: 600,
                                            width: 80 * scaleFactor,
                                            height: 80 * scaleFactor,
                                            top: y + ((95 - 80) * scaleFactor) * 2.75 - 2,
                                            left: x + ((95 - 80) * scaleFactor) / 2 - 2,
                                            border: k.startsWith(myself.uid) ? '3px solid limegreen' : '3px solid red',
                                            borderRadius: 80,
                                            transform: k.startsWith(myself.uid) ? '' : 'scaleX(-1)',
                                            boxShadow: k === selectedTokenId ? k.startsWith(myself.uid) ? '0 0 7px 7px limegreen' : '0 0 7px 7px red' : '',
                                        }}>
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
                                    top: scatterTokenY < 0 ? -10000 : scatterTokenY + (baseSize * scaleFactor) / 2,
                                    left: scatterTokenX < 0 ? -10000 : scatterTokenX,
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
