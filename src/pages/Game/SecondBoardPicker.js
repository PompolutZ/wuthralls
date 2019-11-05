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

function SecondBoardPicker({ data, tableId }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [boardIds, setBoardIds] = useState([data.firstBoardId]);
    const [bottomBoardLeftOffset, setBottomBoardLeftOffset] = useState(0);
    const rootRef = useRef(null);
    const [svg, setSvg] = React.useState(null);
    const [grid, setGrid] = React.useState(null);
    const [fullBoard, setFullBoard] = React.useState(null);
    
    const baseBoardWidth = 757;
    const baseBoardHeight = 495;
    const baseSize = 55;
    const scaleDownBy = 2;
    const scaleFactor = .5;

    const hexPrototype = {
        baseSize: baseSize,
        scaleFactor: .5,
        orientation: 'pointy',
        size: baseSize * scaleFactor,
        origin: [baseSize * scaleFactor - (baseSize / 2), -(baseSize / 2) * scaleFactor],
        render(draw, color) {
            console.log('Render');
            const { x, y } = this.toPoint();
            const corners = this.corners();
            this.draw = draw
                .polygon(corners.map(({ x, y }) => `${x},${y}`))
                .fill('rgba(192,192,192, .5)')
                .stroke({ width: 1, color: color })
                .translate(x, y);
        },
        highlight(svg) {
            this.draw
                .stop(true, true)
                .fill({ opacity: 1, color: 'aquamarine' })
                .animate(1000)
                .fill({ opacity: 0, color: 'none' });
            const { x, y } = this.toPoint();
            //console.log(x, y, this.width(), this.size);
            //svg.circle(10).center(x + (baseSize / scaleDownBy - 4), y + (baseSize / scaleDownBy) + (baseSize / scaleDownBy * .5)).fill('orange');
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

    const Hex = extendHex(hexPrototype);
    const Grid = defineGrid(Hex);

    useEffect(() => {
        console.log('SecondBoardPicker.OnData', data);
    }, [data]);

    useEffect(() => {
        if(!boardIds || boardIds.length < 2) return;

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
        initGrid.forEach(hex => hex.render(svg, 'magenta'));
        console.log(initGrid.map(hex => hex.toJSON()));
        const board = initGrid.reduce((data, hex) => {
            if(!data) {
                const hexJSON = hex.toJSON();
                return {
                    baseSize: hexJSON.baseSize,
                    orientation: hexJSON.orientation,
                    originX: hexJSON.originX,
                    originY: hexJSON.originY,
                    hexes: [[hexJSON.x, hexJSON.y]]
                }
            } else {
                const hexJSON = hex.toJSON();
                return {
                    ...data,
                    hexes: [...data.hexes, [hexJSON.x, hexJSON.y]]
                }
            }
        }, null)
        console.log(board);
        setFullBoard(board);
        setGrid(initGrid);        

    }, [boardIds])

    const handleSelectBoard = boardId => async () => {
        setBoardIds(prev => [...prev, boardId]);
        await firebase.addSecondBoard(tableId, boardId);
    }

    const handleShiftBottomBoardLeft = () => {

    }

    const handleShiftBottomBoardRight = () => {

    }

    const handleSave = async () => {
        await firebase.addSecondBoard(tableId, boardIds[1]);

        if(fullBoard) {
            console.log('can save board', data);
            await firebase.addFullBoard(tableId, JSON.stringify(fullBoard));

            const objectiveHexes = shuffle([
                {
                    type: 'FEATURE',
                    number: 1,
                    side: 'LETHAL'
                },
                {
                    type: 'FEATURE',
                    number: 2,
                    side: 'LETHAL'
                },
                {
                    type: 'FEATURE',
                    number: 3,
                    side: 'LETHAL'
                },
                {
                    type: 'FEATURE',
                    number: 4,
                    side: 'LETHAL'
                },
                {
                    type: 'FEATURE',
                    number: 5,
                    side: 'LETHAL'
                },
            ]);

            // const customLethalHexes = shuffle([
            //     {
            //         type: 'LETHAL',
            //         number: 1,
            //     },
            //     {
            //         type: 'LETHAL',
            //         number: 2,
            //     },
            // ]);

            const nextActiveStep = {
                type: 'PLACE_FEATURE',
                waitingFor: data.playerPickedFirst,
                nextPlayer: data.waitingFor,
                featureIndex: 0,
                featuresToPlace: objectiveHexes.reduce((result, hex, index) => ({...result, [index]: hex }), {}),
            };
    
            await firebase.updateTable({
                step: nextActiveStep
            }, tableId);
        }
    }

    if(data.waitingFor !== myself.uid) {
        return (
            <div>
                <Typography variant="h5">Second Board Selection</Typography>
                <Typography>You opponent is choosing the board.</Typography>
            </div>
        )
    }

    if(boardIds.length < 2) {
        return (
            <div>
                <Typography variant="h5">Second Board Selection</Typography>
                <br />
                <div>
                    <Typography>Your opponent has picked:</Typography>    
                    <Typography>
                        {boards[data.firstBoardId].name}
                    </Typography>
                    <img src={`/assets/boards/${data.firstBoardId}.jpg`} width={baseBoardWidth / 3} />
                </div>
                <Typography>Choose the board:</Typography>
                <br />
                <div>
                    {
                        Object.keys(boards).map(boardId => (
                            <div key={boardId} onClick={handleSelectBoard(boardId)}>
                                <Typography>
                                    {boards[boardId].name}
                                </Typography>
                                <img src={`/assets/boards/${boardId}.jpg`} width={baseBoardWidth / 3} />
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* <div>
                <Button variant="contained" onClick={handleShiftBottomBoardLeft}>{`<-`}</Button>
            </div> */}
            <div style={{ position: 'relative',
                            width: baseBoardWidth / scaleDownBy, 
                            height: (baseBoardHeight / scaleDownBy) * 2, 
                            margin: '1rem',
                         }}>
                <img src={`/assets/boards/${boardIds[0]}.jpg`} alt="board" style={{ width: baseBoardWidth / scaleDownBy, height: baseBoardHeight / scaleDownBy, position: 'absolute', zIndex: '1' }} />
                <img src={`/assets/boards/${boardIds[1]}.jpg`} alt="board2" style={{ 
                    width: baseBoardWidth / scaleDownBy, 
                    height: baseBoardHeight / scaleDownBy, 
                    position: 'absolute', 
                    zIndex: '1',
                    top: baseBoardHeight / scaleDownBy,
                    left: bottomBoardLeftOffset }} />
                <div style={{ position: 'relative',
                            width: baseBoardWidth / scaleDownBy, 
                            height: (baseBoardHeight / scaleDownBy) * 2, 
                            zIndex: 1000,
                         }}
                ref={rootRef} />
                
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

export default SecondBoardPicker;