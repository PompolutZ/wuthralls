import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/core/styles";
import { useMyGameState } from "../../../../../hooks/playerStateHooks";
import { useDiceRoll } from "../../../../../hooks/useUpdateGameLog";
import { getDieRollResult } from "../../../../../../../utils";
import DefenceDie from "../../../../../../../components/DefenceDie";
import AttackDie from "../../../../../../../components/AttackDie";
import { warbandColors } from "../../../../../../../data";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        position: "relative",
        "&::-webkit-scrollbar-thumb": {
            width: "10px",
            height: "10px",
        },
        display: "flex",
    },

    sendButton: {
        color: "rgba(255,255,255, .9)",
    },

    diceContainer: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        background: "#363a3e",
        padding: "1rem .5rem",
    },

    dieWrapper: {
        background: "#fcfcfc",
        borderRadius: ".5rem",
        margin: "0 .25rem",
        opacity: 1,
        cursor: "pointer",
    },
}));

function InitiativeRoller() {
    const [values, setValues] = useState([1, 1, 1, 1]);
    const classes = useStyles();
    const myFaction = useMyGameState((state) => state.faction);
    const sendRollResult = useDiceRoll();

    const getDieProps = (value) => ({
        accentColorHex: warbandColors[myFaction],
        size: 36,
        useBlackOutline:
            myFaction === "zarbags-gitz" || myFaction === "khagras-ravagers",
        side: value,
    });

    const handleSendTextMessage = async () => {
        const rollResult = values.map(getDieRollResult);
        setValues(rollResult);

        sendRollResult("INITIATIVE", rollResult);
    };

    return (
        <div className={classes.root}>
            <div className={classes.diceContainer}>
                {values.length > 0 &&
                    values.map((x, i) => (
                        <div className={classes.dieWrapper} key={i}>
                            {i % 2 === 0 && <DefenceDie {...getDieProps(x)} />}
                            {i % 2 !== 0 && <AttackDie {...getDieProps(x)} />}
                        </div>
                    ))}
            </div>
            <Button
                className={classes.sendButton}
                onClick={handleSendTextMessage}
            >
                <SendIcon />
            </Button>
        </div>
    );
}

export default InitiativeRoller;
