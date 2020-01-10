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
import Board from './Board';
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

const propertyToCards = (source, property) => {
    return (
        source &&
        source[property] &&
        source[property]
            .split(',')
            .map(cardId => ({ ...cardsDb[cardId], id: cardId }))
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
        backgroundColor: 'magenta',
        flexFlow: 'column nowrap',
        '& > *': {
            flex: '1 100%',
        }
    },


}));

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const aspectRatio = 420 / 300;

const ObjectivesInHand = React.memo(({ objectives, onHighlight }) => (
    <>
        {
            objectives && objectives.map(card => (
                <div key={card.id} onClick={onHighlight(card)}>
                    <img src={`/assets/cards/${card.id}.png`} style={{ maxHeight: '10rem', margin: 'auto .5rem auto auto', flex: '0 0 auto'}} />                                     
                </div>
            ))
        }
    </>
));

function Cards({ data }) {
    const [hand, setHand] = useState(null);
    const [objectivesDrawPile, setObjectivesDrawPile] = useState(null);
    const [powersDrawPile, setPowersDrawPile] = useState(null);
    const [objectiveToHightlight, setObjectiveToHightlight] = useState(null);
    const [scoredObjectives, setScoredObjectives] = useState(null);
    const [discardedObjectives, setDiscardedObjectives] = useState(null);

    useEffect(() => {
        console.log('CARDS.OnPlayersDataChange');
        console.table(data);
        setObjectivesDrawPile(propertyToCards(data, 'oDeck'));
        setPowersDrawPile(propertyToCards(data, 'pDeck'));
    }, [data]);

    const handleDrawObjectiveCard = () => {
        if(objectiveToHightlight) return;

        const [first, ] = objectivesDrawPile;
        if(!first) return;

        const objectivesInHand = hand ? hand.filter(c => c.type === 0) : [];
        if(objectivesInHand.length === 3) return; 

        setHand(prev => prev ? [...prev, first] : [first]);
        setObjectivesDrawPile(objectivesDrawPile.slice(1));
    }

    const hightlightCard = card => () => {
        if(objectiveToHightlight) return;

        setObjectiveToHightlight(card);
    }

    const hideHightlightedObjective = () => {
        setObjectiveToHightlight(null);
    }

    const playCard = card => e => {
        if(card.type === 0) {
            setScoredObjectives(prev => prev ? [...prev, card] : [card]);
        }

        setHand(prev => prev.filter(c => c.id !== card.id));
        console.log(card);
        e.preventDefault();
    }

    const discardCard = card => e => {
        if(card.type === 0) {
            setDiscardedObjectives(prev => prev ? [...prev, card] : [card]);
        }

        setHand(prev => prev.filter(c => c.id !== card.id));
        console.log(card);
        e.preventDefault();
    }

    const returnToPile = (card, source) => () => {
        if(card.type === 0 && source === 'OBJECTIVES_HAND') {
            setObjectivesDrawPile(prev => prev ? shuffle([...prev, card]) : [card]);
            setHand(prev => prev ? prev.filter(c => c.id !== card.id) : null);
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
    }

    const objectivesInHand = hand ? hand.filter(c => c.type === 0) : [];
    const powersInHand = hand ? hand.filter(c => c.type !== 0) : [];

    return (
        <div style={{ height: '200px', backgroundColor: 'lightskyblue', flex: '0 0 auto', display: 'flex' }}>
            <div style={{ flex: '1 0', backgroundColor: 'OrangeRed' }}>
                <div style={{ display: 'flex', margin: '1rem', flexDirection: 'row-reverse', position: 'relative' }}>
                    <div style={{ flex: '0 0 auto', order: 4, marginRight: '1rem', }}>
                        <Typography style={{ fontSize: '.7rem' }}>Scored:</Typography>
                        <div style={{ height: cardDefaultHeight * .17, width: cardDefaultWidth * .17, boxSizing: 'border-box', border: '2px dashed black', marginBottom: '.3rem'}}>
                            {
                                scoredObjectives && scoredObjectives.length > 0 && scoredObjectives.slice(-1).map(card => (
                                    <img key={card.id} src={`/assets/cards/${card.id}.png`} style={{ width: '100%'}} />
                                ))
                            }
                        </div>
                        <Typography style={{ fontSize: '.7rem' }}>Discarded:</Typography>
                        <div style={{ height: cardDefaultHeight * .17, width: cardDefaultWidth * .17, boxSizing: 'border-box', border: '2px dashed black'}}>
                            {
                                discardedObjectives && discardedObjectives.length > 0 && discardedObjectives.slice(-1).map(card => (
                                    <img key={card.id} src={`/assets/cards/${card.id}.png`} style={{ width: '100%'}} />
                                ))
                            }
                        </div>
                    </div>
                    <div onClick={handleDrawObjectiveCard}>
                        <img src={`/assets/cards/objectives_back.png`} 
                            style={{ width: '4rem', filter: `drop-shadow(2px 2px 5px black) ${objectivesDrawPile && objectivesDrawPile.length <= 0 ? 'grayscale(100%) saturate(50%)' : '' }` }} />
                    </div>
                    <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'orange', alignItems: 'center', marginRight: '1rem', filter: objectiveToHightlight ? 'blur(3px)' : '' }}>
                        <ObjectivesInHand objectives={objectivesInHand} onHighlight={hightlightCard} />
                        {/* {
                            objectivesInHand && objectivesInHand.map(card => (
                                <div key={card.id} onClick={hightlightCard(card)}>
                                    <img src={`/assets/cards/${card.id}.png`} style={{ maxHeight: '10rem', margin: 'auto .5rem auto auto', flex: '0 0 auto'}} />                                     
                                </div>
                            ))
                        } */}
                    </div>

                    {
                        // HIGHLIGHTED CARD
                        objectiveToHightlight && (
                            <div style={{ position: 'absolute', top: '-175%', left: '20%', filter: 'drop-shadow(5px 5px 10px black)' }} onClick={hideHightlightedObjective}>
                                <img src={`/assets/cards/${objectiveToHightlight.id}.png`} style={{ width: '60%', borderRadius: '1rem' }} />
                                <ButtonBase
                                        style={{
                                            position: 'absolute',
                                            bottom: '0%',
                                            left: '0%',
                                            marginLeft: '-1.5rem',
                                            backgroundColor: 'dimgray',
                                            color: 'gray',
                                            width: '4rem',
                                            height: '4rem',
                                            borderRadius: '2rem',
                                            boxSizing: 'border-box',
                                            boxShadow: '0 0 10px 2px darkgoldenrod',
                                            zIndex: 1,
                                        }}
                                        onClick={playCard(objectiveToHightlight)}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            width: '3rem',
                                            height: '3rem',
                                            borderRadius: '2rem',
                                            backgroundColor: 'goldenrod',
                                            display: 'flex',
                                        }}>
                                        </div>
                                        <Glory
                                            style={{
                                                // backgroundColor: 'orange',
                                                color: 'darkgoldenrod',
                                                width: '4.2rem',
                                                height: '4.2rem',
                                                borderRadius: '3rem',
                                                position: 'absolute',
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            width: '3rem',
                                            height: '3rem',
                                            borderRadius: '2rem',
                                            display: 'flex',
                                            left: '1rem',
                                            top: '-.5rem',
                                        }}>
                                            <Typography style={{ color: 'white', fontSize: '3rem', fontWeight: 800 }}>{objectiveToHightlight.glory}</Typography>
                                        </div>
                                    </ButtonBase>
                                    <ButtonBase
                                        style={{
                                            position: 'absolute',
                                            bottom: '0%',
                                            left: '60%',
                                            marginLeft: '-2rem',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            width: '4rem',
                                            height: '4rem',
                                            borderRadius: '2rem',
                                        }}
                                        onClick={discardCard(objectiveToHightlight)}
                                    >
                                        <DeleteIcon
                                            style={{
                                                width: '2rem',
                                                height: '2rem',
                                            }}
                                        />
                                    </ButtonBase>
                                    <ButtonBase
                                        style={{
                                            position: 'absolute',
                                            bottom: '5rem',
                                            left: '60%',
                                            marginLeft: '-2rem',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            width: '4rem',
                                            height: '4rem',
                                            borderRadius: '2rem',
                                        }}
                                        onClick={returnToPile(objectiveToHightlight, 'OBJECTIVES_HAND')}
                                    >
                                        <ReturnToPileIcon
                                            style={{
                                                width: '2rem',
                                                height: '2rem',
                                            }}
                                        />
                                    </ButtonBase>

                            </div>
                        )
                    }
                </div>
            </div>
            <div style={{ flex: '0 0', backgroundColor: 'teal' }}>
                <div style={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', margin: '1rem' }}>
                    {
                        data.name && (
                            <Typography>{data.name}</Typography>
                        )
                    }
                    {
                        data.faction && (
                            <img src={`/assets/factions/${data.faction}-icon.png`} style={{ width: '2rem', height: '2rem' }} />
                        )
                    }
                </div>
            </div>
            <div style={{ flex: '1 0', backgroundColor: 'purple'}}>
                <div style={{ display: 'flex', margin: '1rem', flexDirection: 'row'}}>
                    <img src={`/assets/cards/powers_back.png`} style={{ width: '4rem', boxShadow: '2px 2px 10px 2px black', borderRadius: '.3rem'}} />
                </div>
            </div>
        </div>
    )
}

export default function DesktopRoom() {
    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const { state } = useLocation();
    const [data, setData] = useState(state);
    const [messages, setMessages] = useState(null);

    useEffect(() => {
            const unsubscribe = firebase.setRoomListener(state.id, snapshot => {
                if(snapshot.exists) {
                    const serverData = {...snapshot.data(), id: snapshot.id};
                    
                    if(__isEqual(data, serverData)) return;

                    setData(serverData);
                }
            });
    
            const unsubscribeFromMessages = firebase.fstore.collection('messages').doc(state.id).onSnapshot(s => {
                if(!s.data()) return;
                const msgs = Object.entries(s.data()).map(([key, value]) => ({...value, id: Number(key) }));
                
                if(__isEqual(msgs, messages)) return;
                
                setMessages(msgs);
            });
    
            return () => {
                unsubscribe();
                unsubscribeFromMessages();
            };
    }, []);

    return (
        <div className={classes.root}>
            <div style={{ height: '100px', backgroundColor: 'magenta', flex: '0 0 auto'}}>navigation and general info</div>
            <div style={{ backgroundColor: 'orange', flex: 2}}>main content</div>
            
            <Cards data={data[myself.uid]} />
        </div>
    );
}
