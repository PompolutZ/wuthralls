import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SendMessageAction from './SendMessageAction';
import DiceTray from '../../components/DiceTray';
import RollDiceAction from './RollDiceAction';
import LethalHexesPile from './LethalHexesPile';
import ObjectiveHexesPile from './ObjectiveHexesPile';

const actions = [
    {
        type: 'SEND_MESSAGE',
        value: 'Send Message',
    },
    {
        type: 'ROLL_DICE',
        value: 'Roll dice',
    },
    {
        type: 'PLACE_LETHAL_HEX',
        value: 'Place Lethal Hex'
    },
    {
        type: 'PLACE_FEATURE_HEX',
        value: 'Place Feature Hex'
    },
]

export default function ActionsPalette({ data, onSelectedElementChange }) {
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
                zIndex: 10000,
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
                    <SendMessageAction roomId={data.id} />
                )
            }
            {
                selectedAction === 'ROLL_DICE' && (
                    <RollDiceAction roomId={data.id} defaultAmount={4} />
                )
            }
            {
                selectedAction === 'PLACE_LETHAL_HEX' && (
                    <LethalHexesPile onSelectedTokenChange={onSelectedElementChange} tokens={Object.entries(data.board.tokens).map(([id, value]) => ({...value, id: id})).filter(token => token.id.startsWith('Lethal'))} />
                )
            }
            {
                selectedAction === 'PLACE_FEATURE_HEX' && (
                    <ObjectiveHexesPile onSelectedTokenChange={onSelectedElementChange} tokens={Object.entries(data.board.tokens).map(([id, value]) => ({...value, id: id})).filter(token => token.id.startsWith('Feature'))} />
                )
            }
        </div>
    );
}
