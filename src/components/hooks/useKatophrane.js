import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../../firebase';
import { useAuthUser } from '../Session';
import boards from '../../data/boards';

const rounds = [
    'SETUP',
    'ROUND 1',
    'ROUND 2',
    'ROUND 3'
]

export default function useKatophrane(room) {
    const firebase = useContext(FirebaseContext);
    const myself = useAuthUser();
    const [roomState, setRoomState] = useState(room);
    const [currentRound, setCurrentRound] = useState(room.status.round);
    const [roundTitle, setRoundTitle] = useState(rounds[currentRound]);
    //const [interactiveMessages, setInteractiveMessages] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.setRoomListener(room.id, snapshot => {
            const data = snapshot.data();
            if(!data) return;
            setRoomState({ ...data, id: snapshot.id });
            setCurrentRound(data.status.round);
            setRoundTitle(rounds[data.status.round]);
        });

        // const unsubscribeFromMessages = firebase.setMessagesListener(room.id, snapshot => {
        //     if(!snapshot.data()) return;
        //     const interactiveMessages = Object.entries(snapshot.data()).filter(([k, v]) => v.type === 'INTERACTIVE').map(([k, v]) => ({ ...v, id: k }));
        //     setInteractiveMessages(interactiveMessages);
        // });

        return () => {
            unsubscribe();
            // unsubscribeFromMessages();
        };
    }, [])

    const onPlayersReady = secondPlayerId => {
        const payload = {
            author: 'Katophrane',
            type: 'INTERACTIVE',
            subtype: 'INITIATIVE_AND_BOARDS_SETUP',
            actors: [...roomState.players, secondPlayerId],
            waitingFor: [...roomState.players, secondPlayerId],
            waitingReason: 'INITIATIVE_ROLL',
        };

        console.log('I WILL CRASH NOW');
        firebase.addGenericMessage2(roomState.id, payload);
    }

    const onFirstBoardSelected = ({ boardId, playerId, messageId }) => {
        console.log(boardId);
        const otherPlayerId = room.players.find(p => p !== playerId);
        firebase.updateInteractiveMessage32(
            room.id,
            messageId,
            { 
                [`${messageId}.${playerId}_board`]: boardId,
                [`${messageId}.waitingFor`]: [otherPlayerId],
                [`${messageId}.waitingReason`]: 'SELECT_SECOND_BOARD',
            },
        );

        console.log(boardId, playerId, messageId);
    }

    const onSecondBoardSelected = payload => {
        console.log('KATO_SECOND', payload, `${payload.messageId}.${payload.playerId}_board`);
        firebase.updateInteractiveMessage22(
            room.id,
            payload.messageId,
            { 
                [`${payload.messageId}.${payload.playerId}_board`]: payload.selectedBoardId,
            },
            payload.playerId
        );

        firebase.updateBoardProperty(room.id, 'board.map', {
            top: payload.top,
            bottom: payload.bottom
        });
    }

    const onRegisterInitiativeResult = (timestamp, playerId, payload) => {
        //console.log(timestamp, playerId, payload);
        if(payload.length > 0 && payload.length % 2 === 0) {
            const [left, right] = payload.slice(-2);
            console.log(left, right);
            const leftScore = left.roll
                .split(',')
                .map(s => Number(s))
                .reduce((accumulatedInitiativeResult, dieSideNumber) => {
                    if (dieSideNumber === 6)
                        return accumulatedInitiativeResult + 1091;
                    if (dieSideNumber === 1)
                        return accumulatedInitiativeResult + 79;
                    if (dieSideNumber === 5)
                        return accumulatedInitiativeResult + 3;
                    return accumulatedInitiativeResult;
                }, 0);

            const rightScore = right.roll
                .split(',')
                .map(s => Number(s))
                .reduce((accumulatedInitiativeResult, dieSideNumber) => {
                    if (dieSideNumber === 6)
                        return accumulatedInitiativeResult + 1091;
                    if (dieSideNumber === 1)
                        return accumulatedInitiativeResult + 79;
                    if (dieSideNumber === 5)
                        return accumulatedInitiativeResult + 3;
                    return accumulatedInitiativeResult;
                }, 0);

            const withTimestamp = payload.reduce((r, c) => ({ ...r, [`${timestamp}.${c.id}`]: c.roll }), {});
            if(leftScore === rightScore) {
                console.log()
                firebase.updateInteractiveMessage32(
                    room.id,
                    timestamp,
                    {
                        ...withTimestamp,
                        [`${timestamp}.waitingFor`]: roomState.players,
                        [`${timestamp}.waitingReason`]: 'INITIATIVE_ROLL',
                    })
            } else if (leftScore > rightScore) {
                firebase.updateInteractiveMessage32(
                    room.id,
                    timestamp,
                    {
                        ...withTimestamp,
                        [`${timestamp}.waitingFor`]: [left.id.split('_')[0]],
                        [`${timestamp}.waitingReason`]: 'SELECT_FIRST_BOARD_OR_PASS',
                    })
            } else {
                firebase.updateInteractiveMessage32(
                    room.id,
                    timestamp,
                    {
                        ...withTimestamp,
                        [`${timestamp}.waitingFor`]: [right.id.split('_')[0]],
                        [`${timestamp}.waitingReason`]: 'SELECT_FIRST_BOARD_OR_PASS',
                    })
            }          

        } else {
            const withTimestamp = payload.reduce((r, c) => ({ ...r, [`${timestamp}.${c.id}`]: c.roll }), {});
            // console.log(payload, withTimestamp);
            firebase.updateInteractiveMessage22(
                room.id,
                timestamp,
                withTimestamp,
                myself.uid
            );
        }
    }

    const onPassFirstBoardSelection = (timestamp, playerId) => {
        firebase.updateInteractiveMessage32(
            room.id,
            timestamp,
            {
                [`${timestamp}.waitingFor`]: [roomState.players.find(p => p !== playerId)],
                [`${timestamp}.waitingReason`]: 'SELECT_FIRST_BOARD',
            })
    }

    return {
        startNextInteractiveStep: playerId => onPlayersReady(playerId),
        selectFirstBoard: (boardId, playerId, messageId) => onFirstBoardSelected(boardId, playerId, messageId),
        selectSecondBoard: payload => onSecondBoardSelected(payload),
        registerInitiativeResult: (timestamp, playerId, payload) => onRegisterInitiativeResult(timestamp, playerId, payload),
        passFirstBoardSelection: (timestamp, playerId) => onPassFirstBoardSelection(timestamp, playerId),
    };
}