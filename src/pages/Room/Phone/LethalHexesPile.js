import React, { useState, useEffect, useContext } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { FirebaseContext } from "../../../firebase";
import { useAuthUser } from "../../../components/Session";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
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

export default function LethalHexesPile({
    roomId,
    tokens,
    onSelectedTokenChange,
}) {
    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const pointyTokenBaseWidth = 95;
    const [selectedToken, setSelectedToken] = useState(null);

    const handleTokenClick = token => () => {
        setSelectedToken(token);
        onSelectedTokenChange(token);
    };

    useEffect(() => {
        console.log("LethalHexesPile.OnUpdated", selectedToken);
    }, [selectedToken]);

    const handleRemoveFromBoard = token => e => {
        console.log("Request remove token", token);
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
                {tokens.map(token => (
                    <div
                        key={token.id}
                        style={{
                            marginRight: "1rem",
                            paddingTop: "1rem",
                            paddingLeft: "1rem",
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
                                src={`/assets/tokens/lethal.png`}
                                style={{ width: "100%" }}
                            />
                            <div
                                style={{
                                    boxShadow:
                                        selectedToken &&
                                        selectedToken.id === token.id
                                            ? "0 0 25px 10px magenta"
                                            : "",
                                    borderRadius: pointyTokenBaseWidth,
                                    width: pointyTokenBaseWidth * 0.5,
                                    height: pointyTokenBaseWidth * 0.5,
                                    position: "absolute",
                                    zIndex: -1,
                                    top: "50%",
                                    left: "50%",
                                    marginTop:
                                        (-pointyTokenBaseWidth * 0.5) / 2,
                                    marginLeft:
                                        (-pointyTokenBaseWidth * 0.5) / 2,
                                }}
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
