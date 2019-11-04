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

function InitiativeRollMaker({ data, tableId }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [myPreviousRollResult, setMyPreviousRollResult] = useState((myself && data[myself.uid]) || null);

    useEffect(() => {
        console.log(data);
        console.log('Prev Roll Res: ', myPreviousRollResult);
    }, []);

    useEffect(() => {
        console.log("Updated Data");
        setMyPreviousRollResult((myself && data[myself.uid]) || null);
    }, [data]);

    const handleMyRollForInitiative = async rollResult => {
        console.log(myself.uid, 'rolled', rollResult);
        await firebase.updateInitiativeRoll(tableId, myself.uid, rollResult.join())
    }

    return (
        <div>
            <DiceTray defaultAmount={4} rollResult={myPreviousRollResult} onRollBeingMade={handleMyRollForInitiative} canRoll={data.waitingFor.includes(myself.uid)} />
        </div>
    );
}

function BoardSelectionOrderChooser({ data, tableId }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        console.log('BoardSelectionOrderChooser.OnData', data);
    }, [data]);

    const handlePickBoardFirst = async () => {
        const nextActiveStep = {
            type: 'PICK_FIRST_BOARD',
            waitingFor: myself.uid,
            pickingNext: data.opponents
        };

        await firebase.updateTable({
            step: nextActiveStep
        }, tableId);
    }

    const handlePickBoardSecond = async () => {
        console.log(data.opponents);
        const nextActiveStep = {
            type: 'PICK_FIRST_BOARD',
            waitingFor: data.opponents[0],
            pickingNext: [myself.uid]
        };

        await firebase.updateTable({
            step: nextActiveStep
        }, tableId);
    }

    if(data.waitingFor.includes(myself.uid)) {
        return (
            <div>
                <Typography variant="h5">Choosing borders selection order</Typography>
                <Typography>As you won initiative roll you need to decide who will pick the board first.</Typography>
                <br />
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: '1 0'}}>
                        <Typography>I will pick the board first and will place 3 objectives.</Typography>
                        <Button variant="outlined" color="primary" onClick={handlePickBoardFirst}>Pick first</Button>
                    </div>
                    <div style={{ flex: '1 0'}}>
                        <Typography>I will pick the board second, place 2 objectives but decide on how boards are positioned.</Typography>
                        <Button variant="outlined" color="secondary" onClick={handlePickBoardSecond}>Pick second</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Typography variant="h5">Choosing borders selection order</Typography>
            <Typography>You opponent has won initiative roll and will decide who picks the board first.</Typography>
        </div>
    )
}

