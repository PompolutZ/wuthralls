import React, { useState, useEffect, useContext } from 'react';
import { useAuthUser } from '../../../components/Session';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { FirebaseContext } from '../../../firebase';

export default function Warband({ roomId, myfighters, enemyFighters, onSelectedFighterChange, onShowSelectedFighterInfo, playerInfo }) {
    const myself = useAuthUser();
    const fighters = [...myfighters, ...enemyFighters];
    const pointyTokenBaseWidth = 95;
    const [selectedFighter, setSelectedFighter] = useState(null);
    const firebase = useContext(FirebaseContext);

    const handleFighterClicked = fighter => () => {
        if(!selectedFighter || selectedFighter.id !== fighter.id) {
            setSelectedFighter(fighter);
            onSelectedFighterChange(fighter);
        } else  {
            setSelectedFighter(null);
            onSelectedFighterChange(null);
        }
    }

    useEffect(() => {
        console.log('Warband.OnUpdated', selectedFighter);
    }, [selectedFighter])

    const handleRemoveFromBoard = fighter => e => {
        console.log('Request remove fighter', fighter);
        e.preventDefault();
        firebase.updateBoardProperty(roomId, `board.fighters.${fighter.id}`, {...fighter, isOnBoard: false, left: 0, top: 0, onBoard: {x: -1, y: -1}, tokens: '' });
        firebase.addGenericMessage(roomId, {
            author: 'Katophrane',
            type: 'INFO',
            subtype: 'PLACEMENT',
            value: `${myself.username} took ${fighter.name} out of action.`,
        })
    }

    const handleShowFighterInfo = fighter => e => {
        onShowSelectedFighterInfo({ ...fighter, unspentGlory: playerInfo.gloryScored - playerInfo.glorySpent, playerInfo: playerInfo, roomId: roomId });
        e.preventDefault();
    }

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                margin: '.5rem',
                overflow: 'scroll',
            }}
        >
            {
                fighters.map(fighter => (
                    <div key={fighter.id} style={{ 
                        marginRight: '1rem', 
                        marginLeft: '1rem',
                        display: 'flex',
                        flexFlow: 'column nowrap',
                        alignItems: 'center',
                    }} onClick={handleFighterClicked(fighter)}>
                        {
                            Boolean(fighter.tokens) && (
                                <div style={{ display: 'flex' }}>
                                    {
                                        fighter.tokens.split(',').map((token, idx) => (
                                            <img key={idx} src={`/assets/other/${token}.png`} style={{ width: '1rem', height: '1rem', marginRight: '.1rem' }} />
                                        ))
                                    }
                                </div>
                            )
                        }

                        <div style={{ position: 'relative' }}>
                            <img src={`/assets/fighters/${fighter.icon}-icon.png`} style={{ 
                                width: selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * 1.2 : pointyTokenBaseWidth,
                                
                                borderRadius: selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * 1.2 : pointyTokenBaseWidth,
                                
                                }} />
                            <div style={{
                                width: selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * 1.2 : pointyTokenBaseWidth,
                                height: selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * 1.2 : pointyTokenBaseWidth,
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: -(selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * 1.2 : pointyTokenBaseWidth) / 2,
                                marginLeft: -(selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * 1.2 : pointyTokenBaseWidth) / 2,
                                zIndex: 1,
                                boxSizing: 'border-box',
                                border: fighter.id.startsWith(myself.uid) ? '3px solid green' : '3px dashed red',
                                borderRadius: (selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * 1.2 : pointyTokenBaseWidth) / 2,
                                boxShadow: fighter.isInspired ? '0 0 12px 2px gold' : '',
                            }} />    
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
                                    zIndex: 2,
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
                            {
                                selectedFighter && selectedFighter.id === fighter.id && (
                                    <ButtonBase
                                            style={{
                                                position: 'absolute',
                                                top: '0%',
                                                right: '0%',
                                                backgroundColor: 'teal',
                                                color: 'white',
                                                width: '2rem',
                                                height: '2rem',
                                                borderRadius: '1.5rem',
                                                zIndex: 2
                                            }}
                                            onClick={handleShowFighterInfo(fighter)}
                                        >
                                            <EditIcon
                                                style={{
                                                    width: '1rem',
                                                    height: '1rem',
                                                }}
                                            />
                                    </ButtonBase>
                                )
                            }
                        </div>
                    </div>
                ))
            }                
        </div>
    );
}
