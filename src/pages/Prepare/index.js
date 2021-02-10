import React, { useEffect, useState, useContext } from "react";
import { useAuthUser } from "../../components/Session";
import { useLocation, useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import UnknownIcon from "@material-ui/icons/Help";
import { makeStyles } from "@material-ui/core/styles";
import { cardsDb, warbands } from "../../data";
import { FirebaseContext } from "../../firebase";

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

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        margin: "1rem",
    },

    iconImage: {
        width: "2rem",
        height: "2rem",
    },

    factionIcon: {
        width: "4rem",
        height: "4rem",
        fill: "teal",
        color: "white",
    },
}));

function Prepare() {
    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const { state } = useLocation();

    const [selectedFaction, setSelectedFaction] = useState(null);
    const [objectiveCards, setObjectiveCards] = useState("");
    const [powerCards, setPowerCards] = useState("");
    // const [selectedFaction, setSelectedFaction] = useState("hrothgorns-mantrappers");
    // const [objectiveCards, setObjectiveCards] = useState(`06172,06162,06295,06164,07001,06165,03384,06167,06311,03357,03368,06316`);
    // const [powerCards, setPowerCards] = useState(`06191,06181,06182,06184,06395,06175,06176,06187,06364,06398,07014,06189,06388,06179,03420,06434,03400,06403,03401,06417`);

    const [primacy, setPrimacy] = useState(false);
    const [playerIsReady, setPlayerIsReady] = useState(false);
    const [deck, setDeck] = useState("");

    useEffect(() => {
        if (!objectiveCards && !powerCards) return;

        const objectives = objectiveCards && objectiveCards.split(",");
        const powers = powerCards && powerCards.split(",");
        const allCards = [...objectives, ...powers].map(
            (cardId) => cardsDb[cardId]
        );
        let { faction } = allCards.find((card) => card.faction !== "universal");
        console.log(state);

        let anyPrimacyCards = allCards.some((card) => card.primacy);
        if (anyPrimacyCards) {
            setPrimacy(true);
        }

        if (faction && objectives.length === 12 && powers.length >= 20) {
            setSelectedFaction(faction);
            setPlayerIsReady(true);
        }
    }, [objectiveCards, powerCards]);

    const handleDeckChange = (e) => {
        const value = e.target.value;
        const [objectives, powers] = JSON.parse(value);
        if (objectives && objectives.length === 12) {
            setObjectiveCards(objectives.join());
        }

        if (powers && powers.length >= 20) {
            setPowerCards(powers.join());
        }

        setDeck("Deck copy was successful!");
    };

    const handleJoinTheRoom = async () => {
        const playerInfo = {
            name: myself.username,
            faction: selectedFaction,
            oDeck: shuffle(objectiveCards.split(",")).join(),
            pDeck: shuffle(powerCards.split(",")).join(),
            gloryScored: 0,
            glorySpent: 0,
            activationsLeft: 4,
        };

        const myWarband = warbands[selectedFaction].reduce(
            (r, fighter, idx) => ({ ...r, [`${myself.uid}_F${idx}`]: fighter }),
            {}
        );

        let primacyInfo = undefined;
        if (primacy || state.status.primacy) {
            primacyInfo = [...state.players, myself.uid].reduce(
                (info, uid) => ({ ...info, [uid]: false }),
                {}
            );
        }

        await firebase.addPlayerToRoom(
            state.id,
            myself.uid,
            playerInfo,
            {
                ...state.board.fighters,
                ...myWarband,
            },
            primacyInfo
        );

        history.push("/");
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography>
                        Copy paste your deck from YAWUDB. In order to do so,
                        navigate to the deck, then select Export to WUnderworlds
                        Club on desktop or Copy to WUnderworlds Club on mobile
                        via action menu (with three dots). Faction will be
                        determined automatically.
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={12}
                    container
                    alignItems="center"
                    direction="column"
                >
                    <Typography variant="h6">Faction</Typography>
                    {selectedFaction ? (
                        <div>
                            <img
                                className={classes.factionIcon}
                                src={`/assets/factions/${selectedFaction}-icon.png`}
                            />
                            {primacy && (
                                <img
                                    className={classes.factionIcon}
                                    src={`/assets/other/Primacy.png`}
                                />
                            )}
                        </div>
                    ) : (
                        <UnknownIcon className={classes.factionIcon} />
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Deck</Typography>
                    <Divider />
                    <TextField
                        fullWidth
                        type="text"
                        multiline
                        value={deck}
                        placeholder={
                            !deck ? "Paste you deck here" : "Paste successful"
                        }
                        onChange={handleDeckChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleJoinTheRoom}
                        disabled={!playerIsReady}
                    >
                        Join
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default Prepare;
