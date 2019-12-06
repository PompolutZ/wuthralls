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
import { FirebaseContext } from '../../../firebase';
import Fade from '@material-ui/core/Fade';
import Messenger from './Messager';
import RoomActionMaker from './RoomActionMaker';
import ActionsPalette from './ActionsPalette';
import Board from './Board_old';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import DrawCardsIcon from '@material-ui/icons/GetApp';
import PlayIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import ReturnToPileIcon from '@material-ui/icons/Eject';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useAuthUser } from '../../../components/Session';
import { Typography } from '@material-ui/core';
import { cardsDb } from '../../../data/index';
import { shuffle } from '../../../common/function';

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const OBJECTIVES_HAND = 'OBJECTIVES_HAND';
const POWERS_HAND = 'POWERS_HAND';
const OBJECTIVES_SCORED = 'OBJECTIVES_SCORED';
const OBJECTIVES_DISCARDED = 'OBJECTIVES_DISCARDED';
const POWERS_DISCARDED = 'POWERS_DISCARDED';

const MY_CARDS_GROUP = 'MY_CARDS_GROUP';
const ENEMY_CARDS_GROUP = 'ENEMY_CARDS_GROUP';

const propertyToCards = (source, property) => {
    return (
        source &&
        source[property] &&
        source[property]
            .split(',')
            .map(cardId => ({ ...cardsDb[cardId], id: cardId }))
    );
};

export default function OpponentPanel({ data, onClose }) {
    const [scoredObjectives, setScoredObjectives] = useState(propertyToCards(data, 'sObjs'));
    const [discardedObjectives, setDiscardedObjectives] = useState(propertyToCards(data, 'dObjs'));
    const [discardedPowers, setDiscardedPowers] = useState(propertyToCards(data, 'dPws'));
    const [hand, setHand] = useState(propertyToCards(data, 'hand'));
    const firebase = useContext(FirebaseContext);
    const [highlightCard, setHighlightCard] = useState(null);
    const [highlightFromSource, setHighlightFromSource] = useState(null);

    useEffect(() => {
        if(!data) return;

        setHand(propertyToCards(data, 'hand'));
        setScoredObjectives(propertyToCards(data, 'sObjs'));
        setDiscardedObjectives(propertyToCards(data, 'dObjs'));
        setDiscardedPowers(propertyToCards(data, 'dPws'));
    }, [data]);

    const handleHighlightCard = (card, source) => () => {
        setHighlightCard(card);
        setHighlightFromSource(source);
    };

    const handleClickAwayHightlight = e => {
        setHighlightCard(null);
        e.preventDefault();
    };

    const handleClose = () => {
        onClose(false);
    }

    const handleStopHighlighting = () => {
        setHighlightCard(null);
    }

    return (
        <div style={{ flex: 1 }}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography style={{ marginTop: '1rem' }}>
                        Opponents Hand{' '}
                        {`(${
                            hand ? hand.length
                                : 'empty'
                        })`}
                    </Typography>
                    <Divider />
                    <Grid container>
                        <Grid item xs={6}>
                            <Paper
                                elevation={3}
                                style={{
                                    position: 'relative',
                                    backgroundImage:
                                        'url(/assets/cards/objectives_back.png)',
                                    backgroundSize: 'cover',
                                    width: cardDefaultWidth * 0.2,
                                    height: cardDefaultHeight * 0.2,
                                    margin: 'auto',
                                }}
                            >
                                <Paper
                                    elevation={3}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 1,
                                        top: '0%',
                                        left: '0%',
                                        backgroundColor: 'goldenrod',
                                        width: '2rem',
                                        height: '2rem',
                                        display: 'flex',
                                        borderRadius: '1.5rem',
                                        color: 'white',
                                    }}
                                >
                                    <Typography
                                        style={{
                                            margin: 'auto',
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        {hand &&
                                            hand.filter(c => c.type === 0).length}
                                    </Typography>
                                </Paper>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper
                                elevation={3}
                                style={{
                                    position: 'relative',
                                    backgroundImage:
                                        'url(/assets/cards/powers_back.png)',
                                    backgroundSize: 'cover',
                                    width: cardDefaultWidth * 0.2,
                                    height: cardDefaultHeight * 0.2,
                                    margin: 'auto',
                                }}
                            >
                                <Paper
                                    elevation={3}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 1,
                                        top: '0%',
                                        left: '0%',
                                        backgroundColor: 'goldenrod',
                                        width: '2rem',
                                        height: '2rem',
                                        display: 'flex',
                                        borderRadius: '1.5rem',
                                        color: 'white',
                                    }}
                                >
                                    <Typography
                                        style={{
                                            margin: 'auto',
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        {hand &&
                                            hand.filter(c => c.type !== 0).length}
                                    </Typography>
                                </Paper>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography style={{ marginTop: '1rem' }}>
                        Scored objectives{' '}
                        {`(${
                            scoredObjectives ? scoredObjectives.length
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
                            {scoredObjectives &&
                                scoredObjectives.length > 0 &&
                                scoredObjectives
                                    // .filter(c => c.type !== 0)
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
                                                card,
                                                OBJECTIVES_SCORED
                                            )}
                                        />
                                    ))}
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography style={{ marginTop: '1rem' }}>
                        Discarded objectives{' '}
                        {`(${
                            discardedObjectives ? discardedObjectives.length
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
                            {discardedObjectives &&
                                discardedObjectives.length > 0 &&
                                discardedObjectives
                                    // .filter(c => c.type !== 0)
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
                                                card,
                                                OBJECTIVES_DISCARDED
                                            )}
                                        />
                                    ))}
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography style={{ marginTop: '1rem' }}>
                        Discarded powers{' '}
                        {`(${
                            discardedPowers ? discardedPowers.length
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
                            {discardedPowers &&
                                discardedPowers.length > 0 &&
                                discardedPowers
                                    // .filter(c => c.type !== 0)
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
                                                card,
                                                POWERS_DISCARDED
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
                                position: 'relative',
                                flexShrink: 0,
                                width: cardDefaultWidth,
                                height: cardDefaultHeight,
                                margin: 'auto',
                                borderRadius: '1rem',
                                backgroundPosition: 'center center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundImage: `url(/assets/cards/${highlightCard.id}.png)`,
                            }}
                            elevation={10}
                            onClick={handleStopHighlighting} />
                    </ClickAwayListener>
                </div>
            )}
        </div>
    )
}