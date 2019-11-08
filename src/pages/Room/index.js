import React, { useEffect, useContext, useState } from 'react';
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
    
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    }

    return (
        <div>
            <BottomNavigation
                className={classes.tabs}
                value={tabIndex}
                onChange={handleTabChange}
                showLabels>
                {/* <BottomNavigationAction label="Actions" icon={<RestoreIcon />} /> */}
                <BottomNavigationAction label="Messages" icon={<QuestionAnswerIcon />} />
            </BottomNavigation>
            <Divider />                    
            {
                tabIndex === 0 && (
                    <Messenger roomId={state.id} state={state} />
                )
            }
            <ActionsPalette roomId={state.id} />
            {/* <RoomActionMaker roomId={state.id} /> */}
        </div>
    )
}

export default Room;