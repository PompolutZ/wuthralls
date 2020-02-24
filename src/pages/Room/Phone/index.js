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
import CardsHUD from './CardsHUD/CardsHUD';
import useKatophrane from '../../../components/hooks/useKatophrane';

// const propertyToCards = (source, property) => {
//     return source && source[property] && source[property].split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId }));
// };

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
    //const katophrane = useKatophrane(state);
    const theme = useTheme();
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedElement, setSelectedElement] = useState(null);
    const [data, setData] = useState(state);
    const [activePaletteType, setActivePaletteType] = useState(null);
    const navigationRef = useRef(null);
    const [stickHeader, setStickHeader] = useState(false);
    const [actionsPanelOffsetHeight, setActionsPanelOffsetHeight] = useState(4 * 16);
    const [isHUDOpen, setIsHUDOpen] = useState(false);
    
    const [hand, setHand] = useState(data[myself.uid] && data[myself.uid].hand);
    const [objectiveDrawPile, setObjectiveDrawPile] = useState(data[myself.uid] && data[myself.uid].oDeck); 
    const [powersDrawPile, setPowersDrawPile] = useState(data[myself.uid] && data[myself.uid].pDeck); 
    const [scoredObjectivesPile, setScoredObjectivesPile] = useState(data[myself.uid] && data[myself.uid].sObjs); 
    const [objectivesDiscardPile, setObjectivesDiscardPile] = useState(data[myself.uid] && data[myself.uid].dObjs); 
    const [powersDiscardPile, setPowersDiscardPile] = useState(data[myself.uid] && data[myself.uid].dPws);
    
    const [opponent, setOpponent] = useState(data[data.players.find(p => p !== myself.uid)]);

    const [enemyHand, setEnemyHand] = useState(opponent && opponent.hand); 
    const [enemyScoredObjectivesPile, setEnemyScoredObjectivesPile] = useState(opponent && opponent.sObjs); 
    const [enemyObjectivesDiscardPile, setEnemyObjectivesDiscardPile] = useState(opponent && opponent.dObjs); 
    const [enemyPowersDiscardPile, setEnemyPowersDiscardPile] = useState(opponent && opponent.dPws); 
    const [messages, setMessages] = useState(null);

    const [boardScaleFactor, setBoardScaleFactor] = useState(.5);

    useEffect(() => {
        window.addEventListener("keydown", handleHotkeyDown);

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

        return () => {
            unsubscribe();
            unsubscribeFromMessages();
            window.removeEventListener("keydown");
        };
    }, []);

    // useEffect(() => {
    //     console.log('KATO', katophrane);
    // }, [katophrane]);

    useEffect(() => {
        console.log('Room.OnDataUpdated', data);
        const serverHand = data[myself.uid].hand;
        console.log('My Current Hand', serverHand, objectiveDrawPile, powersDrawPile);
        if(data[myself.uid].hand !== hand) {
            setHand(data[myself.uid] && data[myself.uid].hand);
        }
        
        // my drawing piles
        if(data[myself.uid].oDeck !== objectiveDrawPile) {
            setObjectiveDrawPile(data[myself.uid] && data[myself.uid].oDeck);
        }
        
        if(data[myself.uid].pDeck !== powersDrawPile) {
            setPowersDrawPile(data[myself.uid] && data[myself.uid].pDeck);
        }
        
        // my stuff
        if(data[myself.uid].sObjs !== scoredObjectivesPile) {
            setScoredObjectivesPile(data[myself.uid] && data[myself.uid].sObjs);
        }
        
        if(data[myself.uid].dObjs !== objectivesDiscardPile) {
            setObjectivesDiscardPile(data[myself.uid] && data[myself.uid].dObjs);
        }
        
        if(data[myself.uid].dPws !== powersDiscardPile) {
            setPowersDiscardPile(data[myself.uid] && data[myself.uid].dPws);
        }

        // enemy stuff
        const opponent = data[data.players.find(p => p !== myself.uid)];
        setEnemyHand(opponent && opponent.hand);
        setEnemyScoredObjectivesPile(opponent && opponent.sObjs);
        setEnemyObjectivesDiscardPile(opponent && opponent.dObjs);
        setEnemyPowersDiscardPile(opponent && opponent.dPws);
    }, [data]);

    useEffect(() => {
        console.log('Room.onSelectedElementChange', selectedElement);
    }, [selectedElement]);

    const handleHotkeyDown = event => {
        if(event && event.target.type === "textarea") return;

        console.log('event', event);

        // switch main tab
        if(event.key === "q") {
            setTabIndex(current => Number(!Boolean(current)));
            return;
        }

        if(event.key === "w") {
            setActivePaletteType('FIGHTERS');
            return;
        }

        if(event.key === "a") {
            setActivePaletteType('ROLL_DICE');
            return;
        }

        console.log('Hotkey', event);
    }

    const handleActionTypeChange = offsetHeight  => {
        setActionsPanelOffsetHeight(offsetHeight);
    }

    const changeOpenDeckHUD = () => {
        setIsHUDOpen(true);
    }

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: 'dimgray' }}>
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
                    onSetScreenTabIndex={setTabIndex}
                    activePaletteType={activePaletteType} />
            </div>

            {
                isHUDOpen && (
                    <CardsHUD 
                        roomId={data.id} 
                        myData={data[myself.uid]}
                        myFighters={Object.entries(data.board.fighters).filter(([fighterId, fighter]) => fighterId.startsWith(myself.uid))}
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