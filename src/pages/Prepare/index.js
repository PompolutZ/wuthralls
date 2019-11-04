import React, { useEffect, useState, useContext } from 'react';
import { useAuthUser } from '../../components/Session';
import { useLocation, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { factions } from '../../data';
import { FirebaseContext } from '../../firebase';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },

    iconImage: {
        width: '2rem',
        height: '2rem'
    },
}));

function Prepare() {
    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const { state } = useLocation();
    const [myData, setMyData] = useState(state && myself && state[myself.uid]);
    const [selectedFaction, setSelectedFaction] = useState((myData && myData.faction) || null);
    
    useEffect(() => {
        console.log(state);
    }, []);

    useEffect(() => {
        console.log('MY DATA', myData);
    }, [myData]);

    useEffect(() => {
        console.log('MY FACTION', selectedFaction);
    }, [selectedFaction]);

    const handleFactionClick = faction => () => {
        console.log(faction);
        setSelectedFaction(faction);
    }

    const handleReadyClick = async () => {
        const myUpdatedData = {
            ...myData,
            state: 'READY',
            faction: selectedFaction
        }

        await firebase.updatePlayerInfo(state.id, myself.uid, myUpdatedData);
        history.push('/');
    }

    return (
        <div>
            <Grid className={classes.root} container spacing={3} direction="column" justify="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography>Pick you faction wisely</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        {
                            Object.keys(factions).map(faction => (
                                <Grid item xs={4} key={faction}>
                                    <ButtonBase onClick={handleFactionClick(faction)}>
                                        <img className={classes.iconImage} src={`/assets/factions/${faction}-icon.png`} alt={faction}
                                            style={{
                                                transform: faction === selectedFaction ? 'scale(1.2)' : 'scale(1)'
                                            }} />
                                    </ButtonBase>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleReadyClick} disabled={!selectedFaction}>I am Ready</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default Prepare;