import React, { useEffect, useContext, useState, useRef } from 'react';
import { FirebaseContext } from '../../../firebase';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import { useAuthUser } from '../../../components/Session';
import SplitButton from './SplitButton';
import Die from '../../../components/Die';
import { getDieRollResult } from '../../../common/function';
import HUDOverlay from '../../../components/HUDOverlay';
import boards from '../../../data/boards';
import ButtonBase from '@material-ui/core/ButtonBase';
import MoveNextIcon from '@material-ui/icons/LabelImportant';
import FlipIcon from '@material-ui/icons/RotateRight';
import useKatophrane from '../../../components/hooks/useKatophrane';
import Markdown from 'react-markdown';
import AttackDie from '../../../components/AttackDie';
import DefenceDie from '../../../components/DefenceDie';
import MagicDie from '../../../components/MagicDie';
import { 
    warbandColors,
    boards as boardsInfo } from '../../../data';

const useStyles = makeStyles(theme => ({
    item: {
        margin: '.5rem 1rem .5rem .5rem',
        padding: '.3rem',
        borderRadius: '.3rem',
    },

    root: {
        flexGrow: 1,
        overflow: 'auto',
    },
}));

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

const DiceRollMessage = React.memo(({
    id, author, value, type, timestamp, authorFaction
}) => {
    const classes = useStyles();
    const [created, setCreated] = useState(null);

    useEffect(() => {
        const date = new Date();
        date.setTime(timestamp);
        setCreated(date);
    }, []);

    const {r, g, b} = hexToRgb(warbandColors[authorFaction]);

    return (
        <Grid
            id={timestamp}
            item
            xs={12}
            className={classes.item}
            style={{ backgroundColor: `rgba(${r},${g},${b}, .5)` }}
        >
            <Typography
                variant="body2"
                style={{ color: 'ghostwhite', fontWeight: 'bold', fontSize: '.6rem' }}
            >{`${author} rolls ${type}:`}</Typography>
            <Typography
                variant="body2"
                style={{ color: 'lightgray', fontSize: '.6rem' }}
            >{`${created &&
                created.toLocaleString('en-US', {
                    hour12: false,
                })}`}</Typography>
            <div style={{ display: 'flex', margin: '1rem', }}>
                {value.split(',').map((x, i) => (
                    <div key={i} style={{ width: 36, height: 36, marginRight: '.2rem', backgroundColor: 'white', borderRadius: 36 * .2, filter: 'drop-shadow(2.5px 2.5px 5px black)', }}>
                        {
                            type === 'ATTACK' && <AttackDie accentColorHex={warbandColors[authorFaction]} size={36} side={x} useBlackOutline={authorFaction === 'zarbags-gitz'} />
                        }
                        {
                            type === 'DEFENCE' && <DefenceDie accentColorHex={warbandColors[authorFaction]} size={36} side={x} useBlackOutline={authorFaction === 'zarbags-gitz'} />
                        }
                        {
                            type === 'MAGIC' && <MagicDie size={36} side={x} />
                        }
                        {
                            type === 'INITIATIVE' && i % 2 === 0 && <DefenceDie accentColorHex={warbandColors[authorFaction]} size={36} side={x} useBlackOutline={authorFaction === 'zarbags-gitz'} />
                        }
                        {
                            type === 'INITIATIVE' && i % 2 !== 0 && <AttackDie accentColorHex={warbandColors[authorFaction]} size={36} side={x} useBlackOutline={authorFaction === 'zarbags-gitz'} />
                        }
                    </div>
                )
                )}
            </div>
        </Grid>
    );
});

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const CardMessageItem = React.memo(({
    isLastMessage,
    author,
    isMineMessage,
    cardId,
    value,
    timestamp,
}) => {
    const classes = useStyles();
    const [highlight, setHighlight] = useState(false);
    const [created, setCreated] = useState(null);

    useEffect(() => {
        const date = new Date();
        date.setTime(timestamp);
        setCreated(date);
    }, []);

    const handleSwitchHighglight = () => {
        setHighlight(prev => !prev);
    };

    return (
        <Grid
            id={timestamp}
            item
            xs={12}
            className={classes.item}
            style={{
                backgroundColor:
                    author === 'Katophrane'
                        ? 'rgba(0, 128, 128, 1)'
                        : isMineMessage
                        ? 'rgba(255, 140, 0, 1)'
                        : 'rgba(138, 43, 226, 1)',
                // filter: 'drop-shadow(5px 5px 10px black)',
            }}
        >
            <div>
                <Typography
                    variant="body2"
                    style={{
                        color: isMineMessage ? 'magenta' : 'ghostwhite',
                        fontWeight: 'bold',
                        fontSize: '.6rem',
                    }}
                >{`${author}`}</Typography>
                <Typography
                    variant="body2"
                    style={{ color: 'ghostwhite', fontSize: '.6rem' }}
                >{`${created &&
                    created.toLocaleString('en-US', {
                        hour12: false,
                    })}`}</Typography>
            </div>
            <Typography style={{ color: 'white' }}>{value}</Typography>
            <img
                src={`/assets/cards/${cardId}.png`}
                style={{ width: '5rem', borderRadius: '.3rem' }}
                onClick={handleSwitchHighglight}
            />
            {highlight && (
                <div
                    style={{
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        top: '0',
                        left: '0',
                        display: 'flex',
                        zIndex: 100000,
                        perspective: '5rem',
                        backgroundColor: 'rgba(255,255,255,.5)',
                    }}
                >
                    <Paper
                        style={{
                            position: 'relative',
                            flexShrink: 0,
                            width: cardDefaultWidth * 0.8,
                            height: cardDefaultHeight * 0.8,
                            margin: 'auto',
                            borderRadius: '1rem',
                            // border: '3px dashed black',
                            // boxSizing: 'border-box',
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: `url(/assets/cards/${cardId}.png)`,
                        }}
                        elevation={10}
                        onClick={handleSwitchHighglight}
                    ></Paper>
                </div>
            )}
        </Grid>
    );
})

