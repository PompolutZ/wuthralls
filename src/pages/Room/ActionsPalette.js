import React, { useState, useRef } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FightersIcon from '@material-ui/icons/SportsKabaddi';
import SendMessageAction from './SendMessageAction';
import DiceTray from '../../components/DiceTray';
import RollDiceAction from './RollDiceAction';
import LethalHexesPile from './LethalHexesPile';
import ObjectiveHexesPile from './ObjectiveHexesPile';
import Warband from './Warband';
import { useAuthUser } from '../../components/Session';

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
        value: 'Place Lethal Hex',
    },
    {
        type: 'PLACE_FEATURE_HEX',
        value: 'Place Feature Hex',
    },
    // {
    //     type: 'FIGHTERS',
    //     value: 'Fighters',
    // },
];

export default function ActionsPalette({
    data,
    onSelectedElementChange,
    onActionTypeChange,
    onOpenDeckHUD
}) {
    const myself = useAuthUser();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedAction, setSelectedAction] = useState(actions[0].type);
    const actionsRootRef = useRef(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleItemSelect = type => () => {
        setSelectedAction(type);
        setAnchorEl(null);
        console.log('HERE', actionsRootRef.current.offsetHeight);
        onActionTypeChange(actionsRootRef.current.offsetHeight);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFightersClick = () => {
        setSelectedAction('FIGHTERS');
    }

    return (
        <div
            ref={actionsRootRef}
            style={{
                position: 'fixed',
                display: 'flex',
                alignItems: 'flex-end',
                bottom: 0,
                right: 0,
                width: '100%',
                minHeight: 95 * 1.2,
                zIndex: 10000,
                backgroundColor: 'lightgray',
            }}
        >
            <ButtonBase
                onClick={handleClick}
                style={{
                    padding: 0,
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'teal',
                    right: 0,
                    borderRadius: '1.5rem',
                    position: 'absolute',
                    top: '-1.8rem',
                    transform: anchorEl ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform .2s ease-in-out',
                }}
            >
                <AddCircleIcon
                    style={{ width: '3rem', height: '3rem', color: 'white' }}
                />
            </ButtonBase>

            <ButtonBase
                onClick={onOpenDeckHUD}
                style={{
                    padding: 0,
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'teal',
                    right: '4rem',
                    borderRadius: '1.5rem',
                    position: 'absolute',
                    top: '-1.8rem',
                    boxSizing: 'border-box',
                    boxShadow: '0 0 5px 5px darkgrey'
                }}
            >
                <svg
                    width="40"
                    height="31"
                    viewBox="0 0 40 31"
                    fill="none"
                    style={{ width: '2rem', height: '2rem' }}
                >
                    <path
                        d="M17.4313 0H17.4381L22.9498 0.0106234C22.9529 0.00725778 22.9562 0.00567981 22.9582 0.00389181C22 0.665979 21.2461 1.63413 20.8521 2.80832L14.3475 22.1917C14.3174 22.2795 14.2921 22.3656 14.2666 22.4528L14.3037 3.18717C14.3072 1.4242 15.7077 0 17.4313 0ZM1.0859 15.5037C-0.223877 14.3516 -0.368423 12.3326 0.759228 10.9978L3.83662 7.35364C3.88037 7.49311 3.92567 7.63247 3.97962 7.76846L10.2806 23.6102L1.0859 15.5037ZM11.9874 3.18486L11.952 21.5261L6.12569 6.8774C5.47595 5.24348 6.24367 3.37943 7.84265 2.71388L12.5428 0.762006C12.1929 1.49488 11.9908 2.31673 11.9874 3.18486ZM39.8307 9.4536L33.326 28.8365C32.8816 30.1639 31.6661 31 30.3665 31C30.0299 31 29.6901 30.9432 29.3531 30.8245L18.4817 27.019C16.8489 26.448 15.9768 24.6283 16.5394 22.9587L23.0437 3.57548C23.4881 2.24952 24.7036 1.41505 26.003 1.41505C26.3367 1.41505 26.6798 1.47079 27.0164 1.58912L37.8844 5.39504C39.5207 5.96773 40.3894 7.7835 39.8307 9.4536Z"
                        fill="white"
                    />
                </svg>
            </ButtonBase>

            <ButtonBase
                onClick={handleFightersClick}
                style={{
                    padding: 0,
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'teal',
                    right: '8rem',
                    borderRadius: '1.5rem',
                    position: 'absolute',
                    top: '-1.8rem',
                    boxSizing: 'border-box',
                    boxShadow: '0 0 5px 5px darkgrey',
                    color: 'white'
                }}
            >
                <FightersIcon />
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
                {actions.map(action => (
                    <MenuItem
                        key={action.type}
                        onClick={handleItemSelect(action.type)}
                    >
                        {action.value}
                    </MenuItem>
                ))}
            </Menu>
            {selectedAction === 'SEND_MESSAGE' && (
                <SendMessageAction roomId={data.id} />
            )}
            {selectedAction === 'ROLL_DICE' && (
                <RollDiceAction roomId={data.id} defaultAmount={4} />
            )}
            {selectedAction === 'PLACE_LETHAL_HEX' && (
                <LethalHexesPile
                    onSelectedTokenChange={onSelectedElementChange}
                    tokens={Object.entries(data.board.tokens)
                        .map(([id, value]) => ({ ...value, id: id }))
                        .filter(token => token.id.startsWith('Lethal'))}
                />
            )}
            {selectedAction === 'PLACE_FEATURE_HEX' && (
                <ObjectiveHexesPile
                    onSelectedTokenChange={onSelectedElementChange}
                    tokens={Object.entries(data.board.tokens)
                        .map(([id, value]) => ({ ...value, id: id }))
                        .filter(token => token.id.startsWith('Feature'))}
                />
            )}
            {selectedAction === 'FIGHTERS' && (
                <Warband
                    onSelectedFighterChange={onSelectedElementChange}
                    myfighters={Object.entries(data.board.fighters)
                        .map(([id, value]) => ({ ...value, id: id }))
                        .filter(token => token.id.startsWith(myself.uid))}
                    enemyFighters={Object.entries(data.board.fighters)
                        .map(([id, value]) => ({ ...value, id: id }))
                        .filter(token => !token.id.startsWith(myself.uid))}
                />
            )}
        </div>
    );
}
