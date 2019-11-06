import React, { useEffect, useContext, useState } from 'react';
import { FirebaseContext } from '../../firebase';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import { useAuthUser } from '../../components/Session';


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

function Messager({ roomId, players }) {
    const classes = useStyles();
    const myself = useAuthUser();
    const [messages, setMessages] = useState([]);
    const firebase = useContext(FirebaseContext);
    const [currentMessage, setCurrentMessage] = useState('');

    useEffect(() => {
        console.log('ONLOADED', players);
        const unsubscribe = firebase.setMessagesListener(roomId, doc => {
            console.log(doc.data());
            setMessages(Object.values(doc.data()));
        });

        return () => unsubscribe();
    }, []);

    const handleTyping = e => {
        setCurrentMessage(e.target.value);
    }

    const handleSendTextMessage = async () => {
        const copy = currentMessage;
        setCurrentMessage('');
        await firebase.addMessage(roomId, {
            uid: myself.uid,
            value: copy
        });
    }

    return (
        <>
            <Grid container spacing={0} className={classes.root}>
                {
                    messages.length > 0 && messages.map(m => (
                        <Grid item xs={12} key={m.created} className={classes.item} style={{ backgroundColor: m.author === 'Katophrane' ? 'rgba(0, 128, 128, .2)' : m.author === myself.uid ? 'rgba(255, 140, 0, .2)' : 'rgba(138, 43, 226, .2)' }}>
                            <Typography variant="body2">{`${m.author}:`}</Typography>
                            <Typography>{m.value}</Typography>
                        </Grid>
                    ))
                }
            </Grid>
            <div style={{ position: 'fixed', width: '100%', display: 'flex', bottom: '0%', backgroundColor: 'lightgray' }}>
                <TextField 
                    multiline 
                    style={{ flex: 1 }}
                    value={currentMessage}
                    onChange={handleTyping} />
                <Button onClick={handleSendTextMessage}>
                    <SendIcon />
                </Button>
            </div>
        </>
    )
}

export default Messager;