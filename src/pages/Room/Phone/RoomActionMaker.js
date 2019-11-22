import React, { useState, useContext } from 'react';
import SplitButton from './SplitButton';
import { useAuthUser } from '../../../components/Session';
import { FirebaseContext } from '../../../firebase';
import TextField from '@material-ui/core/TextField';
import DiceTray from '../../../components/DiceTray';

function RoomActionMaker({ roomId, }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const options = ['Send message', 'Dice roll'];
    const [selectedActionIndex, setSelectedActionIndex] = useState(0);
    const [currentMessage, setCurrentMessage] = useState('');

    const handleTyping = e => {
        setCurrentMessage(e.target.value);
    }

    const handleDoAction = async index => {
        switch(options[index]) {
            case 'Send message':
                if(currentMessage.length <= 0) return;

                const copy = currentMessage;
                setCurrentMessage('');
                await firebase.addMessage(roomId, {
                    uid: myself.uid,
                    value: copy
                });
            
        }
    }

    return (
        <div style={{ position: 'fixed', 
            width: '100%',
            left: 0, bottom: 0, right: 0, backgroundColor: 'lightgray' }}>
            <SplitButton options={options} selectedIndex={selectedActionIndex} onClicked={handleDoAction} onSelectedIndexChange={setSelectedActionIndex} />
            {
                selectedActionIndex === 0 && (
                    <div style={{ width: '100%', display: 'flex' }}>
                        <TextField 
                            multiline 
                            placeholder="type here what you want to say..."
                            style={{ flex: 1, margin: 'auto 1rem' }}
                            value={currentMessage}
                            onChange={handleTyping} />
                    </div>
                )
            }
            {
                selectedActionIndex === 1 && (
                    <DiceTray defaultAmount={4} />
                )
            }
        {/* <Button onClick={handleSendTextMessage}>
            <SendIcon />
        </Button> */}
    </div>

    )
}

export default RoomActionMaker;