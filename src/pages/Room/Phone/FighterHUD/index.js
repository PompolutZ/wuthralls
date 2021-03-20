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
import Button from "@material-ui/core/Button";
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
import TokensDrawPile from "./TokensDrawPile";
import InspirationButton from "./InspirationButton";
import useUpdateGameLog from "../../hooks/useUpdateGameLog";

const cardImageWidth = 300;
const cardImageHeight = 420;

// this is a good candidate for a unit test.
function convertChangesToLogMessage(changes, playerInfo, fighterInfo) {
    const msgBuilder = [];

    if (changes["wounds"] >= 0) {
        msgBuilder.push(
            `- set ${fighterInfo.name} wounds counters to ${changes["wounds"]}`
        );
    }
    // eslint-disable-next-line no-prototype-builtins
    console.log(Object.prototype.hasOwnProperty(changes, "isInspired"));
    // eslint-disable-next-line no-prototype-builtins
    if (Object.prototype.hasOwnProperty(changes, "isInspired")) {
        `- made ${fighterInfo.name} ${
            changes.isInspired ? "inspired" : "un-inspired"
        }.`;
    }

    return msgBuilder;
}

// To decide where actually should we hold state
// Should we use zustand hook to control individual fighter state globally or
// control it here. Later makes sense if we batch update fighter info.
function FighterHUD({ data, fighterId, onClose }) {
    const updateRoom = useUpdateRoom();
    const updateGameLog = useUpdateGameLog();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const fighter = useFightersInfo((info) => info[fighterId]);
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
    const [wounds, setWounds] = useState(fighter.wounds);

    // ===== NEW STUFF
    const [modified, setModified] = useState(false);
    const [changes, setChanges] = useState({});
    const [logLines, setLogLines] = useState([]);

    // ===============

    const handleCloseOverlay = () => {
        let payload = Object.entries(changes).reduce(
            (p, [key, value]) => ({
                ...p,
                [`board.fighters.${fighterId}.${key}`]: value,
            }),
            {}
        );
        updateRoom(payload);
        updateGameLog(
            [
                `${playerInfo.name} has:`,
                ...convertChangesToLogMessage(changes, playerInfo, fighter),
                ...logLines,
            ].join("\n")
        );
        onClose();
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

    const changeInspire = async () => {
        const nextValue = !isInspired;
        setIsInspired(nextValue);
        setChanges((prev) => ({
            ...prev,
            isInspired: nextValue,
        }));
        setLogLines((prev) => [
            ...prev,
            `- made ${fighter.name} ${nextValue ? "inspired" : "un-inspired"}.`,
        ]);
        setModified(true);
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

    const handleAddToken = (token) => {
        const nextTokens = [...tokens, token];
        setTokens(nextTokens);
        setChanges((prev) => ({
            ...prev,
            tokens: nextTokens.join(","),
        }));
        setLogLines((prev) => [
            ...prev,
            `- gave ${token} token to ${fighter.name}`,
        ]);
        setModified(true);
    };

    const handleRemoveToken = (index) => () => {
        // this is a shitty quick solution (abusing JS) since I want  to
        // push new version to try Starblood faction
        // the right strategy would have been probably
        // making WoundCounters to be just Counters, one per type
        const tokenToRemove = tokens[index];
        const nextTokens = [
            ...tokens.slice(0, index),
            ...tokens.slice(index + 1),
        ];
        setTokens(nextTokens);
        setChanges((prev) => ({
            ...prev,
            tokens: nextTokens.join(","),
        }));
        setLogLines((prev) => [
            ...prev,
            `- removed ${tokenToRemove} token from ${fighter.name}`,
        ]);
        setModified(true);
    };

    const handleAddCounter = (counter) => {
        switch (counter) {
            case "woundToken": {
                const nextWounds = wounds + 1;
                setWounds(nextWounds);
                setChanges((prev) => ({
                    ...prev,
                    wounds: nextWounds,
                }));
                setModified(true);
                break;
            }
            default: {
                const nextCounters = [...counters, counter];
                setCounters(nextCounters);
                setChanges((prev) => ({
                    ...prev,
                    counters: nextCounters.join(","),
                }));
                setModified(true);
                setLogLines((prev) => [
                    ...prev,
                    `- gave ${counter} counter to ${fighter.name}`,
                ]);
                break;
            }
        }
    };

    const handleRemoveCounter = (counter) => () => {
        switch (counter) {
            case "woundToken": {
                const nextWounds = wounds - 1;
                setWounds(nextWounds);
                setChanges((prev) => ({
                    ...prev,
                    wounds: nextWounds,
                }));
                setModified(true);
                break;
            }
            default: {
                // this is a shitty quick solution (abusing JS) since I want  to
                // push new version to try Starblood faction
                // the right strategy would have been probably
                // making WoundCounters to be just Counters, one per type

                setLogLines((prev) => [
                    ...prev,
                    `- removed ${counters[counter]} counter from ${fighter.name}`,
                ]);
                const nextCounters = [
                    ...counters.slice(0, counter),
                    ...counters.slice(counter + 1),
                ];
                setCounters(nextCounters);
                setChanges((prev) => ({
                    ...prev,
                    counters: nextCounters.join(","),
                }));
                setModified(true);
                break;
            }
        }
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
                    padding: "1rem",
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
                                filter:
                                    "drop-shadow(0px 2px 4px rgba(0,0,0,.5))",
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
                            <InspirationButton
                                isInspired={isInspired}
                                onClick={changeInspire}
                            />
                            <TokensDrawPile
                                tokens={["Move", "Charge", "Guard"]}
                                onClick={handleAddToken}
                            />
                            <TokensDrawPile
                                variant="circular"
                                tokens={[
                                    "woundToken",
                                    "Hunger1",
                                    ...fighter.counterTypes.split(","),
                                ]}
                                onClick={handleAddCounter}
                            />
                            <WoundsCounter
                                wounds={wounds}
                                onRemoveWoundCounter={handleRemoveCounter(
                                    "woundToken"
                                )}
                            />
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
                                                onClick={handleRemoveToken(idx)}
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
                                                onClick={handleRemoveCounter(
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
                <Grid
                    item
                    xs={12}
                    style={{ margin: "0rem 1rem", color: "white" }}
                >
                    <Typography>Upgrades</Typography>
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
                                    ? "3px dashed white"
                                    : "3px dashed lightgray",
                                boxSizing: "border-box",
                                borderRadius: ".5rem",
                                display: "flex",
                                background: "rgba(255,255,255,.2)",
                            }}
                            onClick={openUpgradePicker}
                        >
                            <AddIcon
                                style={{
                                    width: "2rem",
                                    height: "2rem",
                                    margin: "auto",
                                    color: fighter.isOnBoard
                                        ? "white"
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
