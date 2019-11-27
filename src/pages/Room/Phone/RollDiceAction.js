import React, { useState, useContext, useEffect } from 'react';
import { useAuthUser } from '../../../components/Session';
import { FirebaseContext } from '../../../firebase';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import Die from '../../../components/Die';
import { getRandomIntInclusive } from '../../../data/seed';
//import seedrandom from 'seedrandom';
//import { seeds } from '../../../data/seed';

// function getRandomIntInclusive(min, max, nextRandom) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(nextRandom() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
// }

// const seeder = seedrandom();

// const rng = seedrandom(seeds[getRandomIntInclusive(0, seeds.length - 1, seeder)], { entropy: true });


export default function RollDiceAction({ roomId, rollResult, defaultAmount }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [canReduce, setCanReduce] = useState(false);
    const [canIncrease, setCanIncrease] = useState(false);
    const [selectedType, setSelectedType] = useState('INITIATIVE');
    const [values, setValues] = useState(
        rollResult
            ? new Array(rollResult)
            : defaultAmount
            ? new Array(defaultAmount).fill(1)
            : []
    );
    // const [currentMessage, setCurrentMessage] = useState('');

    // const handleTyping = e => {
    //     setCurrentMessage(e.target.value);
    // }

    const handleSendTextMessage = async () => {
        //const updated = values.map(_ => getRandomIntInclusive(1, 6));
        const amountOfRolls = 150;
        const res = new Array(amountOfRolls).fill(0).map(v => getRandomIntInclusive(1, 6)).reduce((r, v) => ({...r, [v]: r[v] + 1}), { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
        console.table(Object.entries(res).reduce((r, [k, v]) => ({...r, [k]: v / amountOfRolls }), { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }));
        // setValues(updated);
        // // if(currentMessage.length <= 0) return;
        // // const copy = currentMessage;
        // // setCurrentMessage('');
        // await firebase.addDiceRoll(roomId, {
        //     uid: myself.uid,
        //     type: selectedType,
        //     value: updated.join(),
        // });
    };

    const handleRollClick = () => {};

    const handleSwitchTo = type => () => {
        setSelectedType(type);
        setCanIncrease(true);
        setCanReduce(true);

        if (type === 'ATTACK') {
            setValues([1, 1]);
        } else if (type === 'DEFENCE') {
            setValues([1]);
        } else if (type === 'MAGIC') {
            setValues([1]);
        } else {
            setValues([1, 1, 1, 1]);
            setCanReduce(false);
            setCanIncrease(false);
        }
    };

    const handleAddMore = () => {
        setValues(prev => [...prev, 1]);
    };

    const handleMakeLess = () => {
        setValues(prev => prev.slice(1));
    };

    useEffect(() => {
        console.log('Dice Tray Updated', rollResult);
        if (rollResult) {
            setValues(rollResult.split(','));
        }
    }, [rollResult]);

    useEffect(() => {
        console.log('Dice Tray Values Updated', values);
    }, [values]);

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                flexFlow: 'column',
                alignItems: 'flex-start',
            }}
        >
            <Grid item xs={12} md={6} style={{ marginTop: '.3rem' }}>
                <Grid
                    container
                    spacing={1}
                    direction="column"
                    alignItems="center"
                >
                    <Grid item>
                        <ButtonGroup
                            variant="text"
                            size="small"
                            aria-label="small contained button group"
                        >
                            <Button
                                color={
                                    selectedType === 'ATTACK'
                                        ? 'primary'
                                        : 'default'
                                }
                                onClick={handleSwitchTo('ATTACK')}
                            >
                                Attack
                            </Button>
                            <Button
                                color={
                                    selectedType === 'DEFENCE'
                                        ? 'primary'
                                        : 'default'
                                }
                                onClick={handleSwitchTo('DEFENCE')}
                            >
                                Defence
                            </Button>
                            <Button
                                color={
                                    selectedType === 'MAGIC'
                                        ? 'primary'
                                        : 'default'
                                }
                                onClick={handleSwitchTo('MAGIC')}
                            >
                                Magic
                            </Button>
                            <Button
                                color={
                                    selectedType === 'INITIATIVE'
                                        ? 'primary'
                                        : 'default'
                                }
                                onClick={handleSwitchTo('INITIATIVE')}
                            >
                                Initiative
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Grid>
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    marginTop: '.5rem',
                    alignItems: 'center',
                }}
            >
                {canReduce && (
                    <ButtonBase
                        variant="contained"
                        color="primary"
                        onClick={handleMakeLess}
                        style={{
                            width: '2rem',
                            height: '2rem',
                        }}
                    >
                        <RemoveIcon
                            style={{
                                width: '2rem',
                                height: '2rem',
                            }}
                        />
                    </ButtonBase>
                )}

                {values.length > 0 &&
                    values.map((x, i) => (
                        <Die
                            key={i}
                            side={x}
                            type={selectedType}
                            style={{
                                width: '3rem',
                                height: '3rem',
                                marginRight: '.2rem',
                            }}
                        />
                    ))}
                {canIncrease && (
                    <ButtonBase
                        variant="contained"
                        color="primary"
                        onClick={handleAddMore}
                        style={{
                            width: '2rem',
                            height: '2rem',
                        }}
                    >
                        <AddIcon
                            style={{
                                width: '2rem',
                                height: '2rem',
                            }}
                        />
                    </ButtonBase>
                )}
            </div>
            <Button
                onClick={handleSendTextMessage}
                style={{ flex: '0 0 auto', alignSelf: 'flex-end' }}
            >
                <SendIcon />
            </Button>
        </div>
    );
}
