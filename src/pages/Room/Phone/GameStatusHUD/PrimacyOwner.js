import React from "react";
import Divider from "@material-ui/core/Divider";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    img: ({ owned }) => ({
        width: "2rem",
        height: "2rem",
        opacity: owned ? 1 : 0.5,
        margin: `${theme.spacing(1) / 2}px 0`,
        cursor: "pointer",
        filter: "drop-shadow(0px 2px 4px rgba(0,0,0,.8))",
        transform: `${owned ? "scale(1.3)" : "scale(1)"}`,
        transition: "transform .3s ease-out",
    }),
}));
function PrimacyToken({ owned, toggleOwnership }) {
    const classes = useStyles({ owned });

    return (
        <img
            className={classes.img}
            src="/assets/other/Primacy.png"
            onClick={() => toggleOwnership()}
        />
    );
}

function PrimacyOwner({ ownership, me, onOwnershipChange }) {
    const [[opponent, hasPrimacy]] = Object.entries(ownership).filter(
        ([k]) => k !== me
    );

    const handleClaimPrimacy = (owner) => () => {
        const payload = {
            [me]: false,
            [opponent]: false,
        };

        payload[owner] = true;
        onOwnershipChange(payload);
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                margin: "0 1rem",
            }}
        >
            <PrimacyToken
                owned={ownership[me]}
                toggleOwnership={handleClaimPrimacy(me)}
            />
            <Divider />
            <PrimacyToken
                owned={hasPrimacy}
                toggleOwnership={handleClaimPrimacy(opponent)}
            />
        </div>
    );
}

PrimacyOwner.propTypes = {
    ownership: PropTypes.object,
    me: PropTypes.string,
    onOwnershipChange: PropTypes.func,
};

export default PrimacyOwner;
