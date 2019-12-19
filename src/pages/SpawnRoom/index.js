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

const featureTokens = [{
    type: 'FEATURE_HEX',
    number: 1,
    isRevealed: false,
    isLethal: true,
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
},
{
    type: 'FEATURE_HEX',
    number: 2,
    isLethal: true,
    isRevealed: false,
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
},
{
    type: 'FEATURE_HEX',
    number: 3,
    isLethal: true,
    isRevealed: false,
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
},
{
    type: 'FEATURE_HEX',
    number: 4,
    isLethal: true,
    isRevealed: false,
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
},
{
    type: 'FEATURE_HEX',
    number: 5,
    isLethal: true,
    isRevealed: false,
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
},
]

const lethalHexTokens = new Array(2).fill({
    type: 'LETHAL_HEX',
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
})

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

export default function SpawnRoom() {
    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const { state } = useLocation();
    const [selectedFaction, setSelectedFaction] = useState(null);
    const [objectiveCards, setObjectiveCards] = useState(''); //useState(`04031,03340,03373,03385,04035,03310,03345,03004,03357,03006,03007,03319`);
    const [powerCards, setPowerCards] = useState(''); //useState(`04050,06350,07021,03471,07014,03451,03551,03012,03023,04046,04003,03499,03389,03027,03446,03557,03504,03449,03506,03529`);
    const [playerIsReady, setPlayerIsReady] = useState(false);
    const [roomName, setRoomName] = useState(''); //useState(`${Math.random()}`);

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

        if(Boolean(autoDeterminedFaction) && objectives.length === 12 && powers.length >= 20 && Boolean(roomName)) {
            setPlayerIsReady(true);
        }

    }, [objectiveCards, powerCards, roomName])

    const handleObjectiveCardsChange = e => {
        setObjectiveCards(e.target.value);
    }

    const handlePowerCardsChange = e => {
        setPowerCards(e.target.value);
    }

    const handleRoomNameChange = e => {
        setRoomName(e.target.value);
    }

    const createNewRoom = async () => {
        const featureHexTokens = shuffle(featureTokens).reduce((r, token, idx) => ({ ...r, [`Feature_${idx}`]: token }), {});
        const lethalHexes = lethalHexTokens.reduce((r, token, idx) => ({ ...r, [`Lethal_${idx}`]: token }), {});
        const myWarband = warbands[selectedFaction].reduce((r, fighter, idx) => ({ ...r, [`${myself.uid}_F${idx}`]: fighter }), {});

        const payload = {
            name: roomName,
            createdBy: myself.uid,
            status: {
                round: 0,
            },
            board: {
                fighters: {
                    ...myWarband,
                },
                tokens: {
                    ...lethalHexes,
                    ...featureHexTokens
                }
            },
            players: [myself.uid],
            [myself.uid]: {
                name: myself.username,
                faction: selectedFaction,
                oDeck: shuffle(objectiveCards.split(',')).join(),
                pDeck: shuffle(powerCards.split(',')).join(),
                gloryScored: 0,
                glorySpent: 0,
                activationsLeft: 4
            }
        };

        await firebase.addRoom2(payload);

        // const playerInfo = {
        //     name: myself.username,
        //     faction: selectedFaction,
        //     oDeck: shuffle(objectiveCards.split(',')).join(),
        //     pDeck: shuffle(powerCards.split(',')).join(),
        //     gloryScored: 0,
        //     glorySpent: 0,
        //     activationsLeft: 4,
        // };

        // const myWarband = warbands[selectedFaction].reduce((r, fighter, idx) => ({ ...r, [`${myself.uid}_F${idx}`]: fighter }), {});
        // console.log(state.id, myself.uid, playerInfo, {...state.board.fighters, ...myWarband });
        // await firebase.addPlayerToRoom(state.id, myself.uid, playerInfo, {...state.board.fighters, ...myWarband });
        history.push('/');
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={3} justify="center">
                <Grid item xs={12} lg={4}>
                    <TextField 
                        fullWidth 
                        type="text"
                        multiline
                        placeholder="New Room Name"
                        value={roomName}
                        variant="outlined"
                        onChange={handleRoomNameChange} />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Typography variant="body2">Copy paste your objective and power decks. Faction will be determined automatically.</Typography>
                </Grid>
                <Grid item xs={12} container alignItems="center" direction="column" lg={4}>
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
                <Grid item xs={12} lg={4}>
                    <Typography variant="h6">Objective cards pile</Typography>
                    <Divider />
                    <TextField 
                        fullWidth 
                        type="text"
                        multiline
                        value={objectiveCards}
                        onChange={handleObjectiveCardsChange} />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Typography variant="h6">Power cards pile</Typography>
                    <Divider />
                    <TextField 
                        fullWidth 
                        type="text"
                        multiline
                        value={powerCards}
                        onChange={handlePowerCardsChange} />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Button variant="contained" color="primary" onClick={createNewRoom} disabled={!playerIsReady}>Create</Button>
                </Grid>
            </Grid>
        </div>
    )
}