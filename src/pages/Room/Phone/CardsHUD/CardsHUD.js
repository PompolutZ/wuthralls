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
import { FirebaseContext } from '../../../../firebase';
import Fade from '@material-ui/core/Fade';
import Messenger from '../Messager';
import RoomActionMaker from '../RoomActionMaker';
import ActionsPalette from '../ActionsPalette';
import Board from '../Board';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import DrawCardsIcon from '@material-ui/icons/GetApp';
import PlayIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import ReturnToPileIcon from '@material-ui/icons/Eject';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useAuthUser } from '../../../../components/Session';
import { Typography } from '@material-ui/core';
import { cardsDb } from '../../../../data/index';
import { shuffle } from '../../../../common/function';
import Glory from '../../../../components/CommonSVGs/Glory';

import CardHighlight from './CardHighlight';

const stringToCards = (source) => {
    if(!Boolean(source)) return null;

    return source.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId }));
};

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const OBJECTIVES_HAND = 'OBJECTIVES_HAND';
const POWERS_HAND = 'POWERS_HAND';
const OBJECTIVES_SCORED = 'OBJECTIVES_SCORED';
const OBJECTIVES_DISCARDED = 'OBJECTIVES_DISCARDED';
const POWERS_DISCARDED = 'POWERS_DISCARDED';

const MY_CARDS_GROUP = 'MY_CARDS_GROUP';
const ENEMY_CARDS_GROUP = 'ENEMY_CARDS_GROUP';

