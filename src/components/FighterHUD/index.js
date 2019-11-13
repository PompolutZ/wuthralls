import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

// [`${myself.uid}_F3`]: {
//     type: 'FIGHTER',
//     icon: 'ironsouls-condemners-f3',
//     name: 'Tavian',
//     from: {x: -1, y: -1},
//     onBoard: {x: -1, y: -1},
//     isOnBoard: false,
//     isInspired: false,
//     wounds: 0,
// },
const cardImageWidth = 300;
const cardImageHeight = 420;

function WoundsCounter({ wounds }) {
    const [value, setValue] = useState(wounds);

    const handleChangeValue = changeBy => () => {
        setValue(prev => {
            const nextValue = prev + changeBy;
            return nextValue >= 0 ? nextValue : 0;
        })
    }
    return (
        <div style={{ display: 'flex', position: 'absolute', top: '5rem', left: '-.65rem', alignItems: 'flex-end' }}>
            <ButtonBase onClick={handleChangeValue(-1)} style={{ backgroundColor: 'green', width: '2rem', height: '2rem', borderRadius: '1.5rem', border: '1px solid white', color: 'white' }}>
                <RemoveIcon />
            </ButtonBase>
            <div style={{ display: 'flex', backgroundImage: 'url(/assets/other/woundToken.png)', backgroundPosition: 'center, center', backgroundSize: '3rem 3rem', width: '3rem', height: '3rem', borderRadius: '1.5rem', border: '2px solid white', }}>
                <div style={{ margin: 'auto', color: 'white', fontSize: '1.5rem' }}>
                    { value }
                </div>
            </div>
            <ButtonBase onClick={handleChangeValue(1)} style={{ backgroundColor: 'red', width: '2rem', height: '2rem', borderRadius: '1.5rem', border: '1px solid white', color: 'white' }}>
                <AddIcon />
            </ButtonBase>
        </div>
    )
}

function UpgradePicker({ availableUpgrades }) {
    const [open, setOpen] = useState(false);

    const handleClickAway = () => {
        setOpen(false);
    }

    const handleClickAdd = () => {
        console.log('HEre')
        setOpen(prev => !prev);
    }
    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div style={{ position: 'relative' }}>
                <div style={{ flexShrink: 0, width: cardImageWidth *.25, height: cardImageHeight *.25, border: '3px dashed black', boxSizing: 'border-box', borderRadius: '.5rem', display: 'flex'}}
                    onClick={handleClickAdd}>
                    <AddIcon style={{ margin: 'auto' }} />
                </div>
                {
                    open ? (
                        <div style={{ position: 'absolute',
                        top: -cardImageHeight / 2,
                        right: 0,
                        left: cardImageWidth *.25 / 2,
                        zIndex: 1000,
                        width: `calc(${cardImageWidth * 2}px + 2rem)`,
                        height: cardImageHeight,
                        border: '1px solid',
                        backgroundColor: 'magenta',
                        display: 'flex',
                        overflowX: 'scroll',
                        alignItems: 'center', }}>
                            <span style={{ marginLeft: '1rem' }}></span>
                            {
                                availableUpgrades.length > 0 && availableUpgrades.map(u => (
                                    <Paper key={u} style={{ 
                                        flexShrink: 0,
                                        width: cardImageWidth * 0.75, 
                                        height: cardImageHeight * .75, 
                                        // border: '3px dashed black', 
                                        // boxSizing: 'border-box', 
                                        borderRadius: '1rem',
                                        backgroundPosition: 'center center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundImage: `url(/assets/cards/${u}.png)`
                                    }} 
                                    elevation={5} />
                                ))
                            }
                            <span style={{ marginRight: '1rem' }}></span>
                        </div>
                    ) : null
                }
            </div>
        </ClickAwayListener>
    )
}

export default function FighterHUD({ data, unspentGlory, availableUpgrades }) {
    const [upgrades, setUpgrades] = useState(Object.keys(data.upgrades));
    const [usedGlory, setUsedGlory] = useState(0);

    return (
        <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
                <Grid container justify="center">
                    <Typography>{data.name}</Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container justify="center">
                    <div style={{ position: 'relative' }}>
                        <img src={`/assets/fighters/${data.icon}.png`} style={{ width: '6rem', height: '6rem' }} />
                        <WoundsCounter wounds={data.wounds} />
                    </div>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{ margin: '0rem 1rem', }}>
                <Typography>Upgrades</Typography>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between', overflowX: 'scroll', alignItems: 'center', height: cardImageHeight}}>
                    {
                        usedGlory < unspentGlory && (
                            <UpgradePicker availableUpgrades={availableUpgrades} />
                        )
                    }
                    {
                        upgrades.length > 0 && upgrades.map(u => (
                            <Paper key={u} style={{ 
                                flexShrink: 0,
                                width: cardImageWidth * 0.75, 
                                height: cardImageHeight * .75, 
                                // border: '3px dashed black', 
                                // boxSizing: 'border-box', 
                                borderRadius: '1rem',
                                backgroundPosition: 'center center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundImage: `url(/assets/cards/${u}.png)`
                            }} 
                            elevation={5} />
                        ))
                    }
                </div>
            </Grid>
        </Grid>
    )
}