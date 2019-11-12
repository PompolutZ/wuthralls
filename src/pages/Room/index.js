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

    return (
        <div>
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
            <div style={{ marginBottom: 140}}>
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
            <ActionsPalette onActionTypeChange={handleActionTypeChange} data={data} onSelectedElementChange={setSelectedElement} />
            {/* <RoomActionMaker roomId={state.id} /> */}
        </div>
    )
}

export default Room;