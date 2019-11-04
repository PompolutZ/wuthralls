import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuthUser } from '../../components/Session';
import DiceTray from '../../components/DiceTray';
import { FirebaseContext } from '../../firebase';
import { Typography, Button } from '@material-ui/core';
import { boards } from '../../data';
import { defineGrid, extendHex } from 'honeycomb-grid';
import * as SVG from 'svg.js';

const baseBoardWidth = 757;
const baseBoardHeight = 495;

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function ObjectivePlacer({ data, tableId, boardIds }) {
    const baseBoardWidth = 757;
    const baseBoardHeight = 495;
    const baseSize = 55;
    const pointyTokenBaseWidth = 95;
    const scaleDownBy = 2;
    const scaleFactor = .5;

    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const rootRef = useRef(null);
    const [svg, setSvg] = React.useState(null);
    const [grid, setGrid] = React.useState(null);
    const [parsedBoard, setParsedBoard] = React.useState(JSON.parse(data.fullBoard));
    const [currentFeatureToken, setCurrentFeatureToken] = React.useState({ ...data.step.featuresToPlace[data.step.featureIndex], top: 0, left: 0, });
    const [message, setMessage] = React.useState('');
    const [hexes, setHexes] = React.useState(data.hexes || null);
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
        if (data.step.waitingFor === myself.uid) {
            setMessage('Select hex to place feature token. Click Save when you are done.');
        } else {
            setMessage('Your opponent is placing feature token...');
        }
        console.log('ObjectivePlacer.onData', data, parsedBoard );
        const svg = SVG(rootRef.current);
        setSvg(svg);
        const initGrid = Grid(parsedBoard.hexes);
        initGrid.forEach(hex => hex.render(svg, 'white'));
        setGrid(initGrid);
        setHexes(data.hexes);
    }, [])

    useEffect(() => {
        
    }, [data.hexes])

    useEffect(() => {
        if (data.step.waitingFor === myself.uid) {
            setMessage('Select hex to place feature token. Click Save when you are done.');
        } else {
            setMessage('Your opponent is placing feature token...');
        }
        
        setHexes(data.hexes);
        setCurrentFeatureToken(
            { ...data.step.featuresToPlace[data.step.featureIndex], top: 0, left: 0, }
        )
    }, [data.step])

    const handleSave = async () => {
        const featuresToPlace = data.step.featuresToPlace;
        delete featuresToPlace[data.step.featureIndex];
        console.log('SAVE', currentFeatureToken, featuresToPlace);

        await firebase.addHex(data.id, data.step.featureIndex, currentFeatureToken);

        console.log(data.step);
        const nextActiveStep = {
            type: 'PLACE_FEATURE',
            waitingFor: data.step.nextPlayer,
            nextPlayer: data.step.waitingFor,
            featureIndex: data.step.featureIndex + 1,
            featuresToPlace: featuresToPlace,
        };

        await firebase.updateTable({
            step: nextActiveStep
        }, tableId);
    }

    const handleClick = e => {
        if(data.step.waitingFor !== myself.uid) {
            setMessage(`Sorry, but its your opponent's turn to place feature token`);
            return;
        }

        const { offsetX, offsetY } = e.nativeEvent;
        const hexCoordinates = Grid.pointToHex([offsetX, offsetY]);
        const hex = grid.get(hexCoordinates);
        if(hex) {
            hex.highlight(svg);
            const {x, y} = hex.toPoint();
            console.log(offsetX, offsetY, hex.toPoint(), hexCoordinates)
            setCurrentFeatureToken({
                ...currentFeatureToken,
                top: y,
                left: x,
                hexX: hexCoordinates.x,
                hexY: hexCoordinates.y,
            });
        }
    }

    return (
        <div>
            {/* <div>
                <Button variant="contained" onClick={handleShiftBottomBoardLeft}>{`<-`}</Button>
            </div> */}
            <Typography>{message}</Typography>        
            <div style={{ position: 'relative',
                            width: baseBoardWidth / scaleDownBy, 
                            height: (baseBoardHeight / scaleDownBy) * 2, 
                            margin: '1rem',
                         }}>
                <img src={`/assets/boards/${data.firstBoard}.jpg`} alt="board" style={{ width: baseBoardWidth / scaleDownBy, height: baseBoardHeight / scaleDownBy, position: 'absolute', zIndex: '1' }} />
                <img src={`/assets/boards/${data.secondBoard}.jpg`} alt="board2" style={{ 
                    width: baseBoardWidth / scaleDownBy, 
                    height: baseBoardHeight / scaleDownBy, 
                    position: 'absolute', 
                    zIndex: '1',
                    top: baseBoardHeight / scaleDownBy,
                    left: 0 }} />
                <div style={{ position: 'absolute',
                            width: baseBoardWidth / scaleDownBy, 
                            height: (baseBoardHeight / scaleDownBy) * 2, 
                            zIndex: 1000,
                         }}
                ref={rootRef}
                onClick={handleClick} />
                {
                    currentFeatureToken && (
                        <img src={`/assets/tokens/feature_back.png`} 
                            style={{
                                position: 'absolute',
                                zIndex: 500,
                                width: pointyTokenBaseWidth * scaleFactor,
                                top: currentFeatureToken.top + baseSize * scaleFactor / 2,
                                left: currentFeatureToken.left
                            }} />
                    )
                }
                {
                    hexes && (
                        Object.values(hexes).map((hex, index) => (
                            <img key={index} 
                                src={hex.type === 'FEATURE' ? `/assets/tokens/feature_front_${hex.number}.png` : `/assets/tokens/lethal.png`} 
                                style={{
                                    position: 'absolute',
                                    zIndex: 500,
                                    width: pointyTokenBaseWidth * scaleFactor,
                                    top: hex.top + baseSize * scaleFactor / 2,
                                    left: hex.left
                                }} />
                        ))
                    )
                }
                
            </div>
            <Button onClick={handleSave} disabled={boardIds.length < 2}>
                Save
            </Button>
            {/* <div>
                <Button variant="contained" onClick={handleShiftBottomBoardRight}>{`->`}</Button>
            </div> */}
        </div>
    )
}

export default ObjectivePlacer;