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


const useStyles = makeStyles(theme => ({
    item: {
        margin: '.5rem 1rem .5rem .5rem',
        padding: '.3rem',
        borderRadius: '.3rem'
    },

    root: {
        flexGrow: 1,
    }
}));

function DiceRollMessage({ id, author, value, type, timestamp }) {
    const classes = useStyles();
    const [created, setCreated] = useState(null);

    useEffect(() => {
        const date = new Date();
        date.setTime(timestamp);
        setCreated(date);
    }, [])

    console.log(type);

    return (
            <Grid id={id} item xs={12} className={classes.item} style={{ backgroundColor: 'rgba(30,144,255,.2)' }}>
            <Typography variant="body2" style={{ color: 'gray', fontWeight: 'bold', fontSize: '.6rem' }}>{`${author} rolls ${type}:`}</Typography>
            <Typography variant="body2" style={{ color: 'gray', fontSize: '.6rem' }}>{`${created && created.toLocaleString('en-US', { hour12: false })}`}</Typography>
            <div>
                {
                    value.split(',').map((x, i) => {
                        console.log(i % 2);
                        return type === 'INITIATIVE' ?
                        <Die
                            key={i}
                            side={x}
                            type={type}
                            prefix={i % 2 === 0 ? 'D' : 'A'}
                            style={{
                                width: '2rem',
                                height: '2rem',
                                marginRight: '.2rem',
                            }}
                        /> :
                        <Die
                            key={i}
                            side={x}
                            type={type}
                            style={{
                                width: '2rem',
                                height: '2rem',
                                marginRight: '.2rem',
                            }}
                        />
                })
            }                
            </div>
        </Grid>
    )
}

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

function CardMessageItem({ isLastMessage, author, isMineMessage, cardId, value, timestamp }) {
    const classes = useStyles();
    const [highlight, setHighlight] = useState(false);
    const [created, setCreated] = useState(null);

    useEffect(() => {
        const date = new Date();
        date.setTime(timestamp);
        setCreated(date);
    }, [])

    const handleSwitchHighglight = () => {
        setHighlight(prev => !prev);
    }

    return (
        <Grid id={isLastMessage ? 'lastMessage' : 'message'} item xs={12} className={classes.item} style={{ backgroundColor: author === 'Katophrane' ? 'rgba(0, 128, 128, .2)' : isMineMessage ? 'rgba(255, 140, 0, .2)' : 'rgba(138, 43, 226, .2)' }}>
            <div>
                <Typography variant="body2" style={{ color: 'gray', fontWeight: 'bold', fontSize: '.6rem' }}>{`${author}`}</Typography>
                <Typography variant="body2" style={{ color: 'gray', fontSize: '.6rem' }}>{`${created && created.toLocaleString('en-US', { hour12: false })}`}</Typography>
            </div>
            <Typography>{value}</Typography>
            <img src={`/assets/cards/${cardId}.png`} style={{ width: '5rem', borderRadius: '.3rem', }} onClick={handleSwitchHighglight} />
            {
                highlight && (
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
                        >
                        </Paper>
                </div>
                )
            }
        </Grid>                            
    )
}

function ChatMessageItem({ isLastMessage, author, isMineMessage, value, timestamp }) {
    const classes = useStyles();
    const [created, setCreated] = useState(null);

    useEffect(() => {
        const date = new Date();
        date.setTime(timestamp);
        setCreated(date);
    }, [])

    return (
        <Grid id={isLastMessage ? 'lastMessage' : 'message'} item xs={12} className={classes.item} style={{ backgroundColor: author === 'Katophrane' ? 'rgba(0, 128, 128, .2)' : isMineMessage ? 'rgba(255, 140, 0, .2)' : 'rgba(138, 43, 226, .2)' }}>
            <div>
                <Typography variant="body2" style={{ color: 'gray', fontWeight: 'bold', fontSize: '.6rem' }}>{`${author}`}</Typography>
                <Typography variant="body2" style={{ color: 'gray', fontSize: '.6rem' }}>{`${created && created.toLocaleString('en-US', { hour12: false })}`}</Typography>
            </div>
            <Typography>{value}</Typography>
        </Grid>                            
    )
}

function Messenger({ roomId, state }) {
    const classes = useStyles();
    const myself = useAuthUser();
    const containerRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        console.log('ONLOADED', state.players);
        const unsubscribe = firebase.setMessagesListener(roomId, doc => {
            if(doc.exists) {
                console.log(doc.data());
                setMessages(Object.entries(doc.data()).map(([id, v]) => ({...v, id: id })));
                const lastMessage = document.getElementById('lastMessage');
                if(lastMessage) {
                    lastMessage.scrollIntoView();
                }
            }
        });

        return () => {
            unsubscribe();
            console.log('UNLOADED');
        };
    }, []);

    return (
        <div>
            <Grid ref={containerRef} container spacing={0} className={classes.root}>
                {
                    messages.length > 0 && messages.map((m, i, arr) => {
                        if (m.type === 'INFO' && m.subtype && m.subtype.includes('CARD')) {
                            return <CardMessageItem
                                        key={m.id} 
                                        timestamp={m.id}
                                        isLastMessage={arr.length - 1 === i} 
                                        author={m.author === 'Katophrane' ? m.author : Boolean(state[m.author]) ? state[m.author].name : m.author}
                                        isMineMessage={m.author === myself.uid}
                                        cardId={m.cardId}
                                        value={m.value} />
                        }

                        if(m.type === 'CHAT' || m.type === 'INFO') {
                            return <ChatMessageItem 
                                    key={m.id} 
                                    timestamp={m.id}
                                    isLastMessage={arr.length - 1 === i} 
                                    author={m.author === 'Katophrane' ? m.author : Boolean(state[m.author]) ? state[m.author].name : m.author}
                                    isMineMessage={m.author === myself.uid}
                                    value={m.value} />
                                // <Grid id={arr.length - 1 === i ? 'lastMessage' : 'message'} item xs={12} key={m.created} className={classes.item} style={{ backgroundColor: m.author === 'Katophrane' ? 'rgba(0, 128, 128, .2)' : m.author === myself.uid ? 'rgba(255, 140, 0, .2)' : 'rgba(138, 43, 226, .2)' }}>
                                //     <div>
                                //         <Typography variant="body2">{`${}`}</Typography>
                                //     </div>
                                //     <Typography>{m.value}</Typography>
                                // </Grid>                            
                            
                        } 

                        if(m.type === 'DICE_ROLL') {
                            return <DiceRollMessage 
                                key={m.created}
                                timestamp={m.id}
                                id={arr.length - 1 === i ? 'lastMessage' : 'message'}
                                author={`${m.author === 'Katophrane' ? m.author : Boolean(state[m.author]) ? state[m.author].name : m.author}:`} 
                                value={m.value}
                                type={m.subtype} />
                        }
                    })
                }
            </Grid>
        </div>
    )
}

export default Messenger;