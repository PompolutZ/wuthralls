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

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const useStyles = makeStyles(theme => ({
    tabs: {
        width: '100%',
    }
}))

function Room() {
    const classes = useStyles();
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

    useEffect(() => {
        const unsubscribe = firebase.setRoomListener(state.id, snapshot => {
            if(snapshot.exists) {
                console.log('Room.OnServerUpdated', snapshot.data());
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

    const drawObjectiveCard = () => {
        setIsHUDOpen(false);
    }

    const drawPowerCard = () => {
        setIsHUDOpen(false);
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
                    <div style={{ 
                        position: 'fixed',
                        width: '90%',
                        height: '90%',
                        top: '5%',
                        left: '5%',
                        zIndex: 100001,
                    }}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={6} style={{ display: 'flex' }}>
                                        <Paper elevation={3}
                                            style={{
                                                position: 'relative',
                                                backgroundImage: 'url(/assets/cards/objectives_back.png)',
                                                backgroundSize: 'cover', 
                                                width: cardDefaultWidth * .4, 
                                                height: cardDefaultHeight * .4,
                                                margin: 'auto'
                                            }}>
                                                <Paper elevation={3}
                                                        style={{ 
                                                            position: 'absolute',
                                                            zIndex: -1,
                                                            top: '.2rem',
                                                            left: '.2rem',
                                                            backgroundImage: 'url(/assets/cards/objectives_back.png)',
                                                            backgroundSize: 'cover', 
                                                            width: cardDefaultWidth * .4, 
                                                            height: cardDefaultHeight * .4,
                                                            margin: 'auto'
                                                        }} />
                                                <Paper elevation={5}
                                                        style={{ 
                                                            position: 'absolute',
                                                            zIndex: -2,
                                                            top: '.4rem',
                                                            left: '.4rem',
                                                            backgroundImage: 'url(/assets/cards/objectives_back.png)',
                                                            backgroundSize: 'cover', 
                                                            width: cardDefaultWidth * .4, 
                                                            height: cardDefaultHeight * .4,
                                                            margin: 'auto'
                                                        }} />
                                                <ButtonBase style={{ position: 'absolute', bottom: '0%', left: '50%', marginLeft: '-1.5rem', backgroundColor: 'teal', color: 'white', width: '3rem', height: '3rem', borderRadius: '1.5rem' }}
                                                    onClick={drawObjectiveCard}>
                                                    <DrawCardsIcon style={{ width: '2rem', height: '2rem' }} />
                                                </ButtonBase>
                                            </Paper>
                                    </Grid>
                                    <Grid item xs={6} style={{ display: 'flex' }}>
                                        <Paper elevation={3}
                                                style={{ 
                                                    position: 'relative',
                                                    backgroundImage: 'url(/assets/cards/powers_back.png)',
                                                    backgroundSize: 'cover', 
                                                    width: cardDefaultWidth * .4, 
                                                    height: cardDefaultHeight * .4,
                                                    margin: 'auto'
                                                }}>
                                            <Paper elevation={3}
                                                    style={{ 
                                                        position: 'absolute',
                                                        zIndex: -1,
                                                        top: '.2rem',
                                                        left: '.2rem',
                                                        backgroundImage: 'url(/assets/cards/powers_back.png)',
                                                        backgroundSize: 'cover', 
                                                        width: cardDefaultWidth * .4, 
                                                        height: cardDefaultHeight * .4,
                                                        margin: 'auto'
                                                    }} />
                                            <Paper elevation={5}
                                                    style={{ 
                                                        position: 'absolute',
                                                        zIndex: -2,
                                                        top: '.4rem',
                                                        left: '.4rem',
                                                        backgroundImage: 'url(/assets/cards/powers_back.png)',
                                                        backgroundSize: 'cover', 
                                                        width: cardDefaultWidth * .4, 
                                                        height: cardDefaultHeight * .4,
                                                        margin: 'auto'
                                                    }} />
                                            <ButtonBase style={{ position: 'absolute', bottom: '0%', left: '50%', marginLeft: '-1.5rem', backgroundColor: 'teal', color: 'white', width: '3rem', height: '3rem', borderRadius: '1.5rem' }}
                                                onClick={drawPowerCard}>
                                                <DrawCardsIcon style={{ width: '2rem', height: '2rem' }} />
                                            </ButtonBase>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                )
            }    
        </div>
    )
}

export default Room;