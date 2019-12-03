import React, { useEffect, useState, useRef, useContext } from 'react';
import { defineGrid, extendHex } from 'honeycomb-grid';
import * as SVG from 'svg.js';
import { FirebaseContext } from '../../../firebase';
import { useAuthUser } from '../../../components/Session';
import { Typography } from '@material-ui/core';

export default function Board({ roomId, state, onBoardChange, selectedElement }) {
    const baseBoardWidth = 757;
    const baseBoardHeight = 495;
    const baseSize = 55;
    const pointyTokenBaseWidth = 95;
    const scaleDownBy = 2;
    const scaleFactor = .5;

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
    // const [featureHexes, setFeatureHexes] = useState(tokens.filter(t => t.id.startsWith('Feature')));
    // const [lethalHexes, setLethalHexes] = useState(tokens.filter(t => t.id.startsWith('Lethal')));
    // const [selectedToken, setSelectedToken] = useState(null);
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    const [hexPrototype, setHexPrototype] = React.useState(
        {
            baseSize: baseSize,
            scaleFactor: .5,
            orientation: 'pointy',
            size: baseSize * scaleFactor,
            origin: [baseSize * scaleFactor - (baseSize / 2), -(baseSize / 2) * scaleFactor],
            render(draw, color) {
                const { x, y } = this.toPoint();
                const corners = this.corners();
                this.draw = draw
                    .polygon(corners.map(({ x, y }) => `${x},${y}`))
                    .fill('rgba(192,192,192, 0)')
                    .stroke({ width: 1, color: color })
                    .translate(x, y);
            },
            highlight(svg) {
                this.draw
                    .stop(true, true)
                    .fill({ opacity: 1, color: 'white' })
                    .animate(500)
                    .fill({ opacity: 0, color: 'white' });
                // const { x, y } = this.toPoint();
                // return ({x, y});
                // //console.log(x, y, this.width(), this.size);
                // //svg.circle(10).center(x + (baseSize / scaleDownBy - 4), y + (baseSize / scaleDownBy) + (baseSize / scaleDownBy * .5)).fill('orange');
            },
            toJSON() {
                return {
                    x: this.x,
                    y: this.y,
                    baseSize: this.baseSize,
                    orientation: this.orientation,
                    originX: this.origin.x,
                    originY: this.origin.y
                }
            }
        }
    );

    const Hex = extendHex(hexPrototype);
    const Grid = defineGrid(Hex);

    useEffect(() => {
        //if(!state.board.map) return;

        console.log(state);
        const svg = SVG(rootRef.current);
        setSvg(svg);
        const initGrid = Grid(
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
        );
        
        initGrid.forEach(hex => hex.render(svg, 'rgba(192,192,192,.7)'));
        setGrid(initGrid);
    }, []);

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
        firebase.addGenericMessage(state.id, {
            author: 'Katophrane',
            type: 'INFO',
            value: `All feature hexes has been reveled.`,
        })
    }, [tokenHexes]);

    const handleClick = e => {
        const { offsetX, offsetY } = e.nativeEvent;
        const hexCoordinates = Grid.pointToHex([offsetX, offsetY]);
        const hex = grid.get(hexCoordinates);
        if(hex) {
            hex.highlight(svg);
            const {x, y} = hex.toPoint();
            console.log(offsetX, offsetY, hex.toPoint(), hexCoordinates)
            if(selectedTokenId) {
                if(selectedElement.type === 'SCATTER_TOKEN') {
                    setScatterToken({
                        ...scatterToken,
                        top: y,
                        left: x,
                        onBoard: { x: hexCoordinates.x, y: hexCoordinates.y }
                    })
                } else if(selectedElement.type === 'FIGHTER') {
                    const updatedFighter = {
                        ...fighters[selectedTokenId],
                        from: fighters[selectedTokenId].isOnBoard ? fighters[selectedTokenId].onBoard : {x: -1, y: -1 },
                        isOnBoard: true,
                        onBoard: { x: hexCoordinates.x, y: hexCoordinates.y },
                        top: y,
                        left: x,                
                    }
                    
                    setFighters({
                        ...fighters,
                        [selectedTokenId]: updatedFighter,
                    });

                    firebase.updateBoardProperty(state.id, `board.fighters.${selectedTokenId}`, updatedFighter);
                    firebase.addGenericMessage(state.id, {
                        author: 'Katophrane',
                        type: 'INFO',
                        subtype: 'PLACEMENT',
                        value: `${myself.username} placed ${selectedTokenId.startsWith(myself.uid) ? 'HIS' : 'ENEMIES'} ${fighters[selectedTokenId].name} to (${hexCoordinates.x},${hexCoordinates.y}).`,
                    })
                } else {
                    const updatedToken = {
                        ...tokenHexes[selectedTokenId],
                        from: tokenHexes[selectedTokenId].isOnBoard ? tokenHexes[selectedTokenId].onBoard : {x: -1, y: -1 },
                        isOnBoard: true,
                        onBoard: { x: hexCoordinates.x, y: hexCoordinates.y },
                        top: y,
                        left: x,                
                    };
                    firebase.updateBoardProperty(state.id, `board.tokens.${selectedTokenId}`, updatedToken);
                    firebase.addGenericMessage(state.id, {
                        author: 'Katophrane',
                        type: 'INFO',
                        subtype: 'PLACEMENT',
                        value: `${myself.username} placed ${selectedTokenId} to (${hexCoordinates.x},${hexCoordinates.y}).`,
                    })
                    setTokenHexes({
                        ...tokenHexes,
                        [selectedTokenId]: updatedToken 
                    })
                }
        }
            // setCurrentFeatureToken({
            //     ...currentFeatureToken,
            //     top: y,
            //     left: x,
            //     hexX: hexCoordinates.x,
            //     hexY: hexCoordinates.y,
            // });
        }
    }

    // if(!state.board.map || !state.board.map.top || !state.board.map.bottom) {
    //     return (
    //         <div style={{ display: 'flex' }}>
    //             Waiting for players to select board pieces
    //         </div>
    //     )
    // }

    return (
        <div style={{ display: 'flex' }}>
            <div
                style={{
                    position: 'relative',
                    width: baseBoardWidth / scaleDownBy,
                    height: (baseBoardHeight / scaleDownBy) * 2,
                    margin: '1rem 1rem 5rem 1rem',
                    overflow: 'scroll',
                }}
            >
                <img
                    //src={`/assets/boards/${state.board.map.top.id}.jpg`}
                    src={`/assets/boards/1.jpg`}
                    alt="board"
                    style={{
                        width: baseBoardWidth / scaleDownBy,
                        height: baseBoardHeight / scaleDownBy,
                        position: 'absolute',
                        zIndex: '1',
                        transformOrigin: 'center center',
                        //transform: `rotate(${state.board.map.top.rotate}deg)`,
                        transform: `rotate(0deg)`,
                    }}
                />
                <img
                    src={`/assets/boards/10.jpg`}
                    //src={`/assets/boards/${state.board.map.bottom.id}.jpg`}
                    alt="board2"
                    style={{
                        width: baseBoardWidth / scaleDownBy,
                        height: baseBoardHeight / scaleDownBy,
                        position: 'absolute',
                        zIndex: '1',
                        top: baseBoardHeight / scaleDownBy,
                        left: 0,
                        transformOrigin: 'center center',
                        // transform: `rotate(${state.board.map.bottom.rotate}deg)`,
                        transform: `rotate(0deg)`,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        width: baseBoardWidth / scaleDownBy,
                        height: (baseBoardHeight / scaleDownBy) * 2,
                        zIndex: 1000,
                    }}
                    ref={rootRef}
                    onClick={handleClick}
                />
                {
                    tokenHexes && Object.entries(tokenHexes).map(([k, hex], index) => {
                        if(k.startsWith('Lethal') && hex.isOnBoard) {
                            return (
                                <div key={k} style={{
                                    position: 'absolute',
                                    zIndex: 500,
                                    width: pointyTokenBaseWidth * scaleFactor,
                                    top: hex.top + (baseSize * scaleFactor) / 2,
                                    left: hex.left,
                                }}>
                                    <img
                                        src={`/assets/tokens/lethal.png`}
                                        style={{
                                            // position: 'absolute',
                                            // zIndex: 500,
                                            width: pointyTokenBaseWidth * scaleFactor,
                                            // top: hex.top + (baseSize * scaleFactor) / 2,
                                            // left: hex.left,
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
                                        boxShadow: k === selectedTokenId ? '0 0 15px 5px magenta' : '',
                                    }} />
                                </div>
                            );
                        }

                        if(k.startsWith('Feature') && hex.isOnBoard) {
                            return (
                                <div key={k} style={{
                                    position: 'absolute',
                                    zIndex: 500,
                                    width: pointyTokenBaseWidth * scaleFactor,
                                    top: hex.top + (baseSize * scaleFactor) / 2,
                                    left: hex.left,
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
                                        boxShadow: k === selectedTokenId ? '0 0 25px 10px OrangeRed' : '',
                                    }} />
                                </div>
                            );
                        }
                    })
                }
                {
                    fighters && Object.entries(fighters).map(([k, fighter]) => {
                        if(fighter.isOnBoard) {
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
                                        top: fighter.top + ((95 - 80) * scaleFactor) * 2.75 - 2,
                                        left: fighter.left + ((95 - 80) * scaleFactor) / 2 - 2,
                                        border: k.startsWith(myself.uid) ? '3px solid limegreen' : '3px solid red',
                                        borderRadius: 80,
                                        boxShadow: k === selectedTokenId ? k.startsWith(myself.uid) ? '0 0 7px 7px limegreen' : '0 0 7px 7px red' : ''
                                    }}>
                                        <div style={{ 
                                            position: 'absolute', 
                                            zIndex: 601, 
                                            width: '1rem', 
                                            height: '1rem', 
                                            backgroundColor: 'darkred',
                                            display: 'flex',
                                            border: '1px solid white',
                                            borderRadius: '.5rem',
                                            top: '-.2rem',
                                            left: '-.2rem',
                                            boxSizing: 'boarder-box', verticalAlign: 'middle' }}>
                                                <Typography style={{ fontSize: '.8rem', margin: 'auto', color: 'white', verticalAlign: 'middle'}}>{fighter.wounds}</Typography>
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
                                top: scatterToken.top + (baseSize * scaleFactor) / 2,
                                left: scatterToken.left,
                                transform: `rotate(${scatterToken.rotationAngle}deg)`, 
                                transformOrigin: 'center center',
                            }}
                        />
                    )
                }
            </div>
        </div>
    );
}
