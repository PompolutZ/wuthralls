import React, { useState, useContext } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import FlipIcon from "@material-ui/icons/Loop";
import MoreIcon from "@material-ui/icons/MoreHoriz";
import { FirebaseContext } from "../../../firebase";
import { useAuthUser } from "../../../components/Session";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { sortByIdAsc } from "../../../utils";

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

    const handleFlipFeature = (token) => {
        const updated = {
            ...token,
            isLethal: !token.isLethal,
        };

        if (token.counter) {
            updated.counter = null;
        }

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

    const handleDesecrate = ({ token, desecration }) => {
        const updated = {
            ...token,
            counter: desecration,
        };

        firebase.updateBoardProperty(
            roomId,
            `board.tokens.${token.id}`,
            updated
        );
        firebase.addGenericMessage2(roomId, {
            author: "Katophrane",
            type: "INFO",
            subtype: "PLACEMENT",
            value: `${myself.username} has **desecrated** objective ${token.number}.`,
        });
    };

    const handleRemoveDesecration = (token) => {
        const updated = {
            ...token,
            counter: null,
        };

        firebase.updateBoardProperty(
            roomId,
            `board.tokens.${token.id}`,
            updated
        );
        firebase.addGenericMessage2(roomId, {
            author: "Katophrane",
            type: "INFO",
            subtype: "PLACEMENT",
            value: `${myself.username} has removed **desecration** token from objective ${token.number}.`,
        });
    };

    return (
        <div className={classes.root}>
            <div className={classes.itemsContainer}>
                {tokens.sort(sortByIdAsc).map((token) => (
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
                                style={{
                                    width: "100%",
                                    opacity: token.counter ? ".5" : 1,
                                }}
                            />
                            {token.counter && (
                                <img
                                    src={`/assets/other/${token.counter}.png`}
                                    style={{
                                        width: "3rem",
                                        height: "3rem",
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        margin: "-1.5rem 0 0 -1.5rem",
                                    }}
                                />
                            )}

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

                            <FeatureHexActions
                                token={token}
                                onDesecrate={handleDesecrate}
                                onRemoveDesecration={handleRemoveDesecration}
                                onFlip={handleFlipFeature}
                            />
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

function FeatureHexActions({
    token,
    onDesecrate,
    onRemoveDesecration,
    onFlip,
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        if (anchorEl) {
            setAnchorEl(null);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDesecrate = (desecration) => () => {
        onDesecrate({ token, desecration });
        handleClose();
    };

    const handleFlipFeature = () => {
        onFlip(token);
        handleClose();
    };

    const handleRemoveDesecration = () => {
        onRemoveDesecration(token);
        handleClose();
    };

    return (
        <>
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
                onClick={handleClick}
            >
                <MoreIcon
                    style={{
                        width: "1rem",
                        height: "1rem",
                    }}
                />
            </ButtonBase>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleFlipFeature}>
                    <FlipIcon /> Flip Feature
                </MenuItem>
                <Divider />
                {token.counter && (
                    <MenuItem onClick={handleRemoveDesecration}>
                        <AddIcon style={{ transform: "rotate(45deg)" }} />
                        Remove Desecration
                    </MenuItem>
                )}
                {!token.counter && (
                    <div>
                        <MenuItem onClick={handleDesecrate("Desecration1")}>
                            <img
                                src="/assets/other/Desecration1.png"
                                style={{ width: "1rem", height: "1rem" }}
                            />
                            Desecrate Yellow
                        </MenuItem>
                        <MenuItem onClick={handleDesecrate("Desecration2")}>
                            <img
                                src="/assets/other/Desecration2.png"
                                style={{ width: "1rem", height: "1rem" }}
                            />
                            Desecrate Green
                        </MenuItem>
                    </div>
                )}
            </Menu>
        </>
    );
}

FeatureHexActions.propTypes = {
    token: PropTypes.object,
    onDesecrate: PropTypes.func,
    onRemoveDesecration: PropTypes.func,
    onFlip: PropTypes.func,
};

export default ObjectiveHexesPile;
