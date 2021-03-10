import React from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useMyGameState } from "../../hooks/playerStateHooks";
import useUpdateRoom from "../../hooks/useUpdateRoom";
import {
    useFightersInfo,
    useGameRound,
    useRoomInfo,
} from "../../hooks/gameStateHooks";
import useUpdateGameLog from "../../hooks/useUpdateGameLog";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: theme.palette.primary.main,
        width: "2rem",
        height: "2rem",
        borderRadius: "1.5rem",
        color: "white",
        boxSizing: "border-box",
        borderBottom: "3px solid rgba(0,0,0,.2)",
        filter: "drop-shadow(0px 2px 2px rgba(0,0,0,1))",
        margin: theme.spacing(1),
        "&:active": {
            borderBottom: "none",
            filter: "none",
        },
    },

    imgContainer: {
        margin: `${theme.spacing(2)}px 0`,
        display: "flex",
        position: "relative",
        width: "5rem",
        height: "5rem",
        borderRadius: "4rem",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "3px solid rgba(0,0,0,.2)",
        filter: "drop-shadow(0px 2px 2px rgba(0,0,0,1))",
    },

    backgroundImage: {
        backgroundImage: `url(/assets/other/roundToken.png)`,
        backgroundPosition: "center, center",
        backgroundSize: "cover",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        opacity: ".9",
        zIndex: -1,
    },

    roundValue: {
        color: "white",
        fontSize: "4rem",
        fontWeight: "bold",
        opacity: 0.7,
    },
}));

export default function RoundCounter() {
    const classes = useStyles();
    const playerIds = useRoomInfo((room) => room.players);
    const round = useGameRound((state) => state.round);
    const setRound = useGameRound((state) => state.setRound);
    const updateRoom = useUpdateRoom();
    const updateGameLog = useUpdateGameLog();
    const myName = useMyGameState((my) => my.name);
    const fighterIds = useFightersInfo((state) => Object.keys(state));

    // TODO: Remove tokens from fighters
    const handleChangeValue = (changeBy) => () => {
        const nextRound = round + changeBy;
        setRound(nextRound);

        const fightersWithoutTokens = fighterIds.reduce(
            (fightersPayload, fighterId) => ({
                ...fightersPayload,
                [`board.fighters.${fighterId}.tokens`]: "",
            }),
            {}
        );

        const playersWithRestoredActivations = playerIds.reduce(
            (r, p) => ({ ...r, [`${p}.activationsLeft`]: 4 }),
            {}
        );

        updateRoom({
            [`status.round`]: nextRound,
            ...playersWithRestoredActivations,
            ...fightersWithoutTokens,
        });
        updateGameLog(`${myName} has started round ${nextRound}.`);
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <ButtonBase
                className={classes.button}
                onClick={handleChangeValue(-1)}
                disabled={round <= 1}
            >
                <RemoveIcon />
            </ButtonBase>
            <div className={classes.imgContainer}>
                <div className={classes.roundValue}>{round}</div>
                <div className={classes.backgroundImage} />
            </div>
            <ButtonBase
                className={classes.button}
                onClick={handleChangeValue(1)}
                disabled={round >= 3}
            >
                <AddIcon />
            </ButtonBase>
        </div>
    );
}
