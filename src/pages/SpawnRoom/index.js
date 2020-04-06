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
    const [selectedFaction, setSelectedFaction] = useState(null); //useState("hrothgorns-mantrappers");
    const [objectiveCards, setObjectiveCards] = useState(''); //useState(`06172,06162,06295,06164,07001,06165,03384,06167,06311,03357,03368,06316`);
    const [powerCards, setPowerCards] = useState(''); //useState(`06191,06181,06182,06184,06395,06175,06176,06187,06364,06398,07014,06189,06388,06179,03420,06434,03400,06403,03401,06417`);
    const [playerIsReady, setPlayerIsReady] = useState(false);
    const [roomName, setRoomName] = useState(''); //useState(`DEV ${Math.ceil(100 * Math.random())}`);
    const [deck, setDeck] = useState('');

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

    const handleDeckChange = e => {
        const value = e.target.value;
        const [objectives, powers] = JSON.parse(value);
        if(objectives && objectives.length === 12) {
            console.log(objectives.join());
            setObjectiveCards(objectives.join());
        }

        if(powers && powers.length >= 20) {
            console.log(powers.join());
            setPowerCards(powers.join());
        }

        setDeck('Deck copy was successful!');
    }

    const handleRoomNameChange = e => {
        setRoomName(e.target.value);
    }

    const createNewRoom = async () => {
        console.log(selectedFaction);
        const featureHexTokens = shuffle(featureTokens).reduce((r, token, idx) => ({ ...r, [`Feature_${idx}`]: token }), {});
        const lethalHexes = lethalHexTokens.reduce((r, token, idx) => ({ ...r, [`Lethal_${idx}`]: token }), {});
        const myWarband = warbands[selectedFaction].reduce((r, fighter, idx) => ({ ...r, [`${myself.uid}_F${idx}`]: fighter }), {});

        const payload = {
            name: roomName,
            createdBy: myself.uid,
            status: {
                round: 1,
                stage: "SETUP",
                waitingFor: [myself.uid],
                waitingReason: 'WAITING_FOR_OPPONENT',
                rollOffs: {
                    [`${myself.uid}_1`]: "",
                },
                rollOffNumber: 1,
                orientation: "HORIZONTAL",
                top: {
                    id: -1,
                    rotate: 0,
                },
                bottom: {
                    id: -1,
                    rotate: 0
                }
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
                    <Typography variant="body2">Copy paste your deck from YAWUDB. In order to do so, navigate to the deck, then select Export to WUnderworlds Club on desktop or Copy to WUnderworlds Club on mobile via action menu (with three dots).  Faction will be determined automatically.</Typography>
                </Grid>
                <Grid item xs={12} container alignItems="center" direction="column" lg={4}>
                    <Typography variant="h6">Faction</Typography>
                    {
                        selectedFaction 
                        ? <img className={classes.factionIcon} src={`/assets/factions/${selectedFaction}-icon.png`} />
                        : <UnknownIcon className={classes.factionIcon} />
                    }
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Typography variant="h6">Deck</Typography>
                    <Divider />
                    <TextField 
                        fullWidth 
                        type="text"
                        multiline
                        value={deck}
                        placeholder={!Boolean(deck) ? 'Paste you deck here' : 'Paste successful'}
                        onChange={handleDeckChange} />
                </Grid>
                {/* <Grid item xs={12} lg={4}>
                    <Typography variant="h6">Power cards pile</Typography>
                    <Divider />
                    <TextField 
                        fullWidth 
                        type="text"
                        multiline
                        value={powerCards}
                        onChange={handlePowerCardsChange} />
                </Grid> */}
                <Grid item xs={12} lg={4}>
                    <Button variant="contained" color="primary" onClick={createNewRoom} disabled={!playerIsReady}>Create</Button>
                </Grid>
            </Grid>
        </div>
    )
}