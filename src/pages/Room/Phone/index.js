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
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'));
    const [tabIndex, setTabIndex] = React.useState(0);
    const [selectedElement, setSelectedElement] = useState(null);
    const [data, setData] = useState(state);
    const navigationRef = useRef(null);
    const [stickHeader, setStickHeader] = useState(false);
    const [actionsPanelOffsetHeight, setActionsPanelOffsetHeight] = useState(4 * 16);
    const [isHUDOpen, setIsHUDOpen] = useState(false);
    const [hand, setHand] = useState(propertyToCards(data[myself.uid], 'hand')); 
    
    const [objectiveDrawPile, setObjectiveDrawPile] = useState(propertyToCards(data[myself.uid], 'oDeck')); 
    const [powersDrawPile, setPowersDrawPile] = useState(propertyToCards(data[myself.uid], 'pDeck')); 
    
    const [scoredObjectivesPile, setScoredObjectivesPile] = useState(propertyToCards(data[myself.uid], 'sObjs')); 
    const [objectivesDiscardPile, setObjectivesDiscardPile] = useState(propertyToCards(data[myself.uid], 'dObjs')); 
    const [powersDiscardPile, setPowersDiscardPile] = useState(propertyToCards(data[myself.uid], 'dPws')); 

    const [enemyScoredObjectivesPile, setEnemyScoredObjectivesPile] = useState(propertyToCards(data[data.players.find(p => p !== myself.uid)], 'sObjs')); 
    const [enemyObjectivesDiscardPile, setEnemyObjectivesDiscardPile] = useState(propertyToCards(data[data.players.find(p => p !== myself.uid)], 'dObjs')); 
    const [enemyPowersDiscardPile, setEnemyPowersDiscardPile] = useState(propertyToCards(data[data.players.find(p => p !== myself.uid)], 'dPws')); 


    useEffect(() => {
        const unsubscribe = firebase.setRoomListener(state.id, snapshot => {
            if(snapshot.exists) {
                setData({...snapshot.data(), id: snapshot.id})
            }
        });

        return () => unsubscribe();
    }, []);

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
        <div>
            <div style={{ filter: isHUDOpen ? 'blur(3px)' : '' }}>
                <div style={{ marginBottom: isHUDOpen ? 0 : 140 }}>
                {
                    tabIndex === 0 && (
                        <Messenger roomId={state.id} state={data} />
                    )
                }
                {
                    tabIndex === 1 && (
                        <Board roomId={state.id} state={data} selectedElement={selectedElement} />
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
                        objectivesPile={objectiveDrawPile} 
                        powerCardsPile={powersDrawPile} 
                        serverHand={hand} 
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