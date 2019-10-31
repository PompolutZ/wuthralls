import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuthUser } from '../../components/Session';
import DiceTray from '../../components/DiceTray';
import { FirebaseContext } from '../../firebase';
import { Typography, Button } from '@material-ui/core';
import { boards } from '../../data';

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
        const nextActiveStep = {
            type: 'PICK_FIRST_BOARD',
            waitingFor: data.opponents[0],
            pickingNext: myself.uid
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
                            <img src={`/assets/boards/${boardId}.jpg`} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

function SecondBoardPicker({ data, tableId }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [boardIds, setBoardIds] = useState([data.firstBoardId]);
    
    const baseBoardWidth = 250;
    const baseBoardHeight = 163;
    const shiftHorizontal = 18 * 2 - 4;
    
    useEffect(() => {
        console.log('SecondBoardPicker.OnData', data);
    }, [data]);

    const handleSelectBoard = boardId => async () => {
        setBoardIds(prev => [...prev, boardId]);
        await firebase.addSecondBoard(tableId, boardId);
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
                    <img src={`/assets/boards/${data.firstBoardId}.jpg`} />
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
                                <img src={`/assets/boards/${boardId}.jpg`} />
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

    return (
        <div style={{ position: 'relative' }}>
            <img src={`/assets/boards/${boardIds[0]}.jpg`} alt="board" style={{ width: baseBoardWidth, height: baseBoardHeight, position: 'absolute', zIndex: '1' }} />
            <img src={`/assets/boards/${boardIds[1]}.jpg`} alt="board2" style={{ 
                width: baseBoardWidth, 
                height: baseBoardHeight, 
                position: 'absolute', 
                zIndex: '1',
                top: baseBoardHeight -1,
                left: shiftHorizontal * 4}} />
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
        default: 
            return (
                <div>
                    Game
                </div>
            );
    }
}

export default Game;