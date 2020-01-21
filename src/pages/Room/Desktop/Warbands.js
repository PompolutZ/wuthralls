import React, { useState, useEffect, useContext } from 'react';
import { useAuthUser } from '../../../components/Session';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { FirebaseContext } from '../../../firebase';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flex: 1,
        margin: '.5rem',
        flexFlow: 'row wrap',
        '& > *': {
            flex: '1 100%',
        },
    },
}));

export default function Warbands({ roomId, myfighters, enemyFighters, onSelectedFighterChange, onShowSelectedFighterInfo, playerInfo }) {
    const classes = useStyles();
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
        firebase.addGenericMessage2(roomId, {
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
        <div className={classes.root}
        >
            <div>
                <Typography style={{ borderBottom: '1px solid dimgray'}}>My Warband:</Typography>
                <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-around' }}>
                    {
                        fighters.filter(f => f.id.startsWith(myself.uid)).map(fighter => (
                            <Fighter key={fighter.id} 
                                fighter={fighter} 
                                myself={myself} 
                                selectedFighter={selectedFighter} 
                                handleRemoveFromBoard={handleRemoveFromBoard} 
                                pointyTokenBaseWidth={pointyTokenBaseWidth} 
                                handleFighterClicked={handleFighterClicked} 
                                handleShowFighterInfo={handleShowFighterInfo} />
                        ))
                    }                
                </div>
            </div>
            <div>
                <Typography style={{ borderBottom: '1px solid dimgray'}}>Opponent Warband:</Typography>
                    <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-around' }}>
                    {
                        fighters.filter(f => !f.id.startsWith(myself.uid)).map(fighter => (
                            <Fighter key={fighter.id} 
                                fighter={fighter} 
                                myself={myself} 
                                selectedFighter={selectedFighter} 
                                handleRemoveFromBoard={handleRemoveFromBoard} 
                                pointyTokenBaseWidth={pointyTokenBaseWidth} 
                                handleFighterClicked={handleFighterClicked} 
                                handleShowFighterInfo={handleShowFighterInfo} />
                        ))
                    }                
                </div>
            </div>
        </div>
    );
}

function Fighter({ fighter, myself, selectedFighter, handleRemoveFromBoard, pointyTokenBaseWidth, handleFighterClicked, handleShowFighterInfo }) {
    return (
        <div style={{ marginRight: '1rem', paddingTop: '1rem', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(2px 2px 5px dimgray)' }} onClick={handleFighterClicked(fighter)}>
            <div style={{ 
                width: pointyTokenBaseWidth * .7,                                 
                height: pointyTokenBaseWidth * .7,                                 
                borderRadius: pointyTokenBaseWidth * .7,
                boxSizing: 'border-box',
                position: 'relative',
                border: fighter.id.startsWith(myself.uid) ? selectedFighter && selectedFighter.id === fighter.id ? '3px dashed green' : '3px solid green' : selectedFighter && selectedFighter.id === fighter.id ? '3px dashed red' : '3px solid red',
                backgroundImage: `url(/assets/fighters/${fighter.icon}-icon.png)`,
                backgroundSize: 'cover',
                transform: !fighter.id.startsWith(myself.uid) ? 'scaleX(-1)' : '',
                filter: fighter.isOnBoard ? '' : 'grayscale(100%)',
                }}>
                <div style={{
                    width: '70%',
                    height: '70%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-35%',
                    marginLeft: '-35%',
                    zIndex: -2,
                    boxSizing: 'border-box',
                    // border: fighter.id.startsWith(myself.uid) ? '3px solid green' : '3px dashed red',
                    borderRadius: '70%',
                    boxShadow: selectedFighter && selectedFighter.id === fighter.id ? fighter.id.startsWith(myself.uid) ? '0 0 25px 10px green' : '0 0 25px 10px red' : ''
                }} />    
                <div style={{
                    width: '70%',
                    height: '70%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-35%',
                    marginLeft: '-35%',
                    zIndex: -1,
                    boxSizing: 'border-box',
                    // border: fighter.id.startsWith(myself.uid) ? '3px solid green' : '3px dashed red',
                    borderRadius: '70%',
                    boxShadow: fighter.isInspired ? '0 0 35px 15px yellow' : ''
                }} />    
                {
                    selectedFighter && selectedFighter.id === fighter.id && fighter.isOnBoard && (
                        <ButtonBase
                            style={{
                                position: 'absolute',
                                bottom: '0%',
                                right: '0%',
                                marginBottom: '-.7rem',
                                marginRight: '-1rem',
                                backgroundColor: 'red',
                                color: 'white',
                                width: '2rem',
                                height: '2rem',
                                borderRadius: '1.5rem',
                                zIndex: 2,
                                boxSizing: 'border-box',
                                border: '2px solid white',
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
                    )
                }
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
                                    marginTop: '-.7rem',
                                    marginRight: '-1rem',
                                    borderRadius: '1.5rem',
                                    zIndex: 2,
                                    boxSizing: 'border-box',
                                    border: '2px solid white',
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
            <Typography style={{ fontSize: '.7rem' }}>{fighter.name}</Typography>
            <div style={{ display: 'flex' }}>
                {
                    Boolean(fighter.tokens) && fighter.tokens.split(',').map((token, idx) => (
                        <img key={idx} src={`/assets/other/${token}.png`} style={{ width: '1rem', height: '1rem', marginRight: '.1rem' }} />
                    ))
                }
                {
                    Boolean(fighter.counters) && fighter.counters.split(',').map((counter, idx) => (
                        <img key={idx} src={`/assets/other/${counter}.png`} style={{ width: '1rem', height: '1rem', marginRight: '.1rem' }} />
                    ))
                }
            </div>
        </div>

    )
}