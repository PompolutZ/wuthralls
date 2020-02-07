import React, { useState, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import MessengerScreenIcon from '@material-ui/icons/QuestionAnswer';
import BoardScreenIcon from '@material-ui/icons/ViewStream';
import GameOverviewIcon from '@material-ui/icons/EmojiEvents';
import SendMessageAction from './SendMessageAction';
import RollDiceAction from './RollDiceAction';
import LethalHexesPile from './LethalHexesPile';
import ObjectiveHexesPile from './ObjectiveHexesPile';
import Warband from './Warband';
import { useAuthUser } from '../../../components/Session';
import HUDOverlay from '../../../components/HUDOverlay';
import FighterHUD from '../../../components/FighterHUD';
import GameStatusHUD from './GameStatusHUD';

export default function ScatterToken({ onSelectionChange, orientation }) {
    console.log("SCATTER TOKEN RENDER", orientation);
    const [rotateAngle, setRotateAngle] = useState(orientation === 'horizontal' ? 0 : 30);
    const [isSelected, setIsSelected] = useState(false);
    const [values, setValues] = useState({
        id: 'SCATTER_TOKEN',
        type: 'SCATTER_TOKEN',
        isOnBoard: false,
        rotationAngle: rotateAngle,
        onBoard: {x: -1, y: -1}
    })

    const handleRotateLeft = e => {
        setRotateAngle(rotateAngle - 60);
        const updated = {
            ...values,
            rotationAngle: rotateAngle - 60
        };
        setValues(updated)
        onSelectionChange(updated);

        e.preventDefault();
    }

    const handleRotateRight = e => {
        setRotateAngle(rotateAngle + 60);
        const updated = {
            ...values,
            rotationAngle: rotateAngle + 60
        };
        setValues(updated)
        onSelectionChange(updated);

        e.preventDefault();
    }

    const handleTokenClick = () => {
        if(!isSelected) {
            setIsSelected(true);
            const updated = {
                ...values,
                isOnBoard: true,
            };
            setValues(updated)
            onSelectionChange(updated);
        } else  {
            setIsSelected(false);
            const updated = {
                ...values,
                isOnBoard: false,
            };
            setValues(updated)
            onSelectionChange(updated);
        }
    }

    return (
        <Grid container justify="center" spacing={3}>
            <Grid item xs={4}>
                <div style={{ 
                    position: 'relative',
                    width: '4rem',
                    height: '4rem',
                    paddingBottom: '2rem' }}>
                    <img src={`/assets/other/scatter.png`} style={{ width: '4rem', transform: `rotate(${rotateAngle}deg)`, transformOrigin: 'center center', }} 
                        onClick={handleTokenClick} />
                    <div style={{ width: '2rem', position: 'absolute', height: '2rem', zIndex: -1, top: '50%', left: '50%', marginTop: '-2rem', marginLeft: '-1rem', borderRadius: '1rem', boxShadow: isSelected ? '0 0 30px 15px magenta' : '' }} />
                    <ButtonBase style={{ position: 'absolute', width: '2.5rem', height: '2.5rem', top: '50%', marginTop: '-1rem', left: 0, marginLeft: '-2.25rem', backgroundColor: 'teal', color: 'white', boxSizing: 'border-box', border: '1px solid white', borderRadius: '1rem' }}
                        onClick={handleRotateLeft}>
                        <RotateLeftIcon />
                    </ButtonBase>
                    <ButtonBase style={{ position: 'absolute', width: '2.5rem', height: '2.5rem', top: '50%', marginTop: '-1rem', right: 0, marginRight: '-2.25rem', backgroundColor: 'teal', color: 'white', boxSizing: 'border-box', border: '1px solid white', borderRadius: '1rem'}}
                        onClick={handleRotateRight}>
                        <RotateRightIcon />
                    </ButtonBase>
                </div>
            </Grid>
        </Grid>

    )
}