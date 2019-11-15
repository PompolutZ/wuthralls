import React, { useEffect, useContext, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import RestoreIcon from '@material-ui/icons/Restore';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../firebase';
import Fade from '@material-ui/core/Fade';
import Messenger from './Messager';
import RoomActionMaker from './RoomActionMaker';
import ActionsPalette from './ActionsPalette';
import Board from './Board';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import DrawCardsIcon from '@material-ui/icons/GetApp';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useAuthUser } from '../../components/Session';
import { Typography } from '@material-ui/core';
import { cardsDb } from '../../data/index';

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

export default function CardsHUD({
    roomId,
    objectivesPile,
    powerCardsPile,
    serverHand,
    onClose,
}) {
    const myself = useAuthUser();
    const [objectiveDrawPile, setObjectiveDrawPile] = useState(objectivesPile);
    const [powersDrawPile, setPowersDrawPile] = useState(powerCardsPile);
    const [hand, setHand] = useState(serverHand || []);
    const firebase = useContext(FirebaseContext);
    const [highlightCard, setHighlightCard] = useState(null);

    useEffect(() => {
        firebase.updateBoardProperty(
            roomId,
            `${myself.uid}.hand`,
            hand.map(x => x.id).join()
        );
    }, [hand]);

    useEffect(() => {
        firebase.updateBoardProperty(
            roomId,
            `${myself.uid}.oDeck`,
            objectiveDrawPile.map(x => x.id).join()
        );
    }, [objectiveDrawPile]);

    useEffect(() => {
        firebase.updateBoardProperty(
            roomId,
            `${myself.uid}.pDeck`,
            powersDrawPile.map(x => x.id).join()
        );
    }, [powersDrawPile]);

    const drawObjectiveCard = async () => {
        const objectives = objectiveDrawPile.slice(0, 1);
        if (!hand) {
            setHand(objectives);
        } else {
            setHand(prev => [...prev, ...objectives]);
        }
        setObjectiveDrawPile(prev => prev.slice(1));
    };

    const drawPowerCard = () => {
        const powers = powersDrawPile.slice(0, 1);
        if (!hand) {
            setHand(powers);
        } else {
            setHand(prev => [...prev, ...powers]);
        }
        setPowersDrawPile(prev => prev.slice(1));
    };

    const handleHighlightCard = cardId => () => {
        setHighlightCard(cardId);
    };

    const handleClickAwayHightlight = e => {
        setHighlightCard(null);
        e.preventDefault();
    };

    const handleClose = () => {
        onClose(false);
    }

    return (
        <div
            style={{
                position: 'fixed',
                width: '90%',
                height: '90%',
                top: '5%',
                left: '5%',
                zIndex: 100001,
            }}
        >
            <ButtonBase
                style={{
                    position: 'absolute',
                    top: '0%',
                    right: '0%',
                    marginRight: '-1rem',
                    backgroundColor: 'red',
                    color: 'white',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '1.5rem',
                }}
                onClick={handleClose}
            >
                <AddIcon
                    style={{
                        width: '1rem',
                        height: '1rem',
                        transform: 'rotate(45deg)',
                    }}
                />
            </ButtonBase>

            <Grid container>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6} style={{ display: 'flex' }}>
                            <Paper
                                elevation={3}
                                style={{
                                    position: 'relative',
                                    backgroundImage:
                                        'url(/assets/cards/objectives_back.png)',
                                    backgroundSize: 'cover',
                                    width: cardDefaultWidth * 0.4,
                                    height: cardDefaultHeight * 0.4,
                                    margin: 'auto',
                                }}
                            >
                                <Paper
                                    elevation={3}
                                    style={{
                                        position: 'absolute',
                                        zIndex: -1,
                                        top: '.2rem',
                                        left: '.2rem',
                                        backgroundImage:
                                            'url(/assets/cards/objectives_back.png)',
                                        backgroundSize: 'cover',
                                        width: cardDefaultWidth * 0.4,
                                        height: cardDefaultHeight * 0.4,
                                        margin: 'auto',
                                    }}
                                />
                                <Paper
                                    elevation={5}
                                    style={{
                                        position: 'absolute',
                                        zIndex: -2,
                                        top: '.4rem',
                                        left: '.4rem',
                                        backgroundImage:
                                            'url(/assets/cards/objectives_back.png)',
                                        backgroundSize: 'cover',
                                        width: cardDefaultWidth * 0.4,
                                        height: cardDefaultHeight * 0.4,
                                        margin: 'auto',
                                    }}
                                />
                                <ButtonBase
                                    style={{
                                        position: 'absolute',
                                        bottom: '0%',
                                        left: '50%',
                                        marginLeft: '-1.5rem',
                                        backgroundColor: 'teal',
                                        color: 'white',
                                        width: '3rem',
                                        height: '3rem',
                                        borderRadius: '1.5rem',
                                    }}
                                    onClick={drawObjectiveCard}
                                >
                                    <DrawCardsIcon
                                        style={{
                                            width: '2rem',
                                            height: '2rem',
                                        }}
                                    />
                                </ButtonBase>
                                <Paper
                                    elevation={3}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 1,
                                        top: '0%',
                                        left: '0%',
                                        backgroundColor: 'goldenrod',
                                        width: '3rem',
                                        height: '3rem',
                                        display: 'flex',
                                        borderRadius: '1.5rem',
                                        color: 'white',
                                    }}
                                >
                                    <Typography
                                        style={{
                                            margin: 'auto',
                                            fontSize: '1.5rem',
                                        }}
                                    >
                                        {objectiveDrawPile &&
                                            objectiveDrawPile.length}
                                    </Typography>
                                </Paper>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} style={{ display: 'flex' }}>
                            <Paper
                                elevation={3}
                                style={{
                                    position: 'relative',
                                    backgroundImage:
                                        'url(/assets/cards/powers_back.png)',
                                    backgroundSize: 'cover',
                                    width: cardDefaultWidth * 0.4,
                                    height: cardDefaultHeight * 0.4,
                                    margin: 'auto',
                                }}
                            >
                                <Paper
                                    elevation={3}
                                    style={{
                                        position: 'absolute',
                                        zIndex: -1,
                                        top: '.2rem',
                                        left: '.2rem',
                                        backgroundImage:
                                            'url(/assets/cards/powers_back.png)',
                                        backgroundSize: 'cover',
                                        width: cardDefaultWidth * 0.4,
                                        height: cardDefaultHeight * 0.4,
                                        margin: 'auto',
                                    }}
                                />
                                <Paper
                                    elevation={5}
                                    style={{
                                        position: 'absolute',
                                        zIndex: -2,
                                        top: '.4rem',
                                        left: '.4rem',
                                        backgroundImage:
                                            'url(/assets/cards/powers_back.png)',
                                        backgroundSize: 'cover',
                                        width: cardDefaultWidth * 0.4,
                                        height: cardDefaultHeight * 0.4,
                                        margin: 'auto',
                                    }}
                                />
                                <ButtonBase
                                    style={{
                                        position: 'absolute',
                                        bottom: '0%',
                                        left: '50%',
                                        marginLeft: '-1.5rem',
                                        backgroundColor: 'teal',
                                        color: 'white',
                                        width: '3rem',
                                        height: '3rem',
                                        borderRadius: '1.5rem',
                                    }}
                                    onClick={drawPowerCard}
                                >
                                    <DrawCardsIcon
                                        style={{
                                            width: '2rem',
                                            height: '2rem',
                                        }}
                                    />
                                </ButtonBase>

                                <Paper
                                    elevation={3}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 1,
                                        top: '0%',
                                        left: '0%',
                                        backgroundColor: 'goldenrod',
                                        width: '3rem',
                                        height: '3rem',
                                        display: 'flex',
                                        borderRadius: '1.5rem',
                                        color: 'white',
                                    }}
                                >
                                    <Typography
                                        style={{
                                            margin: 'auto',
                                            fontSize: '1.5rem',
                                        }}
                                    >
                                        {powersDrawPile &&
                                            powersDrawPile.length}
                                    </Typography>
                                </Paper>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography style={{ marginTop: '1rem' }}>
                        Objectives{' '}
                        {`(${
                            hand && hand.length > 0
                                ? hand.filter(c => c.type === 0).length
                                : 'empty'
                        })`}
                    </Typography>
                    <Divider />
                    <Grid container>
                        <div
                            style={{
                                display: 'flex',
                                width: '100%',
                                overflowX: 'scroll',
                            }}
                        >
                            {hand &&
                                hand.length > 0 &&
                                hand
                                    .filter(c => c.type === 0)
                                    .map((card, idx, arr) => (
                                        <Paper
                                            key={card.id}
                                            style={{
                                                flexShrink: 0,
                                                width: cardDefaultWidth * 0.4,
                                                height: cardDefaultHeight * 0.4,
                                                margin: `1rem ${
                                                    idx === arr.length - 1
                                                        ? '1rem'
                                                        : '.3rem'
                                                } 0 ${
                                                    idx === 0 ? '1rem' : '0'
                                                }`,
                                                borderRadius: '1rem',
                                                backgroundPosition:
                                                    'center center',
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundImage: `url(/assets/cards/${card.id}.png)`,
                                            }}
                                            elevation={10}
                                            onClick={handleHighlightCard(
                                                card.id
                                            )}
                                        />
                                    ))}
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography style={{ marginTop: '1rem' }}>
                        Power cards{' '}
                        {`(${
                            hand && hand.length > 0
                                ? hand.filter(c => c.type !== 0).length
                                : 'empty'
                        })`}
                    </Typography>
                    <Divider />
                    <Grid container>
                        <div
                            style={{
                                display: 'flex',
                                width: '100%',
                                overflowX: 'scroll',
                            }}
                        >
                            {hand &&
                                hand.length > 0 &&
                                hand
                                    .filter(c => c.type !== 0)
                                    .map((card, idx, arr) => (
                                        <Paper
                                            key={card.id}
                                            style={{
                                                flexShrink: 0,
                                                width: cardDefaultWidth * 0.4,
                                                height: cardDefaultHeight * 0.4,
                                                margin: `1rem ${
                                                    idx === arr.length - 1
                                                        ? '1rem'
                                                        : '.3rem'
                                                } 0 ${
                                                    idx === 0 ? '1rem' : '0'
                                                }`,
                                                borderRadius: '1rem',
                                                // border: '3px dashed black',
                                                // boxSizing: 'border-box',
                                                backgroundPosition:
                                                    'center center',
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundImage: `url(/assets/cards/${card.id}.png)`,
                                            }}
                                            elevation={10}
                                            onClick={handleHighlightCard(
                                                card.id
                                            )}
                                        />
                                    ))}
                        </div>
                    </Grid>
                </Grid>
            </Grid>
            {highlightCard && (
                <div
                    style={{
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        top: '0',
                        left: '0',
                        display: 'flex',
                        zIndex: 10000,
                        perspective: '5rem',
                        backgroundColor: 'rgba(255,255,255,.5)',
                    }}
                >
                    <ClickAwayListener onClickAway={handleClickAwayHightlight}>
                        <Paper
                            style={{
                                flexShrink: 0,
                                width: cardDefaultWidth * 0.8,
                                height: cardDefaultHeight * 0.8,
                                margin: 'auto',
                                borderRadius: '1rem',
                                // border: '3px dashed black',
                                // boxSizing: 'border-box',
                                backgroundPosition: 'center center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundImage: `url(/assets/cards/${highlightCard}.png)`,
                            }}
                            elevation={10}
                        />
                    </ClickAwayListener>
                    {/* <ButtonBase
                            style={{
                                position: 'absolute',
                                top: '50%',
                                right: 0,
                                marginRight: '1.5rem',
                                backgroundColor: 'teal',
                                color: 'white',
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '1.5rem',
                            }}
                            onClick={handleMoverSelectionToRight}
                        >
                            <AddIcon
                                style={{ width: '2rem', height: '2rem' }}
                            />
                        </ButtonBase>
                        <ButtonBase
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: 0,
                                marginLeft: '1.5rem',
                                backgroundColor: 'teal',
                                color: 'white',
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '1.5rem',
                            }}
                            onClick={handleMoveSelectionToLeft}
                        >
                            <RemoveIcon
                                style={{ width: '2rem', height: '2rem' }}
                            />
                        </ButtonBase>
                        <ButtonBase
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                marginLeft: '-2.5rem',
                                backgroundColor: 'green',
                                color: 'white',
                                width: '5rem',
                                height: '5rem',
                                borderRadius: '2.5rem',
                            }}
                            onClick={selectUpgrade(
                                availableUpgrades[currentIndex]
                            )}
                        >
                            <DoneIcon
                                style={{ width: '4rem', height: '4rem' }}
                            />
                        </ButtonBase> */}
                </div>
            )}
        </div>
    );
}
