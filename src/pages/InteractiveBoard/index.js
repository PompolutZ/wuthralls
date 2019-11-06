import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuthUser } from '../../components/Session';
import DiceTray from '../../components/DiceTray';
import { FirebaseContext } from '../../firebase';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import MuiGrid from '@material-ui/core/Grid';
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

function InteractiveBoard() {
    const baseBoardWidth = 757;
    const baseBoardHeight = 495;
    const baseSize = 55;
    const pointyTokenBaseWidth = 95;
    const scaleDownBy = 2;
    const scaleFactor = .5;

    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const rootRef = useRef(null);
    // const [svg, setSvg] = React.useState(null);
    // const [grid, setGrid] = React.useState(null);
    // const [parsedBoard, setParsedBoard] = React.useState(JSON.parse(data.fullBoard));
    // const [message, setMessage] = React.useState('');
    const [featureHexes, setFeatureHexes] = React.useState();
    const [lethalHexes, setLethalHexes] = React.useState();
    // const [hexPrototype, setHexPrototype] = React.useState(
    //     {
    //         baseSize: baseSize,
    //         scaleFactor: .5,
    //         orientation: 'pointy',
    //         size: baseSize * scaleFactor,
    //         origin: [baseSize * scaleFactor - (baseSize / 2), -(baseSize / 2) * scaleFactor],
    //         render(draw, color) {
    //             const { x, y } = this.toPoint();
    //             const corners = this.corners();
    //             this.draw = draw
    //                 .polygon(corners.map(({ x, y }) => `${x},${y}`))
    //                 .fill('rgba(192,192,192, 0)')
    //                 .stroke({ width: 1, color: color })
    //                 .translate(x, y);
    //         },
    //         highlight(svg) {
    //             this.draw
    //                 .stop(true, true)
    //                 .fill({ opacity: 1, color: 'white' })
    //                 .animate(500)
    //                 .fill({ opacity: 0, color: 'white' });
    //             // const { x, y } = this.toPoint();
    //             // return ({x, y});
    //             // //console.log(x, y, this.width(), this.size);
    //             // //svg.circle(10).center(x + (baseSize / scaleDownBy - 4), y + (baseSize / scaleDownBy) + (baseSize / scaleDownBy * .5)).fill('orange');
    //         },
    //         toJSON() {
    //             return {
    //                 x: this.x,
    //                 y: this.y,
    //                 baseSize: this.baseSize,
    //                 orientation: this.orientation,
    //                 originX: this.origin.x,
    //                 originY: this.origin.y
    //             }
    //         }
    //     }
    // );

    // const Hex = extendHex(hexPrototype);
    // const Grid = defineGrid(Hex);

    useEffect(() => {
        const loadDefaultPlaygroundAsync = async () => {
            const doc = await firebase.getPlayground();
            console.log(doc.data());
        }

        loadDefaultPlaygroundAsync();
        // if (data.step.waitingFor.includes(myself.uid)) {
        //     setMessage('Decide on your starting hand and roll initiative for fighters placement');
        // } else {
        //     setMessage('Your opponent is thinking...');
        // }

        // console.log('GameRunner.Loaded', data);

        // const svg = SVG(rootRef.current);
        // setSvg(svg);
        // const initGrid = Grid(parsedBoard.hexes);
        // initGrid.forEach(hex => hex.render(svg, 'white'));
        // setGrid(initGrid);

        // setFeatureHexes(data.featureHexes || null);
        // setLethalHexes(data.lethalHexes || null);
    }, [])

    const handleSave = async () => {
        console.log('GameRunner.Save');
        // const featuresToPlace = data.step.featuresToPlace;
        // delete featuresToPlace[data.step.featureIndex];
        // console.log('SAVE', currentFeatureToken, featuresToPlace);

        // if(Object.keys(featuresToPlace).length > 0) {
        //     console.log('DATA:SAVE', data);
        //     await firebase.addLethalHex(data.id, data.step.featureIndex, currentFeatureToken);

        //     console.log(data.step);
        //     const nextActiveStep = {
        //         type: 'PLACE_LETHAL',
        //         waitingFor: data.step.nextPlayer,
        //         nextPlayer: data.step.waitingFor,
        //         featureIndex: data.step.featureIndex + 1,
        //         featuresToPlace: featuresToPlace,
        //     };
    
        //     await firebase.updateTable({
        //         step: nextActiveStep
        //     }, data.id);
        // } else {
        //     console.log('No more lethals to place');
        //     const nextActiveStep = {
        //         type: 'INITIATIVE_ROLL_FOR_FIGHTERS_PLACEMENT',
        //         waitingFor: [data.step.nextPlayer, data.step.waitingFor],
        //     };
    
        //     await firebase.updateTable({
        //         step: nextActiveStep
        //     }, data.id);
        // }
    }

    const handleClick = e => {
        // if(data.step.waitingFor !== myself.uid) {
        //     setMessage(`Sorry, but its your opponent's turn to place feature token`);
        //     return;
        // }

        // const { offsetX, offsetY } = e.nativeEvent;
        // const hexCoordinates = Grid.pointToHex([offsetX, offsetY]);
        // const hex = grid.get(hexCoordinates);
        // if(hex) {
        //     hex.highlight(svg);
        //     const {x, y} = hex.toPoint();
        //     console.log(offsetX, offsetY, hex.toPoint(), hexCoordinates)
        // }
    }

    return (
        <div>
            {/* <Typography>{message}</Typography>  */}
            <MuiGrid container>
                <MuiGrid item xs={12} md={6}>
                    <ButtonGroup fullWidth aria-label="full width outlined button group">
                        <Button>Cards</Button>
                        <Button>Fighters</Button>
                        <Button>Dice</Button>
                    </ButtonGroup>
                </MuiGrid>
            </MuiGrid>
            <div style={{ display: 'flex' }}>
                <div style={{ position: 'relative',
                                width: baseBoardWidth / scaleDownBy, 
                                height: (baseBoardHeight / scaleDownBy) * 2, 
                                margin: '2rem .5rem',
                                overflow: 'scroll'
                            }}>
                    <img src={`/assets/boards/${1}.jpg`} alt="board" style={{ width: baseBoardWidth / scaleDownBy, height: baseBoardHeight / scaleDownBy, position: 'absolute', zIndex: '1' }} />
                    <img src={`/assets/boards/${2}.jpg`} alt="board2" style={{ 
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
                        featureHexes && (
                            Object.values(featureHexes).map((hex, index, arr) => (
                                <img key={index} 
                                    src={arr.length < 5 ? `/assets/tokens/feature_back.png` : `/assets/tokens/feature_front_${hex.number}.png`} 
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
                    {
                        lethalHexes && (
                            Object.values(lethalHexes).map((hex, index) => (
                                <img key={index} 
                                    src={`/assets/tokens/lethal.png`} 
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
            </div>     
            {/* <Button onClick={handleSave} disabled={data.step.waitingFor !== myself.uid} color="primary" variant="contained">
                Save
            </Button> */}
        </div>
    )
}

export default InteractiveBoard;