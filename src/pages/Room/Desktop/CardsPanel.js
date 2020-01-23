import React, { useEffect, useContext, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../../firebase';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Messenger from './Messager';
import ActionsPalette from './ActionsPalette';
import { useAuthUser } from '../../../components/Session';
import { cardsDb } from '../../../data/index';
import CardsHUD from './CardsHUD';
import useKatophrane from '../../../components/hooks/useKatophrane';
import MyPanel from './MyPanel';
import OpponentPanel from './OpponentPanel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import ReturnToPileIcon from '@material-ui/icons/Eject';
import Glory from '../../../components/CommonSVGs/Glory';
import { shuffle } from '../../../common/function';
import __isEqual from 'lodash/isEqual';
import RollDice from '../../../components/CommonSVGs/RollDice';
import SendIcon from '@material-ui/icons/Send';
import SendMessageAction from '../Phone/SendMessageAction';
import RollDiceAction from '../Phone/RollDiceAction';
import Overlay from './Overlay';
import Board from './Main/Board';
import Scrollbar from 'react-scrollbars-custom';
import Warbands from './Warbands';

const propertyToCards = (source, property) => {
    return (
        source &&
        source[property] ?
        source[property]
            .split(',')
            .map(cardId => ({ ...cardsDb[cardId], id: cardId }))
        : []    
    );
};

const useStyles = makeStyles(theme => ({
    tabs: {
        width: '100%',
    },

    root: {
        width: '100%',
        flex: 1,
        display: 'flex',
        height: '100%',
        flexFlow: 'column nowrap',
        '& > *': {
            flex: '1 100%',
        },
    },

    boardContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        '-webkit-scrollbar': '0px',
        overflow: 'auto',
    },
}));

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const aspectRatio = 420 / 300;

const ObjectivesInHand = React.memo(({ objectives, onHighlight }) => (
    <>
        {objectives &&
            objectives.map(card => (
                <div key={card.id} onClick={onHighlight(card)}>
                    <img
                        src={`/assets/cards/${card.id}.png`}
                        style={{
                            maxHeight: '10rem',
                            margin: 'auto .5rem auto auto',
                            flex: '0 0 auto',
                        }}
                    />
                </div>
            ))}
    </>
));

