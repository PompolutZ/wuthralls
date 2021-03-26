import React from "react";
import PropTypes from "prop-types";
import {
    SingleAssist,
    DefenceDodge,
    DefenceBlock,
    DoubleAssist,
    Crit,
} from "./CommonSVGs";
import { makeStyles } from "@material-ui/core/styles";
import { hexToRgb } from "../utils";

const useStyles = makeStyles({
    core: ({ size, useBlackOutline, accentColorHex }) => ({
        width: size,
        height: size,
        display: "flex",
        boxSizing: "border-box",
        border: `2px solid ${useBlackOutline ? "black" : accentColorHex}`,
        borderRadius: size * 0.2,
        backgroundColor: useBlackOutline ? "black" : hexToRgb(accentColorHex),
    }),

    symbol: ({ size, useBlackOutline, accentColorHex }) => ({
        margin: "auto",
        width: size * 0.8,
        height: size * 0.8,
        color: useBlackOutline ? hexToRgb(accentColorHex) : "white",
    }),
});

function SideToSymbol({ side, className }) {
    const value = Number(side);
    switch (value) {
        case 1:
            return <SingleAssist className={className} />;
        case 2:
            return <DefenceDodge className={className} />;
        case 3:
            return <DefenceBlock className={className} />;
        case 4:
            return <DefenceBlock className={className} />;
        case 5:
            return <DoubleAssist className={className} />;
        default:
            return <Crit className={className} />;
    }
}

SideToSymbol.propTypes = {
    side: PropTypes.number,
    className: PropTypes.string,
};

function DefenceDie(props) {
    const classes = useStyles(props);
    return (
        <div className={classes.core}>
            <SideToSymbol className={classes.symbol} {...props} />
        </div>
    );
}

DefenceDie.propTypes = {
    side: PropTypes.number,
    accentColorHex: PropTypes.string,
    size: PropTypes.number,
    useBlackOutline: PropTypes.bool,
};

export default DefenceDie;
