import React from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
    host: {
        display: "flex",
        margin: "1rem 0 0 auto",
        boxSizing: "border-box",
        border: ".25rem solid gray",
        backgroundColor: "gray",
        borderRadius: ".25rem",
        position: "relative",
    },

    indicator: {
        position: "absolute",
        top: 0,
        left: 0,
        color: "white",
        background: "gray",
        width: "1rem",
        height: "1rem",
        zIndex: 1,
        marginLeft: "-0.75rem",
        marginTop: "-0.75rem",
    },

    img: ({ variant }) => ({
        userSelect: "none",
        width: "3rem",
        height: "3rem",
        boxSizing: "border-box",
        borderRadius: variant === "circular" ? "3rem" : "1px",
        border: "1px solid dimgray",
        margin: "0 .25rem",
        filter: "drop-shadow(0px 2px 2px black)",

        "&:active": {
            filter: "none",
        },
    }),
}));

function TokenButton({ token, onClick, variant = "rectangular" }) {
    const classes = useStyles({ variant });

    return (
        <ButtonBase onClick={() => onClick(token)}>
            <img className={classes.img} src={`/assets/other/${token}.png`} />
        </ButtonBase>
    );
}

function TokensDrawPile({ tokens, variant, onClick }) {
    const classes = useStyles();

    return (
        <div className={classes.host}>
            <AddIcon className={classes.indicator} />
            {tokens.map((token) => (
                <TokenButton
                    key={token}
                    variant={variant}
                    token={token}
                    onClick={onClick}
                />
            ))}
        </div>
    );
}

export default TokensDrawPile;