const ChatMessageItem = React.memo(({
    isLastMessage,
    author,
    isMineMessage,
    value,
    timestamp,
}) => {
    const classes = useStyles();
    const [created, setCreated] = useState(null);

    useEffect(() => {
        const date = new Date();
        date.setTime(timestamp);
        setCreated(date);
    }, []);

    return (
        <Grid
            id={timestamp}
            item
            xs={12}
            className={classes.item}
            style={{
                backgroundColor: '#36393F',
                    // author === 'Katophrane'
                    //     ? '#36393F'
                    //     : isMineMessage
                    //     ? 'rgba(255, 140, 0, 1)'
                    //     : 'rgba(138, 43, 226, 1)',
                // filter: 'drop-shadow(5px 5px 10px black)',
            }}
        >
            <div>
                <Typography
                    variant="body2"
                    style={{
                        color: isMineMessage ? 'magenta' : 'ghostwhite',
                        fontWeight: 'bold',
                        fontSize: '.6rem',
                    }}
                >{`${author}`}</Typography>
                <Typography
                    variant="body2"
                    style={{ color: '#727479', fontSize: '.6rem' }}
                >{`${created &&
                    created.toLocaleString('en-US', {
                        hour12: false,
                    })}`}</Typography>
            </div>
            <div style={{ color: author === 'Katophrane' ? '#ACD0D4' : isMineMessage ? '#FFEFD5' : '#FA8072' }}>
                <Markdown source={value} />
            </div>
        </Grid>
    );
})