export default function Cards({ data, onHighlightCard, onDataChange }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [hand, setHand] = useState(propertyToCards(data, 'hand'));
    const [objectivesDrawPile, setObjectivesDrawPile] = useState(propertyToCards(data, 'oDeck'));
    const [powersDrawPile, setPowersDrawPile] = useState(propertyToCards(data, 'pDeck'));
    const [objectiveToHightlight, setObjectiveToHightlight] = useState(null);
    const [scoredObjectives, setScoredObjectives] = useState(propertyToCards(data, 'sObjs'));
    const [discardedObjectives, setDiscardedObjectives] = useState(propertyToCards(data, 'dObjs'));

    useEffect(() => {
        console.log('CARDS.OnPlayersDataChange');
        console.table(data);
        setObjectivesDrawPile(propertyToCards(data, 'oDeck'));
        setPowersDrawPile(propertyToCards(data, 'pDeck'));
        setHand(propertyToCards(data, 'hand'));
        setScoredObjectives(propertyToCards(data, 'sObjs'));
        setDiscardedObjectives(propertyToCards(data, 'dObjs'));
    }, [data]);

    const handleDrawObjectiveCard = () => {
        if (objectiveToHightlight) return;

        const [first] = objectivesDrawPile;
        if (!first) return;

        const objectivesInHand = hand ? hand.filter(c => c.type === 0) : [];
        if (objectivesInHand.length === 3) return;

        const updatedHand = hand ? [...hand, first] : [first];
        setHand(updatedHand);
        const updatedObjectivesDrawPile = objectivesDrawPile.slice(1);
        setObjectivesDrawPile(updatedObjectivesDrawPile);

        onDataChange(myself.uid, {
            ...data,
            hand: updatedHand.map(c => c.id).join(','),
            oDeck: updatedObjectivesDrawPile.map(c => c.id).join(',')
        })
    };

    const hightlightCard = card => () => {
        console.log(card);
        onHighlightCard(card, 'OBJECTIVE_HIGHLIGHT');
    };

    const hideHightlightedObjective = () => {
        setObjectiveToHightlight(null);
    };

    const playCard = card => e => {
        if (card.type === 0) {
            setScoredObjectives(prev => (prev ? [...prev, card] : [card]));
        }

        setHand(prev => prev.filter(c => c.id !== card.id));
        console.log(card);
        e.preventDefault();
    };

    const discardCard = card => e => {
        if (card.type === 0) {
            setDiscardedObjectives(prev => (prev ? [...prev, card] : [card]));
        }

        setHand(prev => prev.filter(c => c.id !== card.id));
        console.log(card);
        e.preventDefault();
    };

    const returnToPile = (card, source) => () => {
        if (card.type === 0 && source === 'OBJECTIVES_HAND') {
            setObjectivesDrawPile(prev =>
                prev ? shuffle([...prev, card]) : [card]
            );
            setHand(prev => (prev ? prev.filter(c => c.id !== card.id) : null));
        }
        // console.log(card, source);
        // if(source === OBJECTIVES_HAND) {
        //     setHand(prev => prev ? prev.filter(c => c.id !== card.id) : []);
        //     setObjectiveDrawPile(prev => prev ? shuffle([...prev, card]) : [card]);
        // }

        // if(source === POWERS_HAND) {
        //     setHand(prev => prev ? prev.filter(c => c.id !== card.id) : []);
        //     setPowersDrawPile(prev => prev ? shuffle([...prev, card]) : [card]);
        // }

        // if(source === OBJECTIVES_SCORED) {
        //     setScoredObjectives(prev => prev ? prev.filter(c => c.id !== card.id) : []);
        //     setObjectiveDrawPile(prev => prev ? shuffle([...prev, card]) : [card]);
        // }

        // if(source === OBJECTIVES_DISCARDED) {
        //     setDiscardedObjectives(prev => prev ? prev.filter(c => c.id !== card.id) : []);
        //     setObjectiveDrawPile(prev => prev ? shuffle([...prev, card]) : [card]);
        // }

        // if(source === POWERS_DISCARDED) {
        //     setDiscardedPowers(prev => prev ? prev.filter(c => c.id !== card.id) : []);
        //     setPowersDrawPile(prev => prev ? shuffle([...prev, card]) : [card]);
        // }

        // setHighlightCard(null);
        // setHighlightFromSource(null);
        // setModified(true);
    };

    const objectivesInHand = hand ? hand.filter(c => c.type === 0) : [];
    const powersInHand = hand ? hand.filter(c => c.type !== 0) : [];

    return (
        <div
            style={{
                height: '200px',
                backgroundColor: 'lightskyblue',
                flex: '0 0 auto',
                display: 'flex',
            }}
        >
            <div style={{ flex: '1 0', backgroundColor: 'OrangeRed' }}>
                <div
                    style={{
                        display: 'flex',
                        margin: '1rem',
                        flexDirection: 'row-reverse',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            flex: '0 0 auto',
                            order: 4,
                            marginRight: '1rem',
                        }}
                    >
                        <Typography style={{ fontSize: '.7rem' }}>
                            Scored:
                        </Typography>
                        <div
                            style={{
                                height: cardDefaultHeight * 0.17,
                                width: cardDefaultWidth * 0.17,
                                boxSizing: 'border-box',
                                border: '2px dashed black',
                                marginBottom: '.3rem',
                            }}
                        >
                            {scoredObjectives &&
                                scoredObjectives.length > 0 &&
                                scoredObjectives
                                    .slice(-1)
                                    .map(card => (
                                        <img
                                            key={card.id}
                                            src={`/assets/cards/${card.id}.png`}
                                            style={{ width: '100%' }}
                                        />
                                    ))}
                        </div>
                        <Typography style={{ fontSize: '.7rem' }}>
                            Discarded:
                        </Typography>
                        <div
                            style={{
                                height: cardDefaultHeight * 0.17,
                                width: cardDefaultWidth * 0.17,
                                boxSizing: 'border-box',
                                border: '2px dashed black',
                            }}
                        >
                            {discardedObjectives &&
                                discardedObjectives.length > 0 &&
                                discardedObjectives
                                    .slice(-1)
                                    .map(card => (
                                        <img
                                            key={card.id}
                                            src={`/assets/cards/${card.id}.png`}
                                            style={{ width: '100%' }}
                                        />
                                    ))}
                        </div>
                    </div>
                    <div onClick={handleDrawObjectiveCard}>
                        <img
                            src={`/assets/cards/objectives_back.png`}
                            style={{
                                width: '4rem',
                                filter: `drop-shadow(2px 2px 5px black) ${
                                    objectivesDrawPile &&
                                    objectivesDrawPile.length <= 0
                                        ? 'grayscale(100%) saturate(50%)'
                                        : ''
                                }`,
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            backgroundColor: 'orange',
                            alignItems: 'center',
                            marginRight: '1rem',
                        }}
                    >
                        <ObjectivesInHand
                            objectives={objectivesInHand}
                            onHighlight={hightlightCard}
                        />
                    </div>
                </div>
            </div>
            <div style={{ flex: '0 0', backgroundColor: 'teal' }}>
                <div
                    style={{
                        display: 'flex',
                        flexFlow: 'column nowrap',
                        alignItems: 'center',
                        margin: '1rem',
                    }}
                >
                    {data.name && <Typography>{data.name}</Typography>}
                    {data.faction && (
                        <img
                            src={`/assets/factions/${data.faction}-icon.png`}
                            style={{ width: '2rem', height: '2rem' }}
                        />
                    )}
                </div>
            </div>
            <div style={{ flex: '1 0', backgroundColor: 'purple' }}>
                <div
                    style={{
                        display: 'flex',
                        margin: '1rem',
                        flexDirection: 'row',
                    }}
                >
                    <img
                        src={`/assets/cards/powers_back.png`}
                        style={{
                            width: '4rem',
                            boxShadow: '2px 2px 10px 2px black',
                            borderRadius: '.3rem',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}