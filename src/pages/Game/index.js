import React, { useEffect, useState, useContext, useRef, lazy } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuthUser } from '../../components/Session';
import { FirebaseContext } from '../../firebase';
import { Typography, Button } from '@material-ui/core';

import InitiativeRollMaker from './InitiativeRollMaker';
import BoardSelectionOrderChooser from './BoardSelectionOrderChooser';
import FirstBoardPicker from './FirstBoardPicker';
import SecondBoardPicker from './SecondBoardPicker';
import ObjectivePlacer from './ObjectivePlacer';
import LethalHexPlacer from './LethalHexPlacer';

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
            return <BoardSelectionOrderChooser data={gameData.step} tableId={gameData.id} />
        case 'PICK_FIRST_BOARD':
            return <FirstBoardPicker data={gameData.step} tableId={gameData.id} />
        case 'PICK_SECOND_BOARD':
            return <SecondBoardPicker data={gameData.step} tableId={gameData.id} />
        case 'PLACE_FEATURE':
            return <ObjectivePlacer data={gameData} tableId={gameData.id} boardIds={{ first: gameData.firstBoard, second: gameData.secondBoard }} fullBoard={gameData.fullBoard} />                    
        case 'PLACE_LETHAL':
            return <LethalHexPlacer data={{...gameData, id: tableId }} />
        default: 
            return (
                <div>
                    Game
                </div>
            );
    }
}

export default Game;