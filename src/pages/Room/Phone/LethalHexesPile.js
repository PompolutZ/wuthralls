import React, { useState, useContext } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { FirebaseContext } from "../../../firebase";
import { useAuthUser } from "../../../components/Session";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        position: "relative",
        "&::-webkit-scrollbar-thumb": {
            width: "10px",
            height: "10px",
        },
    },

    itemsContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        overflow: "auto",
    },
}));

function LethalHexesPile({ roomId, tokens, onSelectedTokenChange }) {
    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const pointyTokenBaseWidth = 95;
    const [selectedToken, setSelectedToken] = useState(null);

    const handleTokenClick = (token) => () => {
        setSelectedToken(token);
        onSelectedTokenChange(token);
    };

    const handleRemoveFromBoard = (token) => (e) => {
        e.preventDefault();
        firebase.updateBoardProperty(roomId, `board.tokens.${token.id}`, {
            ...token,
            isOnBoard: false,
            left: 0,
            top: 0,
            onBoard: { x: -1, y: -1 },
        });
        firebase.addGenericMessage2(roomId, {
            author: "Katophrane",
            type: "INFO",
            subtype: "PLACEMENT",
            value: `${myself.username} removed lethal hex token from the board.`,
        });
    };

    return (
        <div className={classes.root}>
            <div className={classes.itemsContainer}>
                {tokens.map((token) => (
                    <div
                        key={token.id}
                        style={{
                            marginRight: "1rem",
                            paddingTop: "1rem",
                            paddingLeft: "1rem",
                            filter:
                                selectedToken && selectedToken.id === token.id
                                    ? "drop-shadow(0 0 10px magenta)"
                                    : "",
                            transition: "all .175s ease-out",
                        }}
                        onClick={handleTokenClick(token)}
                    >
                        <div
                            style={{
                                width: pointyTokenBaseWidth * 0.7,
                                position: "relative",
                            }}
                        >
                            <img
                                alt="lethal_hex"
                                src={`/assets/tokens/lethal.png`}
                                style={{ width: "100%" }}
                            />
                            {selectedToken && selectedToken.id === token.id && (
                                <ButtonBase
                                    style={{
                                        position: "absolute",
                                        bottom: "0%",
                                        right: "0%",
                                        backgroundColor: "red",
                                        color: "white",
                                        width: "2rem",
                                        height: "2rem",
                                        borderRadius: "1.5rem",
                                        boxSizing: "border-box",
                                        border: "2px solid white",
                                    }}
                                    onClick={handleRemoveFromBoard(token)}
                                >
                                    <DeleteIcon
                                        style={{
                                            width: "1rem",
                                            height: "1rem",
                                        }}
                                    />
                                </ButtonBase>
                            )}
                        </div>
                        <Typography>{`${token.id}`}</Typography>
                    </div>
                ))}
            </div>
        </div>
    );
}

LethalHexesPile.propTypes = {
    roomId: PropTypes.string,
    tokens: PropTypes.array,
    onSelectedTokenChange: PropTypes.func,
};

export default LethalHexesPile;
