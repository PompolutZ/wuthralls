import React, { useEffect, useContext, useState, useRef } from 'react';
import { FirebaseContext } from '../../firebase';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import { useAuthUser } from '../../components/Session';
import SplitButton from './SplitButton';
import Die from '../../components/Die';


const useStyles = makeStyles(theme => ({
    item: {
        margin: '.5rem 1rem .5rem .5rem',
        padding: '.3rem',
        borderRadius: '.3rem'
    },

    root: {
        flexGrow: 1,
        marginBottom: '5rem',
    }
}));

function DiceRollMessage({ id, author, value }) {
    const classes = useStyles();

    return (
            <Grid id={id} item xs={12} className={classes.item} style={{ backgroundColor: 'rgba(30,144,255,.2)' }}>
            <Typography variant="body2">{author}</Typography>
            <div>
                {
                    value.split(',').map((x, i) => (
                        <Die
                            key={i}
                            side={x}
                            type="ATTACK"
                            style={{
                                width: '2rem',
                                height: '2rem',
                                marginRight: '.2rem',
                            }}
                        />
                    ))    
                }                
            </div>
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
                setMessages(Object.values(doc.data()));
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
                        if(m.type === 'CHAT' || m.type === 'INFO') {
                            return (
                                <Grid id={arr.length - 1 === i ? 'lastMessage' : 'message'} item xs={12} key={m.created} className={classes.item} style={{ backgroundColor: m.author === 'Katophrane' ? 'rgba(0, 128, 128, .2)' : m.author === myself.uid ? 'rgba(255, 140, 0, .2)' : 'rgba(138, 43, 226, .2)' }}>
                                    <div>
                                        <Typography variant="body2">{`${m.author === 'Katophrane' ? m.author : Boolean(state[m.author]) ? state[m.author].name : m.author}:`}</Typography>
                                    </div>
                                    <Typography>{m.value}</Typography>
                                </Grid>                            
                            )
                        } 

                        if(m.type === 'DICE_ROLL') {
                            return <DiceRollMessage 
                                key={m.created}
                                id={arr.length - 1 === i ? 'lastMessage' : 'message'}
                                author={`${m.author === 'Katophrane' ? m.author : Boolean(state[m.author]) ? state[m.author].name : m.author}:`} 
                                value={m.value} />
                        }
                    })
                }
            </Grid>
        </div>
    )
}

export default Messenger;