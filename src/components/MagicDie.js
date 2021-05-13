import React from "react";
import PropTypes from "prop-types";
import { MagicChannel, MagicFocus, Crit } from "./CommonSVGs";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    core: ({ size }) => {
        return {
            width: size,
            height: size,
            display: "flex",
            boxSizing: "border-box",
            border: `2px solid indigo`,
            borderRadius: size * 0.2,
            background:
                "linear-gradient(212deg, rgba(255,255,255,1) 0%, rgba(195,251,77,1) 20%, rgba(18,255,225,1) 80%, rgba(255,255,255,1) 100%)",
        };
    },

    symbol: ({ size }) => ({
        margin: "auto",
        width: size * 0.8,
        height: size * 0.8,
        color: "indigo",
    }),
});

function SideToSymbol({ side, className }) {
    const value = Number(side);
    switch (value) {
        case 1:
            return <MagicChannel className={className} />;
        case 2:
            return <MagicFocus className={className} />;
        case 3:
            return <MagicChannel className={className} />;
        case 4:
            return <MagicFocus className={className} />;
        case 5:
            return <MagicChannel className={className} />;
        default:
            return <Crit className={className} />;
    }
}

SideToSymbol.propTypes = {
    side: PropTypes.number,
    className: PropTypes.string,
};

function MagicDie(props) {
    const classes = useStyles(props);
    return (
        <div className={classes.core}>
            <SideToSymbol className={classes.symbol} {...props} />
        </div>
    );
}

MagicDie.propTypes = {
    side: PropTypes.number,
    size: PropTypes.number,
};

export default MagicDie;
