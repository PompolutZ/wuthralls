import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SendMessageAction from './SendMessageAction';
import DiceTray from '../../components/DiceTray';
import RollDiceAction from './RollDiceAction';

const actions = [
    {
        type: 'SEND_MESSAGE',
        value: 'Send Message',
    },
    {
        type: 'ROLL_DICE',
        value: 'Roll dice',
    }
]

export default function ActionsPalette({ roomId, }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedAction, setSelectedAction] = useState(actions[0].type);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleItemSelect = type => () => {
        setSelectedAction(type);
        setAnchorEl(null);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div
            style={{
                position: 'fixed',
                display: 'flex',
                alignItems: 'flex-end',
                bottom: 0,
                right: 0,
                width: '100%',
                minHeight: '4rem',
                backgroundColor: 'lightgray',
            }}
        >
            <ButtonBase onClick={handleClick} style={
                { 
                    padding: 0, 
                    width: '3rem', 
                    height: '3rem', 
                    backgroundColor: 'teal', 
                    right: 0,
                    borderRadius: '1.5rem', position: 'absolute', top: '-1.8rem',
                    transform: anchorEl ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform .2s ease-in-out' }}>
                <AddCircleIcon style={{ width: '3rem', height: '3rem', color: 'white' }} />
            </ButtonBase>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {
                    actions.map(action => (
                        <MenuItem key={action.type} onClick={handleItemSelect(action.type)}>{action.value}</MenuItem>
                    ))
                }
            </Menu>
            {
                selectedAction === 'SEND_MESSAGE' && (
                    <SendMessageAction roomId={roomId} />
                )
            }
            {
                selectedAction === 'ROLL_DICE' && (
                    <RollDiceAction roomId={roomId} defaultAmount={4} />
                )
            }
        </div>
    );
}
