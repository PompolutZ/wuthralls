import React, { useState, useContext } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import DeleteIcon from "@material-ui/icons/Delete";
import FlipIcon from "@material-ui/icons/Loop";
import { FirebaseContext } from "../../../firebase";
import { useAuthUser } from "../../../components/Session";
import Typography from "@material-ui/core/Typography";
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

function ObjectiveHexesPile({ roomId, tokens, onSelectedTokenChange }) {
    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const pointyTokenBaseWidth = 95;
    const [selectedToken, setSelectedToken] = useState(null);

    const handleTokenClick = (token) => () => {
        if (!selectedToken || selectedToken.id !== token.id) {
            setSelectedToken(token);
            onSelectedTokenChange(token);
        } else {
            setSelectedToken(null);
            onSelectedTokenChange(null);
        }
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
            value: `${myself.username} removed feature token from the board.`,
        });
    };

    const handleFlipFeature = (token) => (e) => {
        const updated = {
            ...token,
            isLethal: !token.isLethal,
        };

        e.preventDefault();
        firebase.updateBoardProperty(
            roomId,
            `board.tokens.${token.id}`,
            updated
        );
        firebase.addGenericMessage2(roomId, {
            author: "Katophrane",
            type: "INFO",
            subtype: "PLACEMENT",
            value: `${myself.username} flipped feature token to the ${
                updated.isLethal ? "lethal" : "objective"
            } side.`,
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
                                    ? "drop-shadow(0 0 10px OrangeRed)"
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
                                src={
                                    !token.isLethal
                                        ? `/assets/tokens/feature_front_${token.number}.png`
                                        : `/assets/tokens/feature_back.png`
                                }
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
                            {token.isRevealed &&
                                selectedToken &&
                                selectedToken.id === token.id && (
                                    <ButtonBase
                                        style={{
                                            position: "absolute",
                                            top: "0%",
                                            right: "0%",
                                            backgroundColor: "teal",
                                            color: "white",
                                            width: "2rem",
                                            height: "2rem",
                                            borderRadius: "1.5rem",
                                            boxSizing: "border-box",
                                            border: "2px solid white",
                                        }}
                                        onClick={handleFlipFeature(token)}
                                    >
                                        <FlipIcon
                                            style={{
                                                width: "1rem",
                                                height: "1rem",
                                            }}
                                        />
                                    </ButtonBase>
                                )}
                        </div>
                        <Typography style={{ fontSize: ".7rem" }}>
                            {!token.isRevealed
                                ? `${token.id}`
                                : token.isLethal
                                ? `Lethal ${token.number}`
                                : `Objective ${token.number}`}
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
    );
}

ObjectiveHexesPile.propTypes = {
    roomId: PropTypes.string,
    tokens: PropTypes.array,
    onSelectedTokenChange: PropTypes.func,
};

export default ObjectiveHexesPile;