function FirstBoardPicker({ data, tableId }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);

    const handleSelectBoard = boardId => async () => {
        await firebase.addFirstBoard(tableId, boardId);

        const nextActiveStep = {
            type: 'PICK_SECOND_BOARD',
            waitingFor: data.pickingNext[0],
            firstBoardId: boardId,
            playerPickedFirst: myself.uid,
        };

        await firebase.updateTable({
            step: nextActiveStep
        }, tableId);
    }

    if(data.waitingFor !== myself.uid) {
        return (
            <div>
                <Typography variant="h5">First Board Selection</Typography>
                <Typography>You opponent is choosing the board.</Typography>
            </div>
        )
    }

    return (
        <div>
            <Typography variant="h5">First Board Selection</Typography>
            <Typography>Choose the board:</Typography>
            <br />
            <div>
                {
                    Object.keys(boards).map(boardId => (
                        <div key={boardId} onClick={handleSelectBoard(boardId)}>
                            <Typography>
                                {boards[boardId].name}
                            </Typography>
                            <img src={`/assets/boards/${boardId}.jpg`} width={baseBoardWidth / 4} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

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

            const customLethalHexes = shuffle([
                {
                    type: 'LETHAL',
                    number: 1,
                },
                {
                    type: 'LETHAL',
                    number: 2,
                },
            ]);

            const nextActiveStep = {
                type: 'PLACE_FEATURE',
                waitingFor: data.playerPickedFirst,
                nextPlayer: data.waitingFor,
                featureIndex: 0,
                featuresToPlace: [...objectiveHexes, ...customLethalHexes].reduce((result, hex, index) => ({...result, [index]: hex }), {}),
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

// primes = Crit(1091) > 4 * Single(79) > 4 * Double(3)

function Game() {
    const { state } = useLocation();
    const { tableId } = useParams();
    const firebase = useContext(FirebaseContext);
    const [gameData, setGameData] = useState(state);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        console.log('CURRENT GAME DATA', gameData);
        setLoading(true);
        const unsubscribe = firebase.setTableListener(state.id, snap => {
            console.log('UPDATED STATE', snap.data());
            setGameData({
                ...snap.data(),
                id: tableId,
            });

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log('GAME DATE UPDATED', gameData);

        const updateCurrentStepAsync = async () => {
            // check for initiave result
            if(gameData.step.waitingFor.length === 0) {
                if(gameData.step.type === 'INITIATIVE_ROLL_FOR_BOARDS_SETUP') {
                    const initiativeResults = Object.entries(gameData.step).filter(([key, value]) => key !== 'type' && key !== 'waitingFor').map(([key, value]) => {
                        return {
                            uid: key,
                            initiativeScore: value.split(',').map(s => Number(s)).reduce((accumulatedInitiativeResult, dieSideNumber) => {
                                if(dieSideNumber === 6) return accumulatedInitiativeResult + 1091;
                                if(dieSideNumber === 1) return accumulatedInitiativeResult + 79;
                                if(dieSideNumber === 5) return accumulatedInitiativeResult + 3;
                                return accumulatedInitiativeResult;
                            }, 0)
                        }
                    })

                    //check all results are equal
                    if(initiativeResults.length > 0 && initiativeResults.every(r => r.initiativeScore === initiativeResults[0].initiativeScore)) {
                        // restart initiative roll step
                        const activeStep = {
                            type: 'INITIATIVE_ROLL_FOR_BOARDS_SETUP',
                            waitingFor: gameData.players,
                        };
                
                        await firebase.updateTable({
                            step: activeStep
                        }, tableId);
                    } else {
                        // proceed to the next step
                        const highestScore = initiativeResults.sort((a, b) => b.initiativeScore - a.initiativeScore);
                        console.log('HIGHEST SCORE', highestScore);
                        const nextActiveStep = {
                            type: 'CHOOSE_BOARD_SELECTION_ORDER',
                            waitingFor: [highestScore[0].uid],
                            opponents: highestScore.slice(1).map(x => x.uid),
                        };

                        await firebase.updateTable({
                            step: nextActiveStep
                        }, tableId);
                    }
                    //console.log('INITIATIVE RESULTS: ', initiativeResults, initiativeResults.sort((a, b) => b.initiativeScore - a.initiativeScore));
                }
            }
        };

        updateCurrentStepAsync();
    }, [gameData])

    if(loading) {
        return <Typography>Getting latest data from the server...</Typography>
    }

    switch(gameData.step.type) {
        case 'INITIATIVE_ROLL_FOR_BOARDS_SETUP':
            return <InitiativeRollMaker data={gameData.step} tableId={gameData.id} />
        case 'CHOOSE_BOARD_SELECTION_ORDER': 
            return <BoardSelectionOrderChooser data={gameData.step} tableId={gameData.id} />;
        case 'PICK_FIRST_BOARD':
            return <FirstBoardPicker data={gameData.step} tableId={gameData.id} />
        case 'PICK_SECOND_BOARD':
            return <SecondBoardPicker data={gameData.step} tableId={gameData.id} />
        case 'PLACE_FEATURE':
            return <ObjectivePlacer data={{...gameData}} tableId={gameData.id} boardIds={{ first: gameData.firstBoard, second: gameData.secondBoard }} fullBoard={gameData.fullBoard} />
        default: 
            return (
                <div>
                    Game
                </div>
            );
    }
}

export default Game;