function PickFirstBoardHUD({ data, onFirstBoardSelected}) {
    const boardsList = Object.entries(boards).map(([k, v]) => ({...v, id: k}));
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleMoveBy = direction => () => {
        const next = currentIndex + direction;
        setCurrentIndex(next < 0 ? 0 : next > boardsList.length - 1 ? boardsList.length - 1 : next);
    }

    const handleSelectCurrentBoard = () => {
        console.log(data);
        onFirstBoardSelected({...data, boardId: currentIndex + 1 });
    }

    console.log(window.screen.width);
    return (
        <div style={{ width: `calc(${window.screen.width}px - 1rem)`, height: `calc(${window.screen.height}px - 1rem)`, boxSizing: 'border-box', padding: '1rem', display: 'flex' }}>
            <div style={{ margin: 'auto', display: 'flex', flexFlow: 'column nowrap', alignItems: 'center' }}>
                <Typography>{boardsList[currentIndex].name}</Typography>
                <div style={{ position: 'relative' }}>
                    <img src={`/assets/boards/${boardsList[currentIndex].id}.jpg`} style={{ width: window.screen.width * .7 }} alt={boardsList[currentIndex].name} />
                    <ButtonBase style={{ backgroundColor: 'teal', color: 'white', width: '2rem', height: '2rem', boxSizing: 'boarder-box', border: '2px solid white', borderRadius: '2rem', position: 'absolute', top: '50%', left: 0, marginTop: '-1rem', marginLeft: '-1rem' }}
                        onClick={handleMoveBy(-1)}>
                        <MoveNextIcon style={{ transform: 'rotate(180deg)'}} />
                    </ButtonBase>
                    <ButtonBase style={{ backgroundColor: 'teal', color: 'white', width: '2rem', height: '2rem', boxSizing: 'boarder-box', border: '2px solid white', borderRadius: '2rem', position: 'absolute', top: '50%', right: 0, marginTop: '-1rem', marginRight: '-1rem' }}
                        onClick={handleMoveBy(1)}>
                        <MoveNextIcon />
                    </ButtonBase>
                </div>
                <Button onClick={handleSelectCurrentBoard} color="primary" variant="contained">
                    Pick this board
                </Button>
            </div>
        </div>
    )
}

