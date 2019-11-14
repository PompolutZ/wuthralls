import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import InspireIcon from '@material-ui/icons/TrendingUp';
import UninspireIcon from '@material-ui/icons/TrendingDown';
import DoneIcon from '@material-ui/icons/Done';
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

function WoundsCounter({ wounds, onWoundsCounterChange }) {
    const [value, setValue] = useState(wounds);

    useEffect(() => {
        onWoundsCounterChange(value);
    }, [value]);

    const handleChangeValue = changeBy => () => {
        setValue(prev => {
            const nextValue = prev + changeBy;
            return nextValue >= 0 ? nextValue : 0;
        })
    }

    return (
        <div style={{ display: 'flex', position: 'absolute', top: '.3rem', left: '-2.5rem', alignItems: 'flex-end' }}>
            <ButtonBase onClick={handleChangeValue(-1)} style={{ backgroundColor: 'green', width: '3rem', height: '3rem', borderRadius: '1.5rem', border: '3px solid white', color: 'white', boxSizing: 'border-box' }}>
                <RemoveIcon />
            </ButtonBase>
            <div style={{ display: 'flex', backgroundImage: 'url(/assets/other/woundToken.png)', backgroundPosition: 'center, center', backgroundSize: 'cover', width: '4rem', height: '4rem', borderRadius: '2rem', border: '2px solid white', }}>
                <div style={{ margin: 'auto', color: 'white', fontSize: '1.5rem' }}>
                    { value }
                </div>
            </div>
            <ButtonBase onClick={handleChangeValue(1)} style={{ backgroundColor: 'red', width: '3rem', height: '3rem', borderRadius: '1.5rem', border: '3px solid white', color: 'white', boxSizing: 'border-box' }}>
                <AddIcon />
            </ButtonBase>
        </div>
    )
}

function UpgradePicker({ availableUpgrades, onUpgradePickerOpen, isOpen, onUpgradeSelected }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [canMoveRight, setCanMoveRight] = useState(currentIndex < availableUpgrades.length);
    const [canMoveLeft, setCanMoveLeft] = useState(currentIndex > 0);

    const handleClickAway = () => {
        onUpgradePickerOpen(false);
    }

    const handleClickAdd = () => {
        console.log('HEre')
    }

    const handleMoverSelectionToRight = () => {
        console.log(availableUpgrades);
        if(currentIndex < availableUpgrades.length -1) {
            setCurrentIndex(prev => prev + 1);
        }
    }

    const handleMoveSelectionToLeft = () => {
        if(currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }

    const selectUpgrade = cardId => () => {
        onUpgradeSelected(cardId);
        onUpgradePickerOpen(false);
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div style={{  }}>
                {
                    isOpen ? (
                            <div style={{
                                position: 'fixed',
                                width: cardImageWidth * 1.2,
                                height: cardImageHeight * 1.2,
                                top: '50%',
                                left: '50%',
                                marginTop: -cardImageHeight * 1.2 / 2,
                                marginLeft: -cardImageWidth * 1.2 / 2,
                                display: 'flex',
                                zIndex: 10000
                            }}>
                                <Paper style={{ 
                                    flexShrink: 0,
                                    width: cardImageWidth * .8, 
                                    height: cardImageHeight * .8, 
                                    margin: 'auto',
                                    borderRadius: '1rem',
                                    // border: '3px dashed black', 
                                    // boxSizing: 'border-box', 
                                    backgroundPosition: 'center center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundImage: `url(/assets/cards/${availableUpgrades[currentIndex]}.png)`
                                }} elevation={10} />
                                <ButtonBase style={{ position: 'absolute', top: '50%', right: 0, marginRight: '1.5rem', backgroundColor: 'teal', color: 'white', width: '3rem', height: '3rem', borderRadius: '1.5rem' }}
                                    onClick={handleMoverSelectionToRight}>
                                    <AddIcon style={{ width: '2rem', height: '2rem' }} />
                                </ButtonBase>
                                <ButtonBase style={{ position: 'absolute', top: '50%', left: 0, marginLeft: '1.5rem', backgroundColor: 'teal', color: 'white', width: '3rem', height: '3rem', borderRadius: '1.5rem' }}
                                    onClick={handleMoveSelectionToLeft}>
                                    <RemoveIcon style={{ width: '2rem', height: '2rem' }} />
                                </ButtonBase>
                                <ButtonBase style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: '-2.5rem', backgroundColor: 'green', color: 'white', width: '5rem', height: '5rem', borderRadius: '2.5rem' }}
                                    onClick={selectUpgrade(availableUpgrades[currentIndex])}>
                                    <DoneIcon style={{ width: '4rem', height: '4rem' }} />
                                </ButtonBase>
                            </div>
                    ) : null
                }
            </div>
        </ClickAwayListener>
    )
}

