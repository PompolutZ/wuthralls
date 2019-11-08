import React, { useState, useContext, useEffect } from 'react';
import { useAuthUser } from '../../components/Session';
import { FirebaseContext } from '../../firebase';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import DiceTray from '../../components/DiceTray';
import Die from '../../components/Die';

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

export default function RollDiceAction({ roomId, rollResult, defaultAmount }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [canReduce, setCanReduce] = useState(false);
    const [canIncrease, setCanIncrease] = useState(false);
    const [values, setValues] = useState(rollResult ? new Array(rollResult) : defaultAmount ? new Array(defaultAmount).fill(1) : []);
    // const [currentMessage, setCurrentMessage] = useState('');

    // const handleTyping = e => {
    //     setCurrentMessage(e.target.value);
    // }

    const handleSendTextMessage = async () => {
        const updated = values.map(_ => getRandomIntInclusive(1, 6));
        setValues(updated);
        // if(currentMessage.length <= 0) return;
        // const copy = currentMessage;
        // setCurrentMessage('');
        await firebase.addDiceRoll(roomId, {
            uid: myself.uid,
            type: 'INITIATIVE',
            value: updated.join()
        });
    };

    const handleRollClick = () => {
        
    }

    const handleAddMore = () => {
        setValues(prev => [...prev, 1]);
    }

    const handleMakeLess = () => {
        setValues(prev => prev.slice(1))
    }

    useEffect(() => {
        console.log('Dice Tray Updated', rollResult);
        if(rollResult) {
            setValues(rollResult.split(','));
        }
    }, [rollResult])

    useEffect(() => {
        console.log('Dice Tray Values Updated', values);
    }, [values])

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                marginBottom: '.5rem',
            }}
        >
            <div style={{ display: 'flex', flexFlow: 'column nowrap', flex: 1 }}>
                <div style={{ display: 'flex' }}>
                    {values.length > 0 &&
                        values.map((x, i) => (
                            <Die
                                key={i}
                                side={x}
                                type="ATTACK"
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    marginRight: '.2rem',
                                }}
                            />
                        ))}
                </div>
                <div style={{ display: 'flex' }}>
                    {canReduce && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleMakeLess}
                        >
                            Less
                        </Button>
                    )}

                    {canIncrease && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddMore}
                        >
                            More
                        </Button>
                    )}
                </div>
            </div>
            <Button
                onClick={handleSendTextMessage}
                style={{ flex: '0 0 auto' }}
            >
                <SendIcon />
            </Button>
        </div>
    );
}
