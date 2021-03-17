import React, { useState, useEffect, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import AddIcon from "@material-ui/icons/Add";
import InspireIcon from "@material-ui/icons/TrendingUp";
import UninspireIcon from "@material-ui/icons/TrendingDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { cardsDb } from "../../../../data";
import { FirebaseContext } from "../../../../firebase";
import { useAuthUser } from "../../../../components/Session";
import DrawCardsIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import WoundsCounter from "./WoundsCounter";
import UpgradePicker from "./UpgradePicker";
import useUpdateRoom from "../../hooks/useUpdateRoom";
import HUDOverlay from "../../../../components/HUDOverlay";
import { useFightersInfo } from "../../hooks/gameStateHooks";
import {
    useMyGameState,
    useTheirGameState,
} from "../../hooks/playerStateHooks";
import shallow from "zustand/shallow";

const cardImageWidth = 300;
const cardImageHeight = 420;

// To decide where actually should we hold state
// Should we use zustand hook to control individual fighter state globally or
// control it here. Later makes sense if we batch update fighter info.
function FighterHUD({ data, fighterId, onClose }) {
    const updateRoom = useUpdateRoom();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const fighter = useFightersInfo((info) => info[fighterId]);
    console.log(fighter);
    // const { roomId } = data;
    const [upgrades, setUpgrades] = useState(
        fighter.upgrades ? fighter.upgrades.split(",") : []
    ); //Object.keys(data.upgrades)
    const playerInfo = useMyGameState((state) => state, shallow);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [upgradePickerOpen, setUpgradePickerOpen] = useState(false);
    const [isInspired, setIsInspired] = useState(fighter.isInspired);
    const [addTokenAnchor, setAddTokenAnchor] = useState(null);
    const [addCounterAnchor, setAddCounterAnchor] = useState(null);
    const [tokens, setTokens] = useState(
        fighter.tokens ? fighter.tokens.split(",") : []
    );
    const [counters, setCounters] = useState(
        fighter.counters ? fighter.counters.split(",") : []
    );

    // ===== NEW STUFF
    const [modified, setModified] = useState(false);
    const [payload, setPayload] = useState({});

    // ===============

    // useEffect(() => {
    //     // firebase.updateBoardProperty(
    //     //     roomId,
    //     //     `board.fighters.${data.id}.isInspired`,
    //     //     isInspired
    //     // );
    // }, [isInspired]);

    const handleCloseOverlay = () => {
        updateRoom(payload);
        onClose();
    };

    const handleOpenAddTokenMenu = (e) => {
        setAddTokenAnchor(e.currentTarget);
    };

    const handleOpenAddCounterMenu = (e) => {
        setAddCounterAnchor(e.currentTarget);
    };

    const handleCloseAddTokenMenu = () => {
        setAddTokenAnchor(null);
    };

    const handleCloseAddCounterMenu = () => {
        setAddCounterAnchor(null);
    };

    const handleAddTokenAndCloseMenu = (token) => () => {
        // setAddTokenAnchor(null);
        // const updatedTokens = [...tokens, token];
        // setTokens(updatedTokens);
        // firebase.updateBoardProperty(
        //     roomId,
        //     `board.fighters.${data.id}.tokens`,
        //     updatedTokens.join()
        // );
        // firebase.addGenericMessage2(roomId, {
        //     author: "Katophrane",
        //     type: "INFO",
        //     subtype: "ADD_TOKEN",
        //     cardId: token,
        //     value: `${playerInfo.name} gives ${data.name} ${token} token.`,
        // });
    };

    const handleAddCounterAndCloseMenu = (counter) => () => {
        // setAddCounterAnchor(null);
        // const updatedCounters = [...counters, counter];
        // setCounters(updatedCounters);
        // firebase.updateBoardProperty(
        //     roomId,
        //     `board.fighters.${data.id}.counters`,
        //     updatedCounters.join()
        // );
        // firebase.addGenericMessage2(roomId, {
        //     author: "Katophrane",
        //     type: "INFO",
        //     subtype: "ADD_COUNTER",
        //     cardId: counter,
        //     value: `${playerInfo.name} gives ${data.name} ${counter} counter.`,
        // });
    };

    const handleRemoveTokenAt = (index) => () => {
        // const tokenToRemove = tokens[index];
        // if (!tokenToRemove) return;
        // const updatedTokens = [
        //     ...tokens.slice(0, index),
        //     ...tokens.slice(index + 1),
        // ];
        // setTokens(updatedTokens);
        // firebase.updateBoardProperty(
        //     roomId,
        //     `board.fighters.${data.id}.tokens`,
        //     updatedTokens.join()
        // );
        // firebase.addGenericMessage2(roomId, {
        //     author: "Katophrane",
        //     type: "INFO",
        //     subtype: "REMOVE_TOKEN",
        //     cardId: tokenToRemove,
        //     value: `${playerInfo.name} removes ${tokenToRemove} token from ${data.name}.`,
        // });
    };

    const handleRemoveCounterAt = (index) => () => {
        // const counterToRemove = counters[index];
        // if (!counterToRemove) return;
        // const updatedCounters = [
        //     ...counters.slice(0, index),
        //     ...counters.slice(index + 1),
        // ];
        // setCounters(updatedCounters);
        // firebase.updateBoardProperty(
        //     roomId,
        //     `board.fighters.${data.id}.counters`,
        //     updatedCounters.join()
        // );
        // firebase.addGenericMessage2(roomId, {
        //     author: "Katophrane",
        //     type: "INFO",
        //     subtype: "REMOVE_COUNTER",
        //     cardId: counterToRemove,
        //     value: `${playerInfo.name} removes ${counterToRemove} counter from ${data.name}.`,
        // });
    };

    const handleBringToFront = (id) => () => {
        setSelectedCardId(id);
    };

    const handleCloseSelection = () => {
        setSelectedCardId(null);
    };

    const openUpgradePicker = () => {
        if (!fighter.isOnBoard) return;
        setUpgradePickerOpen(true);
    };

    const handleUpgradeFighter = (card) => {
        // const fightersUpgrades = [...upgrades, card.id];
        // setUpgrades(fightersUpgrades);
        // const updatedPlayerInfo = {
        //     ...playerInfo,
        //     hand: playerInfo.hand
        //         .split(",")
        //         .filter((cardId) => cardId !== card.id)
        //         .join(),
        //     glorySpent: playerInfo.glorySpent + 1,
        //     gloryScored: playerInfo.gloryScored - 1,
        // };
        // setPlayerInfo(updatedPlayerInfo);
        // firebase.updateBoardProperty(
        //     roomId,
        //     `${myself.uid}`,
        //     updatedPlayerInfo
        // );
        // firebase.updateBoardProperty(
        //     roomId,
        //     `board.fighters.${data.id}.upgrades`,
        //     fightersUpgrades.join()
        // );
        // firebase.addGenericMessage2(roomId, {
        //     author: "Katophrane",
        //     type: "INFO",
        //     subtype: "APPLIED_UPGRADE_CARD",
        //     cardId: card.id,
        //     value: `${playerInfo.name} equips ${data.name} with ${card.name} upgrade.`,
        // });
    };

    const handleUpdateWounds = (value) => {
        // firebase.updateBoardProperty(
        //     roomId,
        //     `board.fighters.${data.id}.wounds`,
        //     value
        // );
    };

    const changeInspire = async () => {
        // setIsInspired((prev) => !prev);
    };

    const returnUpgradeToHand = (cardId) => () => {
        // const updatedPlayerInfo = {
        //     ...playerInfo,
        //     glorySpent: playerInfo.glorySpent - 1,
        //     gloryScored: playerInfo.gloryScored + 1,
        //     hand: playerInfo.hand
        //         ? [...playerInfo.hand.split(","), cardId].join()
        //         : [cardId].join(),
        // };
        // const fightersUpgrades = upgrades.filter(
        //     (upgradeId) => upgradeId !== cardId
        // );
        // setUpgrades(fightersUpgrades);
        // setPlayerInfo(updatedPlayerInfo);
        // firebase.updateBoardProperty(
        //     roomId,
        //     `${myself.uid}`,
        //     updatedPlayerInfo
        // );
        // firebase.updateBoardProperty(
        //     roomId,
        //     `board.fighters.${data.id}.upgrades`,
        //     fightersUpgrades.join()
        // );
        // firebase.addGenericMessage2(roomId, {
        //     author: "Katophrane",
        //     type: "INFO",
        //     value: `${playerInfo.name} returns upgrade ${cardsDb[cardId].name} to his hand and gets 1 glory back.`,
        // });
    };

    const discardCard = (cardId) => () => {
        // const updatedPlayerInfo = {
        //     ...playerInfo,
        //     dPws: playerInfo.dPws
        //         ? [...playerInfo.dPws.split(","), cardId].join()
        //         : [cardId].join(),
        // };
        // const fightersUpgrades = upgrades.filter(
        //     (upgradeId) => upgradeId !== cardId
        // );
        // setUpgrades(fightersUpgrades);
        // setPlayerInfo(updatedPlayerInfo);
        // firebase.updateBoardProperty(
        //     roomId,
        //     `${myself.uid}`,
        //     updatedPlayerInfo
        // );
        // firebase.updateBoardProperty(
        //     roomId,
        //     `board.fighters.${data.id}.upgrades`,
        //     fightersUpgrades.join()
        // );
        // firebase.addGenericMessage2(roomId, {
        //     author: "Katophrane",
        //     type: "INFO",
        //     subtype: "DISCARDS_UPGRADE_CARD",
        //     cardId: cardId,
        //     value: `${playerInfo.name} discards upgrade card: ${cardsDb[cardId].name}.`,
        // });
    };

    return (
        <HUDOverlay
            modified={modified}
            onCloseOverlayClick={handleCloseOverlay}
        >
            <Grid
                container
                spacing={3}
                direction="column"
                style={{
                    position: "relative",
                }}
            >
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                flexFlow: "column nowrap",
                                transform: `${
                                    selectedCardId || upgradePickerOpen
                                        ? "scale(.95)"
                                        : "scale(1)"
                                }`,
                                transition: "transform .3s ease-out",
                            }}
                        >
                            <img
                                src={`/assets/fighters/${fighter.icon}${
                                    isInspired ? "-inspired" : ""
                                }.png`}
                                style={{
                                    width: cardImageWidth * 0.9,
                                    height: cardImageHeight * 0.9,
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: ".5rem",
                                    alignSelf: "flex-end",
                                }}
                                onClick={handleOpenAddTokenMenu}
                            >
                                <AddIcon
                                    style={{
                                        width: "1rem",
                                        height: "1rem",
                                        color: "teal",
                                    }}
                                />
                                <Typography
                                    style={{
                                        fontSize: "1rem",
                                        color: "teal",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Add Token
                                </Typography>
                            </div>
                            {fighter.counterTypes && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginTop: ".5rem",
                                        alignSelf: "flex-end",
                                    }}
                                    onClick={handleOpenAddCounterMenu}
                                >
                                    <AddIcon
                                        style={{
                                            width: "1rem",
                                            height: "1rem",
                                            color: "teal",
                                        }}
                                    />
                                    <Typography
                                        style={{
                                            fontSize: "1rem",
                                            color: "teal",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        Add Counter
                                    </Typography>
                                </div>
                            )}
                            <Menu
                                id="tokensMenu"
                                anchorEl={addTokenAnchor}
                                keepMounted
                                open={Boolean(addTokenAnchor)}
                                onClose={handleCloseAddTokenMenu}
                                style={{ zIndex: 20000 }}
                            >
                                <MenuItem
                                    onClick={handleAddTokenAndCloseMenu("Move")}
                                >
                                    Move Token
                                </MenuItem>
                                <MenuItem
                                    onClick={handleAddTokenAndCloseMenu(
                                        "Charge"
                                    )}
                                >
                                    Charge Token
                                </MenuItem>
                                <MenuItem
                                    onClick={handleAddTokenAndCloseMenu(
                                        "Guard"
                                    )}
                                >
                                    Guard Token
                                </MenuItem>
                                {fighter.extraTokens &&
                                    fighter.extraTokens
                                        .split(",")
                                        .map((token) => (
                                            <MenuItem
                                                key={token}
                                                onClick={handleAddTokenAndCloseMenu(
                                                    token
                                                )}
                                            >{`${token} Token`}</MenuItem>
                                        ))}
                            </Menu>
                            <Menu
                                id="countersMenu"
                                anchorEl={addCounterAnchor}
                                keepMounted
                                open={Boolean(addCounterAnchor)}
                                onClose={handleCloseAddCounterMenu}
                                style={{ zIndex: 20000 }}
                            >
                                {fighter.counterTypes &&
                                    fighter.counterTypes
                                        .split(",")
                                        .map((counter) => (
                                            <MenuItem
                                                key={counter}
                                                onClick={handleAddCounterAndCloseMenu(
                                                    counter
                                                )}
                                            >{`${counter} Counter`}</MenuItem>
                                        ))}
                            </Menu>
                            <WoundsCounter
                                wounds={fighter.wounds}
                                onWoundsCounterChange={handleUpdateWounds}
                            />
                            <ButtonBase
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    marginTop: "-3rem",
                                    left: "-1.5rem",
                                    marginRight: "1.5rem",
                                    backgroundColor: "teal",
                                    color: "white",
                                    width: "3rem",
                                    height: "3rem",
                                    borderRadius: "1.5rem",
                                    border: "3px solid white",
                                    boxSizing: "border-box",
                                }}
                                onClick={changeInspire}
                            >
                                {isInspired ? (
                                    <UninspireIcon
                                        style={{
                                            width: "2rem",
                                            height: "2rem",
                                        }}
                                    />
                                ) : (
                                    <InspireIcon
                                        style={{
                                            width: "2rem",
                                            height: "2rem",
                                        }}
                                    />
                                )}
                            </ButtonBase>
                            <div
                                style={{
                                    display: "flex",
                                    flexFlow: "column nowrap",
                                    position: "absolute",
                                    top: "1rem",
                                    right: 0,
                                    marginRight: "-3rem",
                                }}
                            >
                                {tokens &&
                                    tokens.length > 0 &&
                                    tokens.map((token, idx) => (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "1rem",
                                            }}
                                            key={idx}
                                        >
                                            <img
                                                src={`/assets/other/${token}.png`}
                                                style={{
                                                    width: "3rem",
                                                    height: "3rem",
                                                    boxSizing: "border-box",
                                                    border: "2px solid white",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    width: "1.5rem",
                                                    height: "1.5rem",
                                                    backgroundColor: "red",
                                                    marginLeft: "-.7rem",
                                                    border: "2px solid white",
                                                }}
                                                onClick={handleRemoveTokenAt(
                                                    idx
                                                )}
                                            >
                                                <AddIcon
                                                    style={{
                                                        color: "white",
                                                        width: "1.5rem",
                                                        height: "1.5rem",
                                                        transform:
                                                            "rotate(45deg)",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                {counters &&
                                    counters.length > 0 &&
                                    counters.map((counter, idx) => (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "1rem",
                                            }}
                                            key={idx}
                                        >
                                            <img
                                                src={`/assets/other/${counter}.png`}
                                                style={{
                                                    width: "3rem",
                                                    height: "3rem",
                                                    boxSizing: "border-box",
                                                    border: "2px solid white",
                                                    borderRadius: "1.5rem",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    width: "1.5rem",
                                                    height: "1.5rem",
                                                    backgroundColor: "red",
                                                    marginLeft: "-.7rem",
                                                    border: "2px solid white",
                                                }}
                                                onClick={handleRemoveCounterAt(
                                                    idx
                                                )}
                                            >
                                                <AddIcon
                                                    style={{
                                                        color: "white",
                                                        width: "1.5rem",
                                                        height: "1.5rem",
                                                        transform:
                                                            "rotate(45deg)",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ margin: "0rem 1rem" }}>
                    <Typography>Upgrades</Typography>
                    <Divider />
                    <div
                        style={{
                            display: "flex",
                            overflowX: "scroll",
                            alignItems: "center",
                            margin: "1rem",
                        }}
                    >
                        {upgrades.length > 0 &&
                            upgrades.map((u) => (
                                <Paper
                                    id={u}
                                    key={u}
                                    style={{
                                        flexShrink: 0,
                                        width: cardImageWidth * 0.3,
                                        height: cardImageHeight * 0.3,
                                        marginRight: ".5rem",
                                        borderRadius: ".5rem",
                                        backgroundPosition: "center center",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        backgroundImage: `url(/assets/cards/${u}.png)`,
                                    }}
                                    elevation={2}
                                    onClick={handleBringToFront(u)}
                                />
                            ))}
                        <div
                            style={{
                                flexShrink: 0,
                                width: cardImageWidth * 0.25,
                                height: cardImageHeight * 0.25,
                                border: fighter.isOnBoard
                                    ? "3px dashed black"
                                    : "3px dashed lightgray",
                                boxSizing: "border-box",
                                borderRadius: ".5rem",
                                display: "flex",
                            }}
                            onClick={openUpgradePicker}
                        >
                            <AddIcon
                                style={{
                                    margin: "auto",
                                    color: fighter.isOnBoard
                                        ? "black"
                                        : "lightgray",
                                }}
                            />
                        </div>
                    </div>
                </Grid>
                {selectedCardId && (
                    <ClickAwayListener onClickAway={handleCloseSelection}>
                        <div
                            style={{
                                position: "absolute",
                                width: cardImageWidth * 1.2,
                                height: cardImageHeight * 1.2,
                                top: "50%",
                                left: "50%",
                                marginTop: (-cardImageHeight * 1.2) / 2,
                                marginLeft: (-cardImageWidth * 1.2) / 2,
                                display: "flex",
                            }}
                        >
                            <Paper
                                style={{
                                    position: "relative",
                                    flexShrink: 0,
                                    width: cardImageWidth * 0.8,
                                    height: cardImageHeight * 0.8,
                                    margin: "auto",
                                    borderRadius: "1rem",
                                    backgroundPosition: "center center",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    backgroundImage: `url(/assets/cards/${selectedCardId}.png)`,
                                }}
                                elevation={10}
                                onClick={handleCloseSelection}
                            >
                                <ButtonBase
                                    style={{
                                        position: "absolute",
                                        bottom: "0%",
                                        left: "0%",
                                        marginLeft: "-1.5rem",
                                        backgroundColor: "teal",
                                        color: "white",
                                        width: "3rem",
                                        height: "3rem",
                                        borderRadius: "1.5rem",
                                    }}
                                    onClick={returnUpgradeToHand(
                                        selectedCardId
                                    )}
                                >
                                    <DrawCardsIcon
                                        style={{
                                            width: "2rem",
                                            height: "2rem",
                                            transform: "rotate(180deg)",
                                        }}
                                    />
                                </ButtonBase>
                                <ButtonBase
                                    style={{
                                        position: "absolute",
                                        bottom: "0%",
                                        right: "0%",
                                        marginRight: "-1.5rem",
                                        backgroundColor: "red",
                                        color: "white",
                                        width: "3rem",
                                        height: "3rem",
                                        borderRadius: "1.5rem",
                                    }}
                                    onClick={discardCard(selectedCardId)}
                                >
                                    <DeleteIcon
                                        style={{
                                            width: "2rem",
                                            height: "2rem",
                                        }}
                                    />
                                </ButtonBase>
                            </Paper>
                        </div>
                    </ClickAwayListener>
                )}
                {upgradePickerOpen && (
                    <UpgradePicker
                        isOpen={upgradePickerOpen}
                        playerInfo={playerInfo}
                        onUpgradePickerOpen={setUpgradePickerOpen}
                        onUpgradeSelected={handleUpgradeFighter}
                    />
                )}
            </Grid>
        </HUDOverlay>
    );
}

FighterHUD.propTypes = {
    data: PropTypes.object,
};

export default FighterHUD;