export default function FighterHUD({ data, unspentGlory, availableUpgrades, onUpdateFighter }) {
    const [upgrades, setUpgrades] = useState(Object.keys(data.upgrades));
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [upgradePickerOpen, setUpgradePickerOpen] = useState(false);

    useEffect(() => {
        setUpgrades(Object.keys(data.upgrades));
    }, [data])

    const handleBringToFront = id => () => {
        setSelectedCardId(id);
    }

    const handleCloseSelection = () => {
        setSelectedCardId(null);
    }

    const openUpgradePicker = () => {
        setUpgradePickerOpen(true);
    }

    const handleUpgradeFighter = cardId => {
        console.log(cardId)
        onUpdateFighter('APPLY_UPGRADE', {
            property: 'upgrades',
            value: [...upgrades, cardId].reduce((r, x) => ({...r, [x]: true}), {}),
            appliedUpgrade: cardId,
        });
    }

    const handleUpdateWounds = value => {
        onUpdateFighter('CHANGE_WOUNDS', {
            property: 'wounds',
            value: value
        });
    }

    const changeInspire = () => {
        onUpdateFighter('CHANGE_INSPIRE', {
            property: 'isInspired',
            value: !data.isInspired
        });
    }

    return (
        <>
            <Grid container spacing={3} direction="column" style={{ filter: selectedCardId || upgradePickerOpen ? 'blur(3px)' : ''}}>
                {/* <Grid item xs={12}>
                    <Grid container justify="center">
                        <Typography>{data.name}</Typography>
                    </Grid>
                </Grid> */}
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <div style={{ position: 'relative' }}>
                            <img src={`/assets/fighters/${data.icon}-card${data.isInspired ? '-ins' : ''}.png`} style={{ width: cardImageWidth, height: cardImageHeight }} />
                            <WoundsCounter wounds={data.wounds} onWoundsCounterChange={handleUpdateWounds} />
                            <ButtonBase style={{ 
                                position: 'absolute', 
                                top: '50%', 
                                marginTop: '-3rem', 
                                left: '-1.5rem', 
                                marginRight: '1.5rem', 
                                backgroundColor: 'teal', 
                                color: 'white', 
                                width: '3rem', 
                                height: '3rem', 
                                borderRadius: '1.5rem', 
                                border: '3px solid white', 
                                boxSizing: 'border-box' 
                            }}
                                onClick={changeInspire}>
                                {
                                    data.isInspired ? <UninspireIcon style={{ width: '2rem', height: '2rem' }} /> : <InspireIcon style={{ width: '2rem', height: '2rem' }} />
                                }
                            </ButtonBase>
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ margin: '0rem 1rem', }}>
                    <Typography>Upgrades</Typography>
                    <Divider />
                    <div style={{ display: 'flex', justifyContent: 'space-between', overflowX: 'scroll', alignItems: 'center', margin: '1rem' }}>
                        {
                            upgrades.length > 0 && upgrades.map(u => (
                                <Paper id={u} key={u} style={{ 
                                    flexShrink: 0,
                                    width: cardImageWidth * 0.3, 
                                    height: cardImageHeight * .3, 
                                    marginRight: '.5rem',
                                    borderRadius: '.5rem',
                                    backgroundPosition: 'center center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundImage: `url(/assets/cards/${u}.png)`
                                }} 
                                elevation={2}
                                onClick={handleBringToFront(u)} />
                            ))
                        }
                        {
                            unspentGlory > 0 && (
                                <div style={{ flexShrink: 0, width: cardImageWidth *.25, height: cardImageHeight *.25, border: '3px dashed black', boxSizing: 'border-box', borderRadius: '.5rem', display: 'flex'}}
                                    onClick={openUpgradePicker}>
                                    <AddIcon style={{ margin: 'auto' }} />
                                </div>
                            )
                        }
                    </div>
                </Grid>
            </Grid>
            {
                    selectedCardId && (
                        <ClickAwayListener onClickAway={handleCloseSelection}>
                            <div style={{
                                position: 'fixed',
                                width: cardImageWidth * 1.2,
                                height: cardImageHeight * 1.2,
                                top: '50%',
                                left: '50%',
                                marginTop: -cardImageHeight * 1.2 / 2,
                                marginLeft: -cardImageWidth * 1.2 / 2,
                                display: 'flex',
                                zIndex: 10000
                            }}>
                                <Paper style={{ 
                                    flexShrink: 0,
                                    width: cardImageWidth * .8, 
                                    height: cardImageHeight * .8, 
                                    margin: 'auto',
                                    borderRadius: '1rem',
                                    // border: '3px dashed black', 
                                    // boxSizing: 'border-box', 
                                    backgroundPosition: 'center center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundImage: `url(/assets/cards/${selectedCardId}.png)`
                                }} elevation={10} onClick={handleCloseSelection} />
                            </div>
                        </ClickAwayListener>
                    )
            }
            {
                upgradePickerOpen && (
                    <UpgradePicker isOpen={upgradePickerOpen} availableUpgrades={availableUpgrades} onUpgradePickerOpen={setUpgradePickerOpen} onUpgradeSelected={handleUpgradeFighter} />
                )
            }
        </>
    )
}