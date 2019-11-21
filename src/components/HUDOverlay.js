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
            <ButtonBase style={{
                    position: 'absolute', 
                    bottom: '0%',
                    right: '0%',
                    marginRight: '2rem',
                    marginBottom: '2rem',
                    backgroundColor: 'red',
                    color: 'white',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '1.5rem',
                    boxShadow: '3px 3px 3px 0px black',
                    boxSizing: 'border-box',
                    border: '2px solid white',
                    borderRadius: '1.5rem',
             }}
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