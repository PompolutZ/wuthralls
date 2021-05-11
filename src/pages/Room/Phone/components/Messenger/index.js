import React, { useState, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import PropTypes from "prop-types";
import { useAddCurrentPlayerMessage } from "../../../hooks/useUpdateGameLog";
import { makeStyles, fade } from "@material-ui/core/styles";
import { useTheirGameState } from "../../../hooks/playerStateHooks";
import ServicePicker from "./ServicePicker";
import Telegram from "./Telegram";
import { DiceRoller } from "./DiceRoller";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: "flex",
        padding: "1rem .5rem",
        flexDirection: "column",
    },

    message: {
        flex: 1,
    },

    sendButton: (props) => ({
        color: "rgba(255,255,255, .9)",
    }),
}));

const useStylesInput = makeStyles((theme) => ({
    root: {
        overflow: "hidden",
        borderRadius: ".5rem",
        backgroundColor: "#363a3e",
        color: "#b8bbbe",
        padding: ".5rem .75rem",
        "&:hover": {
            backgroundColor: "#363a3e",
        },
        "&$focused": {
            backgroundColor: "#363a3e",
            boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
        },
    },
}));

const services = {
    Telegram: <Telegram />,
    AttackDiceTray: <DiceRoller type="ATTACK" />,
    DefenceDiceTray: <DiceRoller type="DEFENCE" />,
    MagicDiceTray: <DiceRoller type="MAGIC" />,
    InitiativeDiceTray: <DiceRoller type="INITIATIVE" />,
};

function Messenger() {
    const classes = useStyles();
    const [activeService, setActiveService] = useState("AttackDiceTray");

    return (
        <div className={classes.root}>
            <ServicePicker onPickService={setActiveService} />
            {services[activeService]}
        </div>
    );
}

export default Messenger;
