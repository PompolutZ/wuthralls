import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useMyGameState } from "../../../../../hooks/playerStateHooks";
import { warbandColors } from "../../../../../../../data";

const useStyles = makeStyles(() => ({
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

function DiceTray({ diceOnTheTray = [], onChangeDiceAmount, children }) {
    const maxAmountOfDiceToRoll = 7;
    const classes = useStyles();
    const myFaction = useMyGameState((state) => state.faction);

    const setCloneProps = (value) => ({
        accentColorHex: warbandColors[myFaction],
        size: 36,
        useBlackOutline:
            myFaction === "zarbags-gitz" || myFaction === "khagras-ravagers",
        side: value,
    });

    return (
        <div className={classes.diceContainer}>
            {diceOnTheTray
                .sort((x, y) => y - x)
                .map((value, i) => (
                    <div
                        className={classes.dieWrapper}
                        key={i}
                        style={{}}
                        onClick={() => onChangeDiceAmount(i + 1)}
                    >
                        {React.cloneElement(children, setCloneProps(value))}
                    </div>
                ))}
            {new Array(maxAmountOfDiceToRoll - diceOnTheTray.length)
                .fill(1)
                .map((value, i) => (
                    <div
                        className={classes.dieWrapper}
                        key={i * 31}
                        onClick={() =>
                            onChangeDiceAmount(diceOnTheTray.length + i + 1)
                        }
                        style={{ opacity: 0.2 }}
                    >
                        {React.cloneElement(children, setCloneProps(value))}
                    </div>
                ))}
        </div>
    );
}

DiceTray.propTypes = {
    diceOnTheTray: PropTypes.array,
    onChangeDiceAmount: PropTypes.func,
    children: PropTypes.element.isRequired,
};

export default DiceTray;
