import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { getDieRollResult } from "../../../../../../../utils";
import { useDiceRoll } from "../../../../../hooks/useUpdateGameLog";
import DiceTray from "./DiceTray";
import { DiceVariants } from "./DiceVariants";

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
}));

export function DiceRoller({ type, initialAmount = 0 }) {
    const classes = useStyles();
    const [values, setValues] = useState(new Array(initialAmount).fill(1));
    const sendRollResult = useDiceRoll();

    const handleSendRollResult = () => {
        const rollResult = values.map(getDieRollResult);
        setValues(rollResult);

        sendRollResult(type, rollResult);
    };

    return (
        <div className={classes.root}>
            <DiceTray
                diceOnTheTray={values}
                onChangeDiceAmount={(count) =>
                    setValues(new Array(count).fill(1))
                }
            >
                {DiceVariants[type]}
            </DiceTray>
            <Button
                className={classes.sendButton}
                onClick={handleSendRollResult}
            >
                <SendIcon />
            </Button>
        </div>
    );
}

DiceRoller.propTypes = {
    type: PropTypes.oneOf(["ATTACK", "DEFENCE", "MAGIC"]),
    initialAmount: PropTypes.number,
};

export default DiceRoller;
