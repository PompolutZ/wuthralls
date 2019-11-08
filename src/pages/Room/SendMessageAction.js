import React, { useState, useContext } from 'react';
import { useAuthUser } from '../../components/Session';
import { FirebaseContext } from '../../firebase';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

export default function SendMessageAction({ roomId, }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [currentMessage, setCurrentMessage] = useState('');

    const handleTyping = e => {
        setCurrentMessage(e.target.value);
    }

    const handleSendTextMessage = async () => {
        if(currentMessage.length <= 0) return;

        const copy = currentMessage;
        setCurrentMessage('');
        await firebase.addMessage(roomId, {
            uid: myself.uid,
            value: copy
        });
    }

    return (
        <div style={{ 
            width: '100%', 
            display: 'flex',
            alignItems: 'flex-end',
            marginBottom: '.5rem'}}>
                        <TextField 
                            multiline 
                            placeholder="type here what you want to say..."
                            style={{ flex: 1, margin: 'auto 1rem' }}
                            value={currentMessage}
                            onChange={handleTyping}
                            rowsMax={3} />
        <Button onClick={handleSendTextMessage}>
            <SendIcon />
        </Button>
    </div>

    )
}