export default ({
    roomId,
    myData,
    myFighters,
    objectivesPile,
    powerCardsPile,
    serverHand,
    enemyHand,
    scoredObjectivesPile,
    objectivesDiscardPile,
    powersDiscardPile,
    enemyScoredObjectivesPile,
    enemyObjectivesDiscardPile,
    enemyPowersDiscardPile,
    onClose,
}) => {
    const myself = useAuthUser();
    const [objectiveDrawPile, setObjectiveDrawPile] = useState(stringToCards(objectivesPile));
    const [powersDrawPile, setPowersDrawPile] = useState(stringToCards(powerCardsPile));
    const [scoredObjectives, setScoredObjectives] = useState(stringToCards(scoredObjectivesPile));
    const [discardedObjectives, setDiscardedObjectives] = useState(stringToCards(objectivesDiscardPile));
    const [discardedPowers, setDiscardedPowers] = useState(stringToCards(powersDiscardPile));
    const [hand, setHand] = useState(stringToCards(serverHand));
    const firebase = useContext(FirebaseContext);
    const [highlightCard, setHighlightCard] = useState(null);
    const [highlightFromSource, setHighlightFromSource] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(MY_CARDS_GROUP); 
    const [modified, setModified] = useState(false);
    const [gloryScored, setGloryScored] = useState(myData ? myData.gloryScored : 0);
    const [glorySpent, setGlorySpent] = useState(myData ? myData.glorySpent : 0);

    const opponentHand = stringToCards(enemyHand);
    const opponentScoreObjectivesPile = stringToCards(enemyScoredObjectivesPile);
    const opponentObjectivesDiscardPile = stringToCards(enemyObjectivesDiscardPile);
    const opponentPowersDiscardPile = stringToCards(enemyPowersDiscardPile);

    console.log(myData);

    const selectGroup = groupName => () => {
        setSelectedGroup(groupName)
    }

    const drawObjectiveCard = async () => {
        const objectives = objectiveDrawPile.slice(0, 1);
        if (!hand) {
            setHand(objectives);
        } else {
            setHand(prev => [...prev, ...objectives]);
        }
        setObjectiveDrawPile(prev => prev.slice(1));
        setModified(true);
    };

    const drawPowerCard = () => {
        const powers = powersDrawPile.slice(0, 1);
        if (!hand) {
            setHand(powers);
        } else {
            setHand(prev => [...prev, ...powers]);
        }
        setPowersDrawPile(prev => prev.slice(1));
        setModified(true);
    };

    const handleHighlightCard = (card, source) => () => {
        setHighlightCard(card);
        setHighlightFromSource(source);
    };

    const handleClickAwayHightlight = e => {
        setHighlightCard(null);
        if(e) {
            e.preventDefault();
        }
    };

    const handleClose = () => {
        onClose(false);
    }

    const handleSaveAndClose = () => {
        onClose(false);
        
        firebase.updateRoom(roomId, {
            [`${myself.uid}.hand`]: hand ? hand.map(x => x.id).join() : '',
            [`${myself.uid}.oDeck`]: objectiveDrawPile ? objectiveDrawPile.map(x => x.id).join() : '',
            [`${myself.uid}.pDeck`]: powersDrawPile ? powersDrawPile.map(x => x.id).join() : '',
            [`${myself.uid}.sObjs`]: scoredObjectives ? scoredObjectives.map(x => x.id).join() : '',
            [`${myself.uid}.dObjs`]: discardedObjectives ? discardedObjectives.map(x => x.id).join() : '',
            [`${myself.uid}.dPws`]: discardedPowers ? discardedPowers.map(x => x.id).join() : '',
            [`${myself.uid}.gloryScored`]: gloryScored,
            [`${myself.uid}.glorySpent`]: glorySpent,
        });
        setModified(false);
    }

    const playCard = card => () => {
        setHand(prev => prev.filter(c => c.id !== card.id));

        if(card.type === 0) {
            if(!scoredObjectives) {
                setScoredObjectives([card]);
            } else {
                setScoredObjectives(prev => [...prev, card]);
            }

            setGloryScored(Number(gloryScored) + Number(card.glory));

            firebase.addGenericMessage2(roomId, {
                author: 'Katophrane',
                type: 'INFO',
                subtype: 'SCORED_OBJECTIVE_CARD',
                cardId: card.id,
                value: `${myself.username} scored objective ${card.name} for at least ${card.glory} glory.`,
            })
        } else {
            if(!discardedPowers) {
                setDiscardedPowers([card]);
            } else {
                setDiscardedPowers(prev => [...prev, card]);
            }

            firebase.addGenericMessage2(roomId, {
                author: 'Katophrane',
                type: 'INFO',
                subtype: 'PLAYED_POWER_CARD',
                cardId: card.id,
                value: `${myself.username} played ${card.name}.`,
            })
        }

        setHighlightCard(null);
        setModified(true);
    }

    const applyUpgrade = (upgrade, fighter) => {
        const nextGloryScored = Number(gloryScored) - 1;
        const nextGlorySpent = Number(glorySpent) + 1;

        setHand(prev => prev.filter(c => c.id !== upgrade.id));
        setGloryScored(nextGloryScored);
        setGlorySpent(nextGlorySpent);
        
        const payload = {
            [`board.fighters.${fighter.id}.upgrades`]: Boolean(fighter.upgrades) ? `${fighter.upgrades},${upgrade.id}` : `${upgrade.id}`,
        }
        
        setHighlightCard(null);
        setModified(true);

        firebase.updateRoom(roomId, payload);
        firebase.addGenericMessage2(roomId, {
            author: 'Katophrane',
            type: 'INFO',
            subtype: 'APPLIED_UPGRADE_CARD',
            cardId: upgrade.id,
            value: `**${myData.name}** equips **${fighter.name}** with **${upgrade.name}** upgrade.
            **${myData.name}** has updated his scored/spent glory to ${nextGloryScored}/${nextGlorySpent}.`,
        });
        console.log('APPLY UPGRADE', payload);
    }

    const returnToHand = (card, source) => () => {
        console.log(card, source);
        if (!hand) {
            setHand([card]);
        } else {
            setHand(prev => [...prev, card]);
        }

        if(source === OBJECTIVES_SCORED) {
            setScoredObjectives(prev => prev ? prev.filter(c => c.id !== card.id) : []);
        }

        if(source === OBJECTIVES_DISCARDED) {
            setDiscardedObjectives(prev => prev ? prev.filter(c => c.id !== card.id) : []);
        }

        if(source === POWERS_DISCARDED) {
            setDiscardedPowers(prev => prev ? prev.filter(c => c.id !== card.id) : []);
        }

        setHighlightCard(null);
        setHighlightFromSource(null);
        setModified(true);
    }

    const returnToPile = (card, source) => () => {
        console.log(card, source);
        if(source === OBJECTIVES_HAND) {
            setHand(prev => prev ? prev.filter(c => c.id !== card.id) : []);
            setObjectiveDrawPile(prev => prev ? shuffle([...prev, card]) : [card]);
        }

        if(source === POWERS_HAND) {
            setHand(prev => prev ? prev.filter(c => c.id !== card.id) : []);
            setPowersDrawPile(prev => prev ? shuffle([...prev, card]) : [card]);
        }

        if(source === OBJECTIVES_SCORED) {
            setScoredObjectives(prev => prev ? prev.filter(c => c.id !== card.id) : []);
            setObjectiveDrawPile(prev => prev ? shuffle([...prev, card]) : [card]);
        }

        if(source === OBJECTIVES_DISCARDED) {
            setDiscardedObjectives(prev => prev ? prev.filter(c => c.id !== card.id) : []);
            setObjectiveDrawPile(prev => prev ? shuffle([...prev, card]) : [card]);
        }

        if(source === POWERS_DISCARDED) {
            setDiscardedPowers(prev => prev ? prev.filter(c => c.id !== card.id) : []);
            setPowersDrawPile(prev => prev ? shuffle([...prev, card]) : [card]);
        }

        setHighlightCard(null);
        setHighlightFromSource(null);
        setModified(true);
    }

    const discardCard = card => () => {
        setHand(prev => prev.filter(c => c.id !== card.id));

        if(card.type === 0) {
            if(!discardedObjectives) {
                setDiscardedObjectives([card]);
            } else {
                setDiscardedObjectives(prev => [...prev, card]);
            }

            firebase.addGenericMessage2(roomId, {
                author: 'Katophrane',
                type: 'INFO',
                subtype: 'DISCARDED_OBJECTIVE_CARD',
                cardId: card.id,
                value: `${myself.username} discarded objective card: ${card.name}.`,
            })
        } else {
            if(!discardedPowers) {
                setDiscardedPowers([card]);
            } else {
                setDiscardedPowers(prev => [...prev, card]);
            }

            firebase.addGenericMessage2(roomId, {
                author: 'Katophrane',
                type: 'INFO',
                subtype: 'DISCARDED_POWER_CARD',
                cardId: card.id,
                value: `${myself.username} discarded power card: ${card.name}.`,
            })
        }

        setHighlightCard(null);
        setModified(true);
    }

    const handleStopHighlighting = () => {
        setHighlightCard(null);
    }

    return (
        <div
            style={{
                position: 'fixed',
                width: '100%',
                height: '100%',
                top: '0',
                left: '0',
                zIndex: 100001,
                overflowY: 'scroll',
                backgroundColor: 'rgba(255,255,255,.8)'
            }}
        >
            <div style={{ margin: '1rem'}}>
                {
                    modified && (
                        <ButtonBase
                            style={{
                                position: 'fixed',
                                bottom: '0%',
                                right: '0%',
                                marginRight: '2rem',
                                marginBottom: '2rem',
                                backgroundColor: 'teal',
                                color: 'white',
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '1.5rem',
                                boxShadow: '3px 3px 3px 0px black',
                                boxSizing: 'border-box',
                                border: '2px solid white',
                                borderRadius: '1.5rem',
                            }}
                            onClick={handleSaveAndClose}
                        >
                            <SaveIcon
                                style={{
                                    width: '2rem',
                                    height: '2rem',
                                }}
                            />
                        </ButtonBase>
                    )
                }
                {
                    !modified && (
                        <ButtonBase
                            style={{
                                position: 'fixed',
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
                            onClick={handleClose}
                        >
                            <AddIcon
                                style={{
                                    width: '2rem',
                                    height: '2rem',
                                    transform: 'rotate(45deg)',
                                }}
                            />
                        </ButtonBase>
                    )
                }
            
            <Grid container style={{ marginTop: '2.5rem' }}>
                <Grid item xs={12}>
                    <ButtonGroup fullWidth aria-label="full width outlined button group" style={{ marginBottom: '.5rem' }}>
                        <Button onClick={selectGroup(MY_CARDS_GROUP)}>My Cards</Button>
                        <Button onClick={selectGroup(ENEMY_CARDS_GROUP)}>Opponent's Cards</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
            
            {
                selectedGroup === MY_CARDS_GROUP && (
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
                                                        card,
                                                        OBJECTIVES_HAND
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
                                                        card,
                                                        POWERS_HAND
                                                    )}
                                                />
                                            ))}
                                </div>
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
    
                )
            }
            {
                selectedGroup === ENEMY_CARDS_GROUP && (
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography style={{ marginTop: '1rem' }}>
                                Opponents Hand{' '}
                                {`(${
                                    opponentHand ? opponentHand.length
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
                                                {opponentHand &&
                                                    opponentHand.filter(c => c.type === 0).length}
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
                                                {opponentHand &&
                                                    opponentHand.filter(c => c.type !== 0).length}
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
                                    opponentScoreObjectivesPile ? opponentScoreObjectivesPile.length
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
                                    {opponentScoreObjectivesPile &&
                                        opponentScoreObjectivesPile.length > 0 &&
                                        opponentScoreObjectivesPile
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
                                    opponentObjectivesDiscardPile ? opponentObjectivesDiscardPile.length
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
                                    {opponentObjectivesDiscardPile &&
                                        opponentObjectivesDiscardPile.length > 0 &&
                                        opponentObjectivesDiscardPile
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
                                    opponentPowersDiscardPile ? opponentPowersDiscardPile.length
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
                                    {opponentPowersDiscardPile &&
                                        opponentPowersDiscardPile.length > 0 &&
                                        opponentPowersDiscardPile
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
                )
            }
            
            {highlightCard && (
                <CardHighlight highlightCard={highlightCard}
                    myFighters={myFighters}
                    highlightFromSource={highlightFromSource}
                    selectedGroup={selectedGroup}
                    handleClickAwayHightlight={handleClickAwayHightlight}
                    handleStopHighlighting={handleStopHighlighting}
                    playCard={playCard}
                    returnToPile={returnToPile}
                    returnToHand={returnToHand}
                    discardCard={discardCard}
                    applyFighterUpgrade={applyUpgrade} />
            )}
            </div>
        </div>
    );
};
