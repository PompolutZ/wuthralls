import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../../../firebase';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import { useAuthUser } from '../../../../components/Session';

export default function SendMessageOverlay({ roomId }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [currentMessage, setCurrentMessage] = useState('');

    const handleTyping = e => {
        setCurrentMessage(e.target.value);
    };

    const handleSendTextMessage = async () => {
        if (currentMessage.length <= 0) return;

        const copy = currentMessage;
        setCurrentMessage('');
        await firebase.addMessage2(roomId, {
            uid: myself.uid,
            value: copy,
        });
    };

    const handleKeyPress = async e => {
        console.log(e.key);
        if (currentMessage.length <= 0) return;

        if (e.key === 'Enter') {
            const copy = currentMessage;
            setCurrentMessage('');
            await firebase.addMessage2(roomId, {
                uid: myself.uid,
                value: copy,
            });
        }
    };

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                alignSelf: 'flex-end',
                alignItems: 'flex-end',
                marginBottom: '.5rem',
            }}
        >
            <TextField
                multiline
                autoFocus
                onKeyPress={handleKeyPress}
                placeholder="type here what you want to say..."
                style={{ flex: 1, margin: 'auto 1rem' }}
                value={currentMessage}
                onChange={handleTyping}
                rowsMax={3}
            />
            <Button onClick={handleSendTextMessage}>
                <SendIcon />
            </Button>
        </div>
    );
}
