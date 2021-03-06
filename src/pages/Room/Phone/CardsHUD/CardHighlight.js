import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import ButtonBase from "@material-ui/core/ButtonBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DrawCardsIcon from "@material-ui/icons/GetApp";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PlayUpgradeIcon from "@material-ui/icons/Settings";
import DeleteIcon from "@material-ui/icons/Delete";
import ReturnToPileIcon from "@material-ui/icons/Eject";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { Typography } from "@material-ui/core";
import { Glory } from "../../../../components/CommonSVGs";
import PropTypes from "prop-types";

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const OBJECTIVES_HAND = "OBJECTIVES_HAND";
const POWERS_HAND = "POWERS_HAND";
const OBJECTIVES_SCORED = "OBJECTIVES_SCORED";
const OBJECTIVES_DISCARDED = "OBJECTIVES_DISCARDED";
const POWERS_DISCARDED = "POWERS_DISCARDED";

const MY_CARDS_GROUP = "MY_CARDS_GROUP";

const CardHighlight = ({
    highlightCard,
    myFighters,
    highlightFromSource,
    selectedGroup,
    handleClickAwayHightlight,
    playCard,
    applyFighterUpgrade,
    returnToPile,
    returnToHand,
    discardCard,
}) => {
    const [addTokenAnchor, setAddTokenAnchor] = useState(null);

    const playOrUpgrade = (e) => {
        if (highlightCard.type !== "Upgrade") {
            playCard(highlightCard)();
        } else {
            setAddTokenAnchor(e.currentTarget);
            e.preventDefault();
        }
    };

    const upgradeFighter = (fighter) => () => {
        handleCloseFightersToUpgradeMenu();
        handleClickAwayHightlight();
        applyFighterUpgrade(highlightCard, fighter);
    };

    const handleClickAway = () => {
        if (addTokenAnchor) {
            return;
        } else {
            handleClickAwayHightlight();
        }
    };

    const handleCloseFightersToUpgradeMenu = () => {
        setAddTokenAnchor(null);
    };

    return (
        <div
            style={{
                position: "fixed",
                width: "100%",
                height: "100%",
                top: "0",
                left: "0",
                display: "flex",
                zIndex: 10000,
                perspective: "5rem",
                backgroundColor: "rgba(255,255,255,.5)",
            }}
        >
            <Menu
                id="whatEva"
                anchorEl={addTokenAnchor}
                keepMounted
                open={Boolean(addTokenAnchor)}
                onClose={handleCloseFightersToUpgradeMenu}
                style={{ zIndex: "100100" }}
            >
                {myFighters.map(([fighterId, fighter]) => (
                    <MenuItem
                        key={fighterId}
                        disabled={!fighter.isOnBoard}
                        onClick={upgradeFighter({ ...fighter, id: fighterId })}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                                style={{
                                    width: "2rem",
                                    height: "2rem",
                                    marginRight: ".5rem",
                                    filter: !fighter.isOnBoard
                                        ? "grayscale(100%)"
                                        : "",
                                }}
                                src={`/assets/fighters/${fighter.icon}-icon.png`}
                            />
                            <Typography>{fighter.name}</Typography>
                        </div>
                    </MenuItem>
                ))}
            </Menu>
            <ClickAwayListener onClickAway={handleClickAway}>
                <Paper
                    style={{
                        position: "relative",
                        flexShrink: 0,
                        width: cardDefaultWidth * 0.8,
                        height: cardDefaultHeight * 0.8,
                        margin: "auto",
                        borderRadius: "1rem",
                        // border: '3px dashed black',
                        // boxSizing: 'border-box',
                        backgroundPosition: "center center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundImage: `url(/assets/cards/${highlightCard.id}.png)`,
                    }}
                    elevation={10}
                >
                    {highlightFromSource === OBJECTIVES_HAND &&
                        selectedGroup === MY_CARDS_GROUP && (
                            <ButtonBase
                                style={{
                                    position: "absolute",
                                    bottom: "0%",
                                    left: "0%",
                                    marginLeft: "-1.5rem",
                                    backgroundColor: "dimgray",
                                    color: "gray",
                                    width: "4rem",
                                    height: "4rem",
                                    borderRadius: "2rem",
                                    boxSizing: "border-box",
                                    boxShadow: "0 0 10px 2px darkgoldenrod",
                                }}
                                onClick={playCard(highlightCard)}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        width: "3rem",
                                        height: "3rem",
                                        borderRadius: "2rem",
                                        backgroundColor: "goldenrod",
                                        display: "flex",
                                    }}
                                ></div>
                                <Glory
                                    style={{
                                        // backgroundColor: 'orange',
                                        color: "darkgoldenrod",
                                        width: "4.2rem",
                                        height: "4.2rem",
                                        borderRadius: "3rem",
                                        position: "absolute",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        width: "3rem",
                                        height: "3rem",
                                        borderRadius: "2rem",
                                        display: "flex",
                                        left: "1rem",
                                        top: "-.5rem",
                                    }}
                                >
                                    <Typography
                                        style={{
                                            color: "white",
                                            fontSize: "3rem",
                                            fontWeight: 800,
                                        }}
                                    >
                                        {highlightCard.glory}
                                    </Typography>
                                </div>
                            </ButtonBase>
                        )}
                    {highlightFromSource === POWERS_HAND &&
                        selectedGroup === MY_CARDS_GROUP && (
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
                                    zIndex: 10000 + 100,
                                }}
                                onClick={playOrUpgrade}
                            >
                                {highlightCard.type !== "Upgrade" && (
                                    <PlayIcon
                                        style={{
                                            width: "2rem",
                                            height: "2rem",
                                        }}
                                    />
                                )}
                                {highlightCard.type === "Upgrade" && (
                                    <PlayUpgradeIcon
                                        style={{
                                            width: "2rem",
                                            height: "2rem",
                                        }}
                                    />
                                )}
                            </ButtonBase>
                        )}
                    {(highlightFromSource === OBJECTIVES_SCORED ||
                        highlightFromSource === OBJECTIVES_DISCARDED ||
                        highlightFromSource === POWERS_DISCARDED) &&
                        selectedGroup === MY_CARDS_GROUP && (
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
                                onClick={returnToHand(
                                    highlightCard,
                                    highlightFromSource
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
                        )}
                    {(highlightFromSource === OBJECTIVES_HAND ||
                        highlightFromSource === POWERS_HAND) &&
                        selectedGroup === MY_CARDS_GROUP && (
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
                                onClick={discardCard(highlightCard)}
                            >
                                <DeleteIcon
                                    style={{
                                        width: "2rem",
                                        height: "2rem",
                                    }}
                                />
                            </ButtonBase>
                        )}
                    {(highlightFromSource === OBJECTIVES_HAND ||
                        highlightFromSource === POWERS_HAND) &&
                        selectedGroup === MY_CARDS_GROUP && (
                            <ButtonBase
                                style={{
                                    position: "absolute",
                                    bottom: "3.5rem",
                                    right: "0%",
                                    marginRight: "-1.5rem",
                                    backgroundColor: "red",
                                    color: "white",
                                    width: "3rem",
                                    height: "3rem",
                                    borderRadius: "1.5rem",
                                }}
                                onClick={returnToPile(
                                    highlightCard,
                                    highlightFromSource
                                )}
                            >
                                <ReturnToPileIcon
                                    style={{
                                        width: "2rem",
                                        height: "2rem",
                                    }}
                                />
                            </ButtonBase>
                        )}
                    {(highlightFromSource === OBJECTIVES_SCORED ||
                        highlightFromSource === OBJECTIVES_DISCARDED ||
                        highlightFromSource === POWERS_DISCARDED) &&
                        selectedGroup === MY_CARDS_GROUP && (
                            <ButtonBase
                                style={{
                                    position: "absolute",
                                    bottom: "0%",
                                    right: "0%",
                                    marginLeft: "-1.5rem",
                                    backgroundColor: "red",
                                    color: "white",
                                    width: "3rem",
                                    height: "3rem",
                                    borderRadius: "1.5rem",
                                }}
                                onClick={returnToPile(
                                    highlightCard,
                                    highlightFromSource
                                )}
                            >
                                <ReturnToPileIcon
                                    style={{
                                        width: "2rem",
                                        height: "2rem",
                                    }}
                                />
                            </ButtonBase>
                        )}
                </Paper>
            </ClickAwayListener>
        </div>
    );
};

CardHighlight.propTypes = {
    highlightCard: PropTypes.object,
    myFighters: PropTypes.array,
    highlightFromSource: PropTypes.string,
    selectedGroup: PropTypes.string,
    handleClickAwayHightlight: PropTypes.func,
    playCard: PropTypes.func,
    applyFighterUpgrade: PropTypes.func,
    returnToPile: PropTypes.func,
    returnToHand: PropTypes.func,
    discardCard: PropTypes.func,
};

export default CardHighlight;
