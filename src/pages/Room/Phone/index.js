import React, { useEffect, useContext, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../../firebase';
import Messenger from './Messager';
import ActionsPalette from './ActionsPalette';
import Board from './Board';
import { useAuthUser } from '../../../components/Session';
import { cardsDb } from '../../../data/index';
import CardsHUD from './CardsHUD';
import useKatophrane from '../../../components/hooks/useKatophrane';

const propertyToCards = (source, property) => {
    return source && source[property] && source[property].split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId }));
};

const useStyles = makeStyles(theme => ({
    tabs: {
        width: '100%',
    }
}))

export default function PhoneRoom() {
    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const { state } = useLocation();
    const katophrane = useKatophrane(state);
    const theme = useTheme();
    const [tabIndex, setTabIndex] = React.useState(0);
    const [selectedElement, setSelectedElement] = useState(null);
    const [data, setData] = useState(state);
    const navigationRef = useRef(null);
    const [stickHeader, setStickHeader] = useState(false);
    const [actionsPanelOffsetHeight, setActionsPanelOffsetHeight] = useState(4 * 16);
    const [isHUDOpen, setIsHUDOpen] = useState(false);
    const [hand, setHand] = useState(propertyToCards(data[myself.uid], 'hand')); 
    const [enemyHand, setEnemyHand] = useState(propertyToCards(data[data.players.find(p => p !== myself.uid)], 'hand')); 
    
    const [objectiveDrawPile, setObjectiveDrawPile] = useState(propertyToCards(data[myself.uid], 'oDeck')); 
    const [powersDrawPile, setPowersDrawPile] = useState(propertyToCards(data[myself.uid], 'pDeck')); 
    
    const [scoredObjectivesPile, setScoredObjectivesPile] = useState(propertyToCards(data[myself.uid], 'sObjs')); 
    const [objectivesDiscardPile, setObjectivesDiscardPile] = useState(propertyToCards(data[myself.uid], 'dObjs')); 
    const [powersDiscardPile, setPowersDiscardPile] = useState(propertyToCards(data[myself.uid], 'dPws')); 

    const [enemyScoredObjectivesPile, setEnemyScoredObjectivesPile] = useState(propertyToCards(data[data.players.find(p => p !== myself.uid)], 'sObjs')); 
    const [enemyObjectivesDiscardPile, setEnemyObjectivesDiscardPile] = useState(propertyToCards(data[data.players.find(p => p !== myself.uid)], 'dObjs')); 
    const [enemyPowersDiscardPile, setEnemyPowersDiscardPile] = useState(propertyToCards(data[data.players.find(p => p !== myself.uid)], 'dPws')); 
    const [messages, setMessages] = useState(null);

    const [boardScaleFactor, setBoardScaleFactor] = useState(.5);

    useEffect(() => {
        const unsubscribe = firebase.setRoomListener(state.id, snapshot => {
            if(snapshot.exists) {
                setData({...snapshot.data(), id: snapshot.id})
            }
        });

        const unsubscribeFromMessages = firebase.fstore.collection('messages').doc(state.id).onSnapshot(s => {
            if(!s.data()) return;
            const msgs = Object.entries(s.data()).map(([key, value]) => ({...value, id: Number(key) }));
            console.log('MESSAGES', msgs);
            setMessages(msgs);
        });
        // firebase.fstore.collection(`${state.id}_messages`).orderBy('created')
        //     .get()
        //     .then(snapshot => {
        //         const allMessages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        //         setMessages(allMessages);
        //     });

        return () => {
            unsubscribe();
            unsubscribeFromMessages();
        };
    }, []);


    useEffect(() => {
        console.log('KATO', katophrane);
    }, [katophrane]);

    useEffect(() => {
        console.log('Room.OnDataUpdated', data);
        const serverHand = data[myself.uid].hand;
        console.log('My Current Hand', serverHand, objectiveDrawPile, powersDrawPile);
        setHand(propertyToCards(data[myself.uid], 'hand'));
        
        // my drawing piles
        setObjectiveDrawPile(propertyToCards(data[myself.uid], 'oDeck'));
        setPowersDrawPile(propertyToCards(data[myself.uid], 'pDeck'));
        
        // my stuff
        setScoredObjectivesPile(propertyToCards(data[myself.uid], 'sObjs'));
        setObjectivesDiscardPile(propertyToCards(data[myself.uid], 'dObjs'));
        setPowersDiscardPile(propertyToCards(data[myself.uid], 'dPws'));

        // enemy stuff
        setEnemyHand(propertyToCards(data[data.players.find(p => p !== myself.uid)], 'hand'));
        setEnemyScoredObjectivesPile(propertyToCards(data[data.players.find(p => p !== myself.uid)], 'sObjs'));
        setEnemyObjectivesDiscardPile(propertyToCards(data[data.players.find(p => p !== myself.uid)], 'dObjs'));
        setEnemyPowersDiscardPile(propertyToCards(data[data.players.find(p => p !== myself.uid)], 'dPws'));
    }, [data]);

    useEffect(() => {
        console.log('Room.onSelectedElementChange', selectedElement);
    }, [selectedElement]);

    const handleActionTypeChange = offsetHeight  => {
        setActionsPanelOffsetHeight(offsetHeight);
    }

    const changeOpenDeckHUD = () => {
        setIsHUDOpen(true);
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ filter: isHUDOpen ? 'blur(3px)' : '', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: `100%`, flex: 1, overflowY: 'scroll' }}>
                {
                    tabIndex === 0 && (
                        <Messenger roomId={state.id} state={data} messages={messages} />
                    )
                }
                {
                    tabIndex === 1 && (
                        <Board roomId={state.id} state={data} selectedElement={selectedElement} scaleFactor={boardScaleFactor} onScaleFactorChange={setBoardScaleFactor} />
                    )
                }
                </div>
                <ActionsPalette onActionTypeChange={handleActionTypeChange} 
                    data={data} 
                    onSelectedElementChange={setSelectedElement}
                    onOpenDeckHUD={changeOpenDeckHUD}
                    visibleScreenType={tabIndex}
                    onSetScreenTabIndex={setTabIndex} />
            </div>

            {
                isHUDOpen && (
                    <CardsHUD 
                        roomId={data.id} 
                        myData={data[myself.uid]}
                        objectivesPile={objectiveDrawPile} 
                        powerCardsPile={powersDrawPile} 
                        serverHand={hand} 
                        enemyHand={enemyHand}
                        scoredObjectivesPile={scoredObjectivesPile}
                        objectivesDiscardPile={objectivesDiscardPile}
                        powersDiscardPile={powersDiscardPile}
                        enemyScoredObjectivesPile={enemyScoredObjectivesPile}
                        enemyObjectivesDiscardPile={enemyObjectivesDiscardPile}
                        enemyPowersDiscardPile={enemyPowersDiscardPile}
                        onClose={setIsHUDOpen} />
                )
            }    
        </div>
    )
}