import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
    useMyGameState,
    useTheirGameState,
} from "../../hooks/playerStateHooks";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        margin: theme.spacing(2),
    },

    img: {
        width: "2rem",
        height: "2rem",
        marginRight: theme.spacing(1),
    },

    h6: {
        color: "white",
    },
}));

function PlayerNameAndFaction({ name, faction }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <img
                className={classes.img}
                src={`/assets/factions/${faction}-icon.png`}
            />

            <Typography className={classes.h6} variant="h6">
                {name}
            </Typography>
        </div>
    );
}

function MyNameAndFaction() {
    const name = useMyGameState((state) => state.name);
    const faction = useMyGameState((state) => state.faction);

    return <PlayerNameAndFaction name={name} faction={faction} />;
}

function OpponentNameAndFaction() {
    const name = useTheirGameState((state) => state.name);
    const faction = useTheirGameState((state) => state.faction);

    return <PlayerNameAndFaction name={name} faction={faction} />;
}

export { MyNameAndFaction, OpponentNameAndFaction };
