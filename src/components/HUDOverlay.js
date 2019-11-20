import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

export default function HUDOverlay({ onCloseOverlayClick, children }){
    return (
        <div style={{
            position: 'fixed',
            width: '100%',
            minHeight: 100,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: 'rgba(255,255,255,.9)',
            zIndex: '3000',
            display: 'flex',
            flexFlow: 'column nowrap',
        }}>
            <ButtonBase style={{ backgroundColor: 'red', color: 'white', position: 'absolute', top: 0, right: 0, borderRadius: '1rem', width: '2rem', height: '2rem', boxSizing: 'border-box' }}
                onClick={onCloseOverlayClick}>
                <AddIcon style={{ transform: 'rotate(45deg)'}} />
            </ButtonBase>
            <div style={{ flex: '0 0 auto', height: '3rem', backgroundColor: 'gray' }}></div>
            <div style={{ boxSizing: 'border-box', border: '3px solid gray', padding: '.2rem', flex: '1 0 auto', overflowY: 'scroll' }}>
                { children }
            </div>
            <div style={{ flex: '0 0 auto', height: '3rem', backgroundColor: 'gray' }}></div>
        </div>
    )
}