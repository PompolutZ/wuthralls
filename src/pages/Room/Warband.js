import React, { useState, useEffect, useContext } from 'react';
import { useAuthUser } from '../../components/Session';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import { FirebaseContext } from '../../firebase';

export default function Warband({ roomId, myfighters, enemyFighters, onSelectedFighterChange }) {
    const myself = useAuthUser();
    const fighters = [...myfighters, ...enemyFighters];
    const pointyTokenBaseWidth = 95;
    const [selectedFighter, setSelectedFighter] = useState(null);
    const firebase = useContext(FirebaseContext);

    const handleFighterClicked = fighter => () => {
        setSelectedFighter(fighter);
        onSelectedFighterChange(fighter);
    }

    useEffect(() => {
        console.log('Warband.OnUpdated', selectedFighter);
    }, [selectedFighter])

    const handleRemoveFromBoard = fighter => e => {
        console.log('Request remove fighter', fighter);
        e.preventDefault();
        firebase.updateBoardProperty(roomId, `board.fighters.${fighter.id}`, {...fighter, isOnBoard: false, left: 0, top: 0, onBoard: {x: -1, y: -1}});
        firebase.addGenericMessage(roomId, {
            author: 'Katophrane',
            type: 'INFO',
            subtype: 'PLACEMENT',
            value: `${myself.username} took ${fighter.name} out of action.`,
        })
    }

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                margin: '.5rem',
                overflow: 'scroll',
            }}
        >
            {
                fighters.map(fighter => (
                    <div key={fighter.id} style={{ marginRight: '1rem', position: 'relative', }} onClick={handleFighterClicked(fighter)}>
                        <img src={`/assets/fighters/${fighter.icon}-icon.png`} style={{ 
                            width: selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * .8 : pointyTokenBaseWidth * .7,
                            border: fighter.id.startsWith(myself.uid) ? '3px solid green' : '3px dashed red',
                            borderRadius: selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * .8 : pointyTokenBaseWidth * .7 }} />
                        <ButtonBase
                            style={{
                                position: 'absolute',
                                bottom: '0%',
                                right: '0%',
                                backgroundColor: 'red',
                                color: 'white',
                                width: '2rem',
                                height: '2rem',
                                borderRadius: '1.5rem',
                            }}
                            onClick={handleRemoveFromBoard(fighter)}
                        >
                            <DeleteIcon
                                style={{
                                    width: '1rem',
                                    height: '1rem',
                                }}
                            />
                        </ButtonBase>
                    </div>
                ))
            }                
        </div>
    );
}
