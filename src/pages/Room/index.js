import React, { useEffect, useContext, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import RestoreIcon from '@material-ui/icons/Restore';
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
import CardsHUD from './CardsHUD';

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const useStyles = makeStyles(theme => ({
    tabs: {
        width: '100%',
    }
}))

function Room() {
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
    const [hand, setHand] = useState(data[myself.uid].hand && data[myself.uid].hand.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })));
    const [objectiveDrawPile, setObjectiveDrawPile] = useState(data[myself.uid].oDeck.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })));
    const [powersDrawPile, setPowersDrawPile] = useState(data[myself.uid].pDeck.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })));

    useEffect(() => {
        const unsubscribe = firebase.setRoomListener(state.id, snapshot => {
            if(snapshot.exists) {
                setData({...snapshot.data(), id: snapshot.id})
            }
        });

        window.onscroll = () => {
            if(navigationRef.current) {
                console.log('scrolling', navigationRef.current.offsetTop);
                if(window.pageYOffset > navigationRef.current.offsetTop) {
                    setStickHeader(true);
                } else {
                    setStickHeader(false);
                }
            }
        }

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log('Room.OnDataUpdated', data);
        const serverHand = data[myself.uid].hand;
        console.log('My Current Hand', serverHand, objectiveDrawPile, powersDrawPile);
        setHand(data[myself.uid].hand && data[myself.uid].hand.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })));
        setObjectiveDrawPile(data[myself.uid].oDeck.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })));
        setPowersDrawPile(data[myself.uid].pDeck.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })));
    }, [data]);

    useEffect(() => {
        console.log('Room.onSelectedElementChange', selectedElement);
    }, [selectedElement]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    }

    const handleActionTypeChange = offsetHeight  => {
        setActionsPanelOffsetHeight(offsetHeight);
    }

    const changeOpenDeckHUD = () => {
        setIsHUDOpen(true);
    }

    return (
        <div>
            <div style={{ filter: isHUDOpen ? 'blur(3px)' : '' }}>
                <BottomNavigation
                    ref={navigationRef}
                    className={classes.tabs}
                    value={tabIndex}
                    onChange={handleTabChange}
                    showLabels
                    style={
                        stickHeader ? {
                            position: 'fixed',
                            top: 0,
                            width: '100%'
                        } : {}
                    }>
                    {/* <BottomNavigationAction label="Actions" icon={<RestoreIcon />} /> */}
                    <BottomNavigationAction label="Messages" icon={<QuestionAnswerIcon />} />
                    <BottomNavigationAction label="Board" />
                </BottomNavigation>
                <Divider />                    
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
                    onOpenDeckHUD={changeOpenDeckHUD} />
                {/* <RoomActionMaker roomId={state.id} /> */}
            </div>

            {
                isHUDOpen && (
                    <CardsHUD roomId={data.id} objectivesPile={objectiveDrawPile} powerCardsPile={powersDrawPile} serverHand={hand} onClose={setIsHUDOpen} />
                )
            }    
        </div>
    )
}

export default Room;