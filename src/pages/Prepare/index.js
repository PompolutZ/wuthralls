import React, { useEffect, useState, useContext } from 'react';
import { useAuthUser } from '../../components/Session';
import { useLocation, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import UnknownIcon from '@material-ui/icons/Help';
import { makeStyles } from '@material-ui/core/styles';
import { factions, cardsIdToFactionIndex, factionIndexes, warbands } from '../../data';
import { FirebaseContext } from '../../firebase';
import useKatophrane from '../../components/hooks/useKatophrane';

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        margin: '1rem',
    },

    iconImage: {
        width: '2rem',
        height: '2rem'
    },

    factionIcon: { 
        width: '4rem', 
        height: '4rem', 
        fill: 'teal', 
        color: 'white' 
    }
}));

function Prepare() {
    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const { state } = useLocation();
    const katophrane = useKatophrane(state);
    const [selectedFaction, setSelectedFaction] = useState(null);
    const [objectiveCards, setObjectiveCards] = useState(''); //useState(`06270,06281,06099,06100,03340,03373,06103,06104,06106,03302,06107,03319`);
    const [powerCards, setPowerCards] = useState(''); //useState(`07021,07022,06110,06363,06396,06122,06112,03550,06113,06434,06126,06368,03544,06118,06119,03436,06109,03514,03506,03529`);
    const [playerIsReady, setPlayerIsReady] = useState(false);

    useEffect(() => {
        console.log(objectiveCards, powerCards);
        if(!Boolean(objectiveCards) && !Boolean(powerCards)) return;

        const objectives = objectiveCards && objectiveCards.split(',');
        const powers = powerCards && powerCards.split(',');
        const allCards = [...objectives, ...powers];
        let autoDeterminedFaction = null;
        for(let c of allCards) {
            if(Boolean(cardsIdToFactionIndex[c])) {
                autoDeterminedFaction = factionIndexes[cardsIdToFactionIndex[c]];
                setSelectedFaction(autoDeterminedFaction);
                break;
            }
        }

        if(Boolean(autoDeterminedFaction) && objectives.length === 12 && powers.length >= 20) {
            setPlayerIsReady(true);
        }

    }, [objectiveCards, powerCards])

    const handleObjectiveCardsChange = e => {
        setObjectiveCards(e.target.value);
    }

    const handlePowerCardsChange = e => {
        setPowerCards(e.target.value);
    }

    const handleJoinTheRoom = async () => {
        const playerInfo = {
            name: myself.username,
            faction: selectedFaction,
            oDeck: shuffle(objectiveCards.split(',')).join(),
            pDeck: shuffle(powerCards.split(',')).join(),
            gloryScored: 0,
            glorySpent: 0,
            activationsLeft: 4,
        };

        console.log(selectedFaction);
        const myWarband = warbands[selectedFaction].reduce((r, fighter, idx) => ({ ...r, [`${myself.uid}_F${idx}`]: fighter }), {});
        console.log(state.id, myself.uid, playerInfo, {...state.board.fighters, ...myWarband });
        await firebase.addPlayerToRoom(state.id, myself.uid, playerInfo, {...state.board.fighters, ...myWarband });

        katophrane.startNextInteractiveStep(myself.uid);

        history.push('/');
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography>Copy paste your objective and power decks. Faction will be determined automatically.</Typography>
                </Grid>
                <Grid item xs={12} container alignItems="center" direction="column">
                    <Typography variant="h6">Faction</Typography>
                    {
                        selectedFaction 
                        ? <img className={classes.factionIcon} src={`/assets/factions/${selectedFaction}-icon.png`} />
                        : <UnknownIcon className={classes.factionIcon} />
                    }
                    <Typography>Currently supported factions:</Typography>
                    <div>
                    {
                        Object.keys(warbands).map(warband => (
                            <img key={warband} src={`/assets/factions/${warband}-icon.png`} style={{ width: '2rem', height: '2rem'}} />
                        ))
                    }
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Objective cards pile</Typography>
                    <Divider />
                    <TextField 
                        fullWidth 
                        type="text"
                        multiline
                        value={objectiveCards}
                        onChange={handleObjectiveCardsChange} />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Power cards pile</Typography>
                    <Divider />
                    <TextField 
                        fullWidth 
                        type="text"
                        multiline
                        value={powerCards}
                        onChange={handlePowerCardsChange} />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleJoinTheRoom} disabled={!playerIsReady}>Join</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default Prepare;