function PickSecondBoard({ data, onSecondBoardSelected }) {
    const boardsList = Object.entries(boards).map(([k, v]) => ({...v, id: k}));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [values, setValues] = useState({
        top: {
            rotate: 0
        },
        bottom: {
            rotate: 0,
        }
    })

    useEffect(() => {
        console.log(values);
    }, [values]);

    const handleMoveBy = direction => () => {
        const next = currentIndex + direction;
        setCurrentIndex(next < 0 ? 0 : next > boardsList.length - 1 ? boardsList.length - 1 : next);
    }

    const handleSelectCurrentBoard = () => {
        console.log(data);
        onSecondBoardSelected({
            ...data, 
            selectedBoardId: currentIndex + 1,
            top: { id: data.opponentBoard, rotate: values.top.rotate }, 
            bottom: { id: currentIndex + 1, rotate: values.bottom.rotate } 
        });
    }

    const flipBoard = name => () => {
        const currentValue = values[name];
        const updatedValue = {
            ...currentValue,
            rotate: currentValue.rotate === 0 ? 180 : 0,
        };

        setValues({
            ...values,
            [name]: updatedValue,
        });
    }

    console.log('SECOND BOARD LOADED', data);

    return (
        <div style={{ width: `calc(${window.screen.width}px - 1rem)`, height: `calc(${window.screen.height}px - 1rem)`, boxSizing: 'border-box', padding: '1rem', display: 'flex' }}>
            <div style={{ margin: 'auto', display: 'flex', flexFlow: 'column nowrap', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <img src={`/assets/boards/${boardsList[data.opponentBoard - 1].id}.jpg`} style={{ width: window.screen.width * .7, transform: `rotate(${values.top.rotate}deg)`, transformOrigin: 'center center' }} alt={boardsList[data.opponentBoard - 1].name} />                    
                    <ButtonBase style={{ backgroundColor: 'teal', color: 'white', width: '2rem', height: '2rem', boxSizing: 'boarder-box', border: '2px solid white', borderRadius: '2rem', position: 'absolute', top: '50%', left: 0, marginTop: '-1rem', marginLeft: '-1rem' }}
                        onClick={flipBoard('top')}>
                        <FlipIcon style={{ transform: 'rotate(180deg)'}} />
                    </ButtonBase>
                </div>
                <div style={{ position: 'relative' }}>
                    <img src={`/assets/boards/${boardsList[currentIndex].id}.jpg`} style={{ width: window.screen.width * .7, transform: `rotate(${values.bottom.rotate}deg)`, transformOrigin: 'center center' }} alt={boardsList[currentIndex].name} />
                    <ButtonBase style={{ backgroundColor: 'teal', color: 'white', width: '2rem', height: '2rem', boxSizing: 'boarder-box', border: '2px solid white', borderRadius: '2rem', position: 'absolute', top: '50%', left: 0, marginTop: '-1rem', marginLeft: '-1rem' }}
                        onClick={handleMoveBy(-1)}>
                        <MoveNextIcon style={{ transform: 'rotate(180deg)'}} />
                    </ButtonBase>
                    <ButtonBase style={{ backgroundColor: 'teal', color: 'white', width: '2rem', height: '2rem', boxSizing: 'boarder-box', border: '2px solid white', borderRadius: '2rem', position: 'absolute', top: '50%', right: 0, marginTop: '-1rem', marginRight: '-1rem' }}
                        onClick={handleMoveBy(1)}>
                        <MoveNextIcon />
                    </ButtonBase>
                    <ButtonBase style={{ backgroundColor: 'teal', color: 'white', width: '2rem', height: '2rem', boxSizing: 'boarder-box', border: '2px solid white', borderRadius: '2rem', position: 'absolute', bottom: '0%', left: '50%', marginBottom: '-1rem', marginLeft: '-1rem' }}
                        onClick={flipBoard('bottom')}>
                        <FlipIcon style={{ transform: 'rotate(180deg)'}} />
                    </ButtonBase>
                </div>
                <Typography style={{ marginTop: '1rem' }}>{boardsList[currentIndex].name}</Typography>
                <Button onClick={handleSelectCurrentBoard} color="primary" variant="contained">
                    I am happy with this board
                </Button>
            </div>
        </div>
    )
}

function InteractiveMessage({ data, roomId, isLastMessage, timestamp, onShowHUD, state }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const katophrane = useKatophrane(state);
    const actors = data.actors;
    const classes = useStyles();
    const [created, setCreated] = useState(null);
    const opponent = actors.find(p => p !== myself.uid) || '';
    const [rollResults, setRollResults] = useState(Object.entries(data).filter(([k, v]) => k.includes('_roll')).map(([k, v]) => ({ roll: v, id: k })));
    const [boards, setBoards] = useState(Object.entries(data).filter(([k, v]) => k.includes('_board')).map(([k, v]) => ({ board: v, id: k })));

    useEffect(() => {
        const date = new Date();
        date.setTime(timestamp);
        setCreated(date);
        console.log('LOADED', data);
    }, []);

    useEffect(() => {
        console.log('CHANGED DATA')
        setRollResults(Object.entries(data).filter(([k, v]) => k.includes('_roll')).map(([k, v]) => ({ roll: v, id: k })));
        setBoards(Object.entries(data).filter(([k, v]) => k.includes('_board')).map(([k, v]) => ({ board: v, id: k })));
    }, [data]);

    const handleInitiativeRoll = () => {
        const rollResult = new Array(4)
            .fill(0)
            .map(_ => getDieRollResult());
        //setMyRoll(rollResult);
        const allResults = [
            ...rollResults,
            {
                id: `${myself.uid}_roll_${rollResult.join('')}`,
                roll: rollResult.join(),
            }
        ];
        setRollResults(allResults);

        katophrane.registerInitiativeResult(timestamp, myself.uid, allResults);
    };

    const handlePickBoardFirst = () => {
        onShowHUD('PICK_FIRST_BOARD', {playerId: myself.uid, messageId: timestamp });
    }

    const handlePickSecondBoard = () => {
        onShowHUD('PICK_SECOND_BOARD', {playerId: myself.uid, messageId: timestamp, opponentBoard: boards.find(b => !b.id.includes(myself.uid)).board });
    }

    const handlePassFirstBoardSelection = () => {
        katophrane.passFirstBoardSelection(timestamp, myself.uid);
    }

    return (
        <Grid
            id={timestamp}
            item
            xs={12}
            className={classes.item}
            style={{ border: '3px solid rgba(255,69,0)' }}
        >
            <Typography
                variant="body2"
                style={{
                    color: 'rgba(255,69,0)',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                }}
            >{`Initiative roll for boards selection`}</Typography>
            <Typography
                variant="body2"
                style={{ color: 'gray', fontSize: '.6rem' }}
            >{`${created &&
                created.toLocaleString('en-US', {
                    hour12: false,
                })}`}</Typography>

            <Grid container>
                <Grid item xs={6}>
                    <Typography
                        variant="body2"
                        style={{
                            color: 'gray',
                            fontWeight: 'bold',
                            fontSize: '.8rem',
                        }}
                    >{`My results`}</Typography>
                    <Grid container direction="column" alignItems="center">
                    {
                        rollResults && rollResults.length > 0 && rollResults.filter(r => r.id.includes(myself.uid)).map(r => (
                            <div key={r.id} style={{ display: 'flex' }}>
                                {
                                    r.roll.split(',').map((x, i) => (
                                        <div key={i} style={{ width: 24, height: 24, marginRight: '.2rem', backgroundColor: 'white', borderRadius: 24 * .2 }}>
                                            {
                                                i % 2 === 0 && <DefenceDie accentColorHex={warbandColors[state[myself.uid].faction]} size={24} side={x} useBlackOutline={state[myself.uid].faction === 'zarbags-gitz'} />
                                            }
                                            {
                                                i % 2 !== 0 && <AttackDie accentColorHex={warbandColors[state[myself.uid].faction]} size={24} side={x} useBlackOutline={state[myself.uid].faction === 'zarbags-gitz'} />
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    }
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Typography
                        variant="body2"
                        style={{
                            color: 'gray',
                            fontWeight: 'bold',
                            fontSize: '.8rem',
                        }}
                    >{`Opponent's result`}</Typography>
                    <Grid container direction="column" alignItems="center">
                    {
                        rollResults && rollResults.length > 0 && rollResults.filter(r => r.id.includes(opponent)).map(r => (
                            <div key={r.id} style={{ display: 'flex' }}>
                                {
                                    r.roll.split(',').map((x, i) => (
                                        <div key={i} style={{ width: 24, height: 24, marginRight: '.2rem', backgroundColor: 'white', borderRadius: 24 * .2 }}>
                                            {
                                                i % 2 === 0 && <DefenceDie accentColorHex={warbandColors[state[opponent].faction]} size={24} side={x} useBlackOutline={state[opponent].faction === 'zarbags-gitz'} />
                                            }
                                            {
                                                i % 2 !== 0 && <AttackDie accentColorHex={warbandColors[state[opponent].faction]} size={24} side={x} useBlackOutline={state[opponent].faction === 'zarbags-gitz'} />
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    }
                    </Grid>
                </Grid>
            </Grid>
            {data.waitingFor.length > 0 && !data.waitingFor.includes(myself.uid) && (
                <Typography>
                    Waiting for the opponent
                </Typography>
            )}
            {
                data.waitingFor.includes(myself.uid) && 
                data.waitingReason === 'INITIATIVE_ROLL' && (
                    <Grid container>
                        <Typography>
                            Please roll the initiative.
                        </Typography>
                        <Grid item xs={12} container justify="center">
                            <Button onClick={handleInitiativeRoll} variant="contained" color="primary">Roll</Button>
                        </Grid>
                    </Grid>
                )
            }
            {
                data.waitingFor.includes(myself.uid) && 
                data.waitingReason === 'SELECT_FIRST_BOARD_OR_PASS' && (
                    <Grid container>
                        <Typography>
                            You have won initiative roll and need to decide whether to pick first or second board.
                        </Typography>
                        <Grid item xs={6}>
                            <Button onClick={handlePickBoardFirst}>Pick Board First</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button onClick={handlePassFirstBoardSelection}>Pick Board Second</Button>
                        </Grid>
                    </Grid>
                )
            }
            {
                data.waitingFor.includes(myself.uid) && 
                data.waitingReason === 'SELECT_FIRST_BOARD' && (
                    <Grid container>
                        <Typography>
                            You need to pick first board.
                        </Typography>
                        <Grid item xs={12}>
                            <Button onClick={handlePickBoardFirst}>Pick my board</Button>
                        </Grid>
                    </Grid>
                )
            }
            {
                data.waitingFor.includes(myself.uid) && 
                data.waitingReason === 'SELECT_SECOND_BOARD' && (
                    <Grid container>
                        <Typography>
                            Your opponent has picked board: {boardsInfo[data[`${actors.find(a => a !== myself.uid)}_board`]].name}.
                        </Typography>
                        <Grid item xs={12}>
                            <Button onClick={handlePickSecondBoard}>Pick my board</Button>
                        </Grid>
                    </Grid>
                )
            }
        </Grid>
    );
}

function Messenger({ roomId, state, messages }) {
    const classes = useStyles();
    const myself = useAuthUser();
    const containerRef = useRef(null);
    const katophrane = useKatophrane(state);
    // const [messages, setMessages] = useState([]);
    const firebase = useContext(FirebaseContext);
    const [showMainHUD, setShowMainHUD] = useState(null);
    const [mainHUDPayload, setMainHUDPayload] = useState(null);

    useEffect(() => {
        if(!messages) return;
        const lastMessage = messages[messages.length - 1];
        if(lastMessage) {
            const element = document.getElementById(lastMessage.id);
            if(element) {
                element.scrollIntoView();
                console.log('SCROLLING INTO VIEW');
            }
        }

        console.log('MESSEGER', messages);
    }, []);

    useEffect(() => {
        if(!messages) return;
        const lastMessage = messages[messages.length - 1];
        if(lastMessage) {
            const element = document.getElementById(lastMessage.id);
            if(element) {
                element.scrollIntoView();
                console.log('SCROLLING INTO VIEW', lastMessage);
            }
        }

        // return () => unsubscribe();
    }, [messages]);

    const handleCloseOverlay = e => {
        setShowMainHUD(null);
        setMainHUDPayload(null);
        
        e.preventDefault();
    }

    const handleShowHUDType = (type, payload) => {
        setShowMainHUD(type);
        setMainHUDPayload(payload);
    }

    const handleFirstBoardSelected = payload => {
        katophrane.selectFirstBoard({...payload });
        setShowMainHUD(null);
    }

    const handleSecondBoardSelected = payload => {
        katophrane.selectSecondBoard(payload);
        setShowMainHUD(null);
    }

    return (
        <Grid
            ref={containerRef}
            container
            spacing={0}
            className={classes.root}
            style={{ filter: showMainHUD ? 'blur(3px)' : '', backgroundColor: '#36393F' }}
        >
            <div style={{ width: '100%', marginBottom: '2.5rem', backgroundColor: '#36393F' }}>
            {messages && messages.length > 0 &&
                messages.map((m, i, arr) => {
                    if (m.type === 'INTERACTIVE') {
                        return (
                            <InteractiveMessage
                                state={state}
                                key={m.id}
                                roomId={roomId}
                                data={m}
                                isLastMessage={arr.length - 1 === i}
                                timestamp={m.id}
                                onShowHUD={handleShowHUDType}
                            />
                        );
                    }

                    if (
                        m.type === 'INFO' &&
                        m.subtype &&
                        m.subtype.includes('CARD')
                    ) {
                        return (
                            <CardMessageItem
                                key={m.id}
                                timestamp={m.id}
                                isLastMessage={arr.length - 1 === i}
                                author={
                                    m.author === 'Katophrane'
                                        ? m.author
                                        : Boolean(state[m.author])
                                        ? state[m.author].name
                                        : m.author
                                }
                                isMineMessage={m.author === myself.uid}
                                cardId={m.cardId}
                                value={m.value}
                            />
                        );
                    }

                    if (m.type === 'CHAT' || m.type === 'INFO') {
                        return (
                            <ChatMessageItem
                                key={m.id}
                                timestamp={m.id}
                                isLastMessage={arr.length - 1 === i}
                                author={
                                    m.author === 'Katophrane'
                                        ? m.author
                                        : Boolean(state[m.author])
                                        ? state[m.author].name
                                        : m.author
                                }
                                isMineMessage={m.author === myself.uid}
                                value={m.value}
                            />
                        );
                    }

                    if (m.type === 'DICE_ROLL') {
                        return (
                            <DiceRollMessage
                                key={m.created}
                                timestamp={m.id}
                                id={
                                    arr.length - 1 === i
                                        ? 'lastMessage'
                                        : 'message'
                                }
                                author={`${
                                    m.author === 'Katophrane'
                                        ? m.author
                                        : Boolean(state[m.author])
                                        ? state[m.author].name
                                        : m.author
                                }:`}
                                authorFaction={state[m.author].faction}
                                value={m.value}
                                type={m.subtype}
                            />
                        );
                    }
                })}
            </div>
        </Grid>
    );
}

export default Messenger;
