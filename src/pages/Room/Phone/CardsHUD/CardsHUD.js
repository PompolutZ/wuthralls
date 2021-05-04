import React, { useContext, useState } from "react";
import Divider from "@material-ui/core/Divider";
import { FirebaseContext } from "../../../../firebase";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { useAuthUser } from "../../../../components/Session";
import { Typography } from "@material-ui/core";
import { cardsDb } from "../../../../data/index";
import PropTypes from "prop-types";

import CardHighlight from "./CardHighlight";
import { shuffle } from "../../../../utils";
import CloseHUDButton from "./CloseHUDButton";
import { cardDefaultHeight, cardDefaultWidth } from "../../../../constants/mix";
import DrawPile from "./DrawPile";
import { useMyGameState } from "../../hooks/playerStateHooks";
import useUpdateGameLog, {
    createAppliedUpgradePayload,
    createPlayerPlayedPowerCardPayload,
    createPlayerScoredObjectiveCardPayload,
} from "../../hooks/useUpdateGameLog";
import useUpdateRoom from "../../hooks/useUpdateRoom";
import {
    ENEMY_CARDS_GROUP,
    MY_CARDS_GROUP,
    OBJECTIVES_DISCARDED,
    OBJECTIVES_HAND,
    OBJECTIVES_SCORED,
    POWERS_DISCARDED,
    POWERS_HAND,
} from "./constants";
import { moveCard, stringToCards } from "./utils";

const CardsHUD = ({
    roomId,
    myData,
    myFighters,
    enemyHand,
    enemyScoredObjectivesPile,
    enemyObjectivesDiscardPile,
    enemyPowersDiscardPile,
    onClose,
}) => {
    const updateGameLog = useUpdateGameLog();
    const updateRoom = useUpdateRoom();
    const updateMyDeck = useMyGameState((state) => state.setDeck);
    const setGloryScored = useMyGameState((state) => state.setGloryScored);
    const setGlorySpent = useMyGameState((state) => state.setGlorySpend);
    const gloryScored = useMyGameState((state) => state.gloryScored);
    const glorySpent = useMyGameState((state) => state.glorySpent);
    const objectiveDrawPile = useMyGameState((state) =>
        stringToCards(state.oDeck)
    );
    const powersDrawPile = useMyGameState((state) =>
        stringToCards(state.pDeck)
    );
    const scoredObjectives = useMyGameState((state) =>
        stringToCards(state.sObjs)
    );
    const discardedObjectives = useMyGameState((state) =>
        stringToCards(state.dObjs)
    );
    const discardedPowers = useMyGameState((state) =>
        stringToCards(state.dPws)
    );
    const hand = useMyGameState((state) => stringToCards(state.hand));

    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [highlightCard, setHighlightCard] = useState(null);
    const [highlightFromSource, setHighlightFromSource] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(MY_CARDS_GROUP);
    const [modified, setModified] = useState(false);
    const [pendingUpgrades, setPendingUpgrades] = useState({});

    const opponentHand = stringToCards(enemyHand);
    const opponentScoreObjectivesPile = stringToCards(
        enemyScoredObjectivesPile
    );
    const opponentObjectivesDiscardPile = stringToCards(
        enemyObjectivesDiscardPile
    );
    const opponentPowersDiscardPile = stringToCards(enemyPowersDiscardPile);

    const selectGroup = (groupName) => () => {
        setSelectedGroup(groupName);
    };

    const drawObjectiveCard = async () => {
        const [objective, ...rest] = objectiveDrawPile;
        updateMyDeck(
            "hand",
            [...hand.map(({ id }) => id), objective.id].join()
        );
        updateMyDeck("oDeck", rest.map(({ id }) => id).join());
        setModified(true);

        updateGameLog(`**${myself.username}** has drawn objective card.`);
    };

    const drawPowerCard = () => {
        const [power, ...rest] = powersDrawPile;
        updateMyDeck("hand", [...hand.map(({ id }) => id), power.id].join());
        updateMyDeck("pDeck", rest.map(({ id }) => id).join());
        setModified(true);

        updateGameLog(`**${myself.username}** has drawn power card.`);
    };

    const handleHighlightCard = (card, source) => () => {
        setHighlightCard(card);
        setHighlightFromSource(source);
    };

    const handleClickAwayHightlight = (e) => {
        setHighlightCard(null);
        if (e) {
            e.preventDefault();
        }
    };

    const handleClose = (persist) => {
        onClose(false);

        if (persist) {
            updateRoom({
                [`${myself.uid}.hand`]: hand
                    ? hand.map((x) => x.id).join()
                    : "",
                [`${myself.uid}.oDeck`]: objectiveDrawPile
                    ? objectiveDrawPile.map((x) => x.id).join()
                    : "",
                [`${myself.uid}.pDeck`]: powersDrawPile
                    ? powersDrawPile.map((x) => x.id).join()
                    : "",
                [`${myself.uid}.sObjs`]: scoredObjectives
                    ? scoredObjectives.map((x) => x.id).join()
                    : "",
                [`${myself.uid}.dObjs`]: discardedObjectives
                    ? discardedObjectives.map((x) => x.id).join()
                    : "",
                [`${myself.uid}.dPws`]: discardedPowers
                    ? discardedPowers.map((x) => x.id).join()
                    : "",
                [`${myself.uid}.gloryScored`]: gloryScored,
                [`${myself.uid}.glorySpent`]: glorySpent,
                ...pendingUpgrades,
            });
            setModified(false);
        }
    };

    const resetHighlight = () => {
        setHighlightCard(null);
        setHighlightFromSource(null);
        setModified(true);
    };

    const playCard = (card) => () => {
        updateMyDeck(
            "hand",
            hand
                .reduce(
                    (acc, c) => (c.id !== card.id ? [...acc, c.id] : acc),
                    []
                )
                .join()
        );

        if (card.type === "Objective") {
            updateMyDeck(
                "sObjs",
                [...scoredObjectives.map(({ id }) => id), card.id].join()
            );

            setGloryScored(Number(gloryScored) + Number(card.glory));
            updateGameLog(
                createPlayerScoredObjectiveCardPayload(
                    card.id,
                    `**${myself.username}** scored objective: **${card.name}**(${card.glory}).`
                )
            );
        } else {
            updateMyDeck(
                "dPws",
                [...discardedPowers.map(({ id }) => id), card.id].join()
            );

            updateGameLog(
                createPlayerPlayedPowerCardPayload(
                    card.id,
                    `**${myself.username}** played: **${card.name}**.`
                )
            );
        }

        resetHighlight();
    };

    const applyUpgrade = (upgrade, fighter) => {
        const nextGloryScored = gloryScored - 1;
        const nextGlorySpent = glorySpent + 1;

        updateMyDeck(
            "hand",
            hand
                .reduce(
                    (acc, c) => (c.id !== upgrade.id ? [...acc, c.id] : acc),
                    []
                )
                .join()
        );
        setGloryScored(nextGloryScored);
        setGlorySpent(nextGlorySpent);

        const pendingKey = `board.fighters.${fighter.id}.upgrades`;
        setPendingUpgrades((prev) => {
            if (prev[pendingKey]) {
                return {
                    ...prev,
                    [pendingKey]: `${prev[pendingKey]},${upgrade.id}`,
                };
            } else {
                return {
                    ...prev,
                    [pendingKey]: fighter.upgrades
                        ? `${fighter.upgrades},${upgrade.id}`
                        : `${upgrade.id}`,
                };
            }
        });

        resetHighlight();

        updateGameLog(
            createAppliedUpgradePayload(
                upgrade.id,
                `**${myData.name}** equips **${fighter.name}** with **${upgrade.name}** upgrade.
        **${myData.name}** has updated his scored/spent glory to ${nextGloryScored}/${nextGlorySpent}.`
            )
        );
    };

    const returnToHand = (card, source) => () => {
        updateMyDeck("hand", [...hand.map(({ id }) => id), card.id].join());

        if (source === OBJECTIVES_SCORED) {
            updateMyDeck(
                "sObjs",
                [
                    ...scoredObjectives
                        .filter(({ id }) => id !== card.id)
                        .map((card) => card.id),
                ].join()
            );

            firebase.addGenericMessage2(roomId, {
                author: "Katophrane",
                type: "INFO",
                value: `**${myself.username}** has returned scored objective card back to hand.`,
            });
        }

        if (source === OBJECTIVES_DISCARDED) {
            updateMyDeck(
                "dObjs",
                [
                    ...discardedObjectives
                        .filter(({ id }) => id !== card.id)
                        .map((card) => card.id),
                ].join()
            );

            firebase.addGenericMessage2(roomId, {
                author: "Katophrane",
                type: "INFO",
                value: `**${myself.username}** has returned discarded objective card back to hand.`,
            });
        }

        if (source === POWERS_DISCARDED) {
            updateMyDeck(
                "dPws",
                [
                    ...discardedPowers
                        .filter(({ id }) => id !== card.id)
                        .map((card) => card.id),
                ].join()
            );

            firebase.addGenericMessage2(roomId, {
                author: "Katophrane",
                type: "INFO",
                value: `**${myself.username}** has returned discarded power card back to hand.`,
            });
        }

        resetHighlight();
    };

    const returnToPile = (card, source) => () => {
        if (source === OBJECTIVES_HAND) {
            const [nextHand, nextODeck] = moveCard(
                card.id,
                hand,
                objectiveDrawPile
            );
            updateMyDeck("hand", nextHand.join());
            updateMyDeck("oDeck", shuffle(nextODeck).join());
        }

        if (source === POWERS_HAND) {
            const [nextHand, nextPDeck] = moveCard(
                card.id,
                hand,
                powersDrawPile
            );
            updateMyDeck("hand", nextHand.join());
            updateMyDeck("pDeck", shuffle(nextPDeck).join());
        }

        if (source === OBJECTIVES_SCORED) {
            const [nextScoredObjectives, nextODeck] = moveCard(
                card.id,
                scoredObjectives,
                objectiveDrawPile
            );
            updateMyDeck("sObjs", nextScoredObjectives.join());
            updateMyDeck("oDeck", shuffle(nextODeck).join());
        }

        if (source === OBJECTIVES_DISCARDED) {
            const [nextDiscardedObjectives, nextODeck] = moveCard(
                card.id,
                discardedObjectives,
                objectiveDrawPile
            );
            updateMyDeck("dObjs", nextDiscardedObjectives.join());
            updateMyDeck("oDeck", shuffle(nextODeck).join());
        }

        if (source === POWERS_DISCARDED) {
            const [nextDiscardedPowers, nextPDeck] = moveCard(
                card.id,
                discardedPowers,
                powersDrawPile
            );
            updateMyDeck("dPws", nextDiscardedPowers.join());
            updateMyDeck("pDeck", shuffle(nextPDeck).join());
        }

        resetHighlight();
    };

    const discardCard = (card) => () => {
        setHand((prev) => prev.filter((c) => c.id !== card.id));

        if (card.type === "Objective") {
            if (!discardedObjectives) {
                setDiscardedObjectives([card]);
            } else {
                setDiscardedObjectives((prev) => [...prev, card]);
            }

            firebase.addGenericMessage2(roomId, {
                author: "Katophrane",
                type: "INFO",
                subtype: "DISCARDED_OBJECTIVE_CARD",
                cardId: card.id,
                value: `**${myself.username}** discarded objective card: **${card.name}**.`,
            });
        } else {
            if (!discardedPowers) {
                setDiscardedPowers([card]);
            } else {
                setDiscardedPowers((prev) => [...prev, card]);
            }

            firebase.addGenericMessage2(roomId, {
                author: "Katophrane",
                type: "INFO",
                subtype: "DISCARDED_POWER_CARD",
                cardId: card.id,
                value: `**${myself.username}** discarded power card: **${card.name}**.`,
            });
        }

        setHighlightCard(null);
        setModified(true);
    };

    const handleStopHighlighting = () => {
        setHighlightCard(null);
    };

    return (
        <div
            style={{
                position: "fixed",
                width: "100%",
                height: "100%",
                top: "0",
                left: "0",
                zIndex: 100001,
                overflowY: "scroll",
                backgroundColor: "rgba(255,255,255,.8)",
            }}
        >
            <Container maxWidth="md" style={{ paddingBottom: "3rem" }}>
                <CloseHUDButton modified={modified} onClick={handleClose} />

                <Grid container style={{ marginTop: "2.5rem" }}>
                    <Grid item xs={12}>
                        <ButtonGroup
                            fullWidth
                            aria-label="full width outlined button group"
                            style={{ marginBottom: ".5rem" }}
                        >
                            <Button onClick={selectGroup(MY_CARDS_GROUP)}>
                                My Cards
                            </Button>
                            <Button onClick={selectGroup(ENEMY_CARDS_GROUP)}>
                                Opponent&apos;s Cards
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>

                {selectedGroup === MY_CARDS_GROUP && (
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6} style={{ display: "flex" }}>
                                    <DrawPile
                                        variant="objective"
                                        onDraw={drawObjectiveCard}
                                        count={
                                            objectiveDrawPile
                                                ? objectiveDrawPile.length
                                                : 0
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6} style={{ display: "flex" }}>
                                    <DrawPile
                                        variant="power"
                                        onDraw={drawPowerCard}
                                        count={
                                            powersDrawPile
                                                ? powersDrawPile.length
                                                : 0
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ marginTop: "1rem" }}>
                                Objectives{" "}
                                {`(${
                                    hand && hand.length > 0
                                        ? hand.filter(
                                              (c) => c.type === "Objective"
                                          ).length
                                        : "empty"
                                })`}
                            </Typography>
                            <Divider />
                            <Grid container>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        overflowX: "scroll",
                                    }}
                                >
                                    {hand &&
                                        hand.length > 0 &&
                                        hand
                                            .filter(
                                                (c) => c.type === "Objective"
                                            )
                                            .map((card, idx, arr) => (
                                                <Paper
                                                    key={card.id}
                                                    style={{
                                                        flexShrink: 0,
                                                        width:
                                                            cardDefaultWidth *
                                                            0.4,
                                                        height:
                                                            cardDefaultHeight *
                                                            0.4,
                                                        margin: `1rem ${
                                                            idx ===
                                                            arr.length - 1
                                                                ? "1rem"
                                                                : ".3rem"
                                                        } 0 ${
                                                            idx === 0
                                                                ? "1rem"
                                                                : "0"
                                                        }`,
                                                        borderRadius: "1rem",
                                                        backgroundPosition:
                                                            "center center",
                                                        backgroundSize: "cover",
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundImage: `url(/assets/cards/${card.id}.png)`,
                                                    }}
                                                    elevation={10}
                                                    onClick={handleHighlightCard(
                                                        card,
                                                        OBJECTIVES_HAND
                                                    )}
                                                />
                                            ))}
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ marginTop: "1rem" }}>
                                Power cards{" "}
                                {`(${
                                    hand && hand.length > 0
                                        ? hand.filter(
                                              (c) => c.type !== "Objective"
                                          ).length
                                        : "empty"
                                })`}
                            </Typography>
                            <Divider />
                            <Grid container>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        overflowX: "scroll",
                                    }}
                                >
                                    {hand &&
                                        hand.length > 0 &&
                                        hand
                                            .filter(
                                                (c) => c.type !== "Objective"
                                            )
                                            .map((card, idx, arr) => (
                                                <Paper
                                                    key={card.id}
                                                    style={{
                                                        flexShrink: 0,
                                                        width:
                                                            cardDefaultWidth *
                                                            0.4,
                                                        height:
                                                            cardDefaultHeight *
                                                            0.4,
                                                        margin: `1rem ${
                                                            idx ===
                                                            arr.length - 1
                                                                ? "1rem"
                                                                : ".3rem"
                                                        } 0 ${
                                                            idx === 0
                                                                ? "1rem"
                                                                : "0"
                                                        }`,
                                                        borderRadius: "1rem",
                                                        // border: '3px dashed black',
                                                        // boxSizing: 'border-box',
                                                        backgroundPosition:
                                                            "center center",
                                                        backgroundSize: "cover",
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundImage: `url(/assets/cards/${card.id}.png)`,
                                                    }}
                                                    elevation={10}
                                                    onClick={handleHighlightCard(
                                                        card,
                                                        POWERS_HAND
                                                    )}
                                                />
                                            ))}
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ marginTop: "1rem" }}>
                                Scored objectives{" "}
                                {`(${
                                    scoredObjectives
                                        ? scoredObjectives.length
                                        : "empty"
                                })`}
                            </Typography>
                            <Divider />
                            <Grid container>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        overflowX: "scroll",
                                    }}
                                >
                                    {scoredObjectives &&
                                        scoredObjectives.length > 0 &&
                                        scoredObjectives
                                            // .filter(c => c.type !== "Objective")
                                            .map((card, idx, arr) => (
                                                <Paper
                                                    key={card.id}
                                                    style={{
                                                        flexShrink: 0,
                                                        width:
                                                            cardDefaultWidth *
                                                            0.4,
                                                        height:
                                                            cardDefaultHeight *
                                                            0.4,
                                                        margin: `1rem ${
                                                            idx ===
                                                            arr.length - 1
                                                                ? "1rem"
                                                                : ".3rem"
                                                        } 0 ${
                                                            idx === 0
                                                                ? "1rem"
                                                                : "0"
                                                        }`,
                                                        borderRadius: "1rem",
                                                        // border: '3px dashed black',
                                                        // boxSizing: 'border-box',
                                                        backgroundPosition:
                                                            "center center",
                                                        backgroundSize: "cover",
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundImage: `url(/assets/cards/${card.id}.png)`,
                                                    }}
                                                    elevation={10}
                                                    onClick={handleHighlightCard(
                                                        card,
                                                        OBJECTIVES_SCORED
                                                    )}
                                                />
                                            ))}
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ marginTop: "1rem" }}>
                                Discarded objectives{" "}
                                {`(${
                                    discardedObjectives
                                        ? discardedObjectives.length
                                        : "empty"
                                })`}
                            </Typography>
                            <Divider />
                            <Grid container>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        overflowX: "scroll",
                                    }}
                                >
                                    {discardedObjectives &&
                                        discardedObjectives.length > 0 &&
                                        discardedObjectives
                                            // .filter(c => c.type !== "Objective")
                                            .map((card, idx, arr) => (
                                                <Paper
                                                    key={card.id}
                                                    style={{
                                                        flexShrink: 0,
                                                        width:
                                                            cardDefaultWidth *
                                                            0.4,
                                                        height:
                                                            cardDefaultHeight *
                                                            0.4,
                                                        margin: `1rem ${
                                                            idx ===
                                                            arr.length - 1
                                                                ? "1rem"
                                                                : ".3rem"
                                                        } 0 ${
                                                            idx === 0
                                                                ? "1rem"
                                                                : "0"
                                                        }`,
                                                        borderRadius: "1rem",
                                                        // border: '3px dashed black',
                                                        // boxSizing: 'border-box',
                                                        backgroundPosition:
                                                            "center center",
                                                        backgroundSize: "cover",
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundImage: `url(/assets/cards/${card.id}.png)`,
                                                    }}
                                                    elevation={10}
                                                    onClick={handleHighlightCard(
                                                        card,
                                                        OBJECTIVES_DISCARDED
                                                    )}
                                                />
                                            ))}
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ marginTop: "1rem" }}>
                                Discarded powers{" "}
                                {`(${
                                    discardedPowers
                                        ? discardedPowers.length
                                        : "empty"
                                })`}
                            </Typography>
                            <Divider />
                            <Grid container>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        overflowX: "scroll",
                                    }}
                                >
                                    {discardedPowers &&
                                        discardedPowers.length > 0 &&
                                        discardedPowers
                                            // .filter(c => c.type !== "Objective")
                                            .map((card, idx, arr) => (
                                                <Paper
                                                    key={card.id}
                                                    style={{
                                                        flexShrink: 0,
                                                        width:
                                                            cardDefaultWidth *
                                                            0.4,
                                                        height:
                                                            cardDefaultHeight *
                                                            0.4,
                                                        margin: `1rem ${
                                                            idx ===
                                                            arr.length - 1
                                                                ? "1rem"
                                                                : ".3rem"
                                                        } 0 ${
                                                            idx === 0
                                                                ? "1rem"
                                                                : "0"
                                                        }`,
                                                        borderRadius: "1rem",
                                                        // border: '3px dashed black',
                                                        // boxSizing: 'border-box',
                                                        backgroundPosition:
                                                            "center center",
                                                        backgroundSize: "cover",
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundImage: `url(/assets/cards/${card.id}.png)`,
                                                    }}
                                                    elevation={10}
                                                    onClick={handleHighlightCard(
                                                        card,
                                                        POWERS_DISCARDED
                                                    )}
                                                />
                                            ))}
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                {selectedGroup === ENEMY_CARDS_GROUP && (
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography style={{ marginTop: "1rem" }}>
                                Opponents Hand{" "}
                                {`(${
                                    opponentHand ? opponentHand.length : "empty"
                                })`}
                            </Typography>
                            <Divider />
                            <Grid container>
                                <Grid item xs={6}>
                                    <Paper
                                        elevation={3}
                                        style={{
                                            position: "relative",
                                            backgroundImage:
                                                "url(/assets/cards/objectives_back.png)",
                                            backgroundSize: "cover",
                                            width: cardDefaultWidth * 0.2,
                                            height: cardDefaultHeight * 0.2,
                                            margin: "auto",
                                        }}
                                    >
                                        <Paper
                                            elevation={3}
                                            style={{
                                                position: "absolute",
                                                zIndex: 1,
                                                top: "0%",
                                                left: "0%",
                                                backgroundColor: "goldenrod",
                                                width: "2rem",
                                                height: "2rem",
                                                display: "flex",
                                                borderRadius: "1.5rem",
                                                color: "white",
                                            }}
                                        >
                                            <Typography
                                                style={{
                                                    margin: "auto",
                                                    fontSize: "1.2rem",
                                                }}
                                            >
                                                {opponentHand &&
                                                    opponentHand.filter(
                                                        (c) =>
                                                            c.type ===
                                                            "Objective"
                                                    ).length}
                                            </Typography>
                                        </Paper>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper
                                        elevation={3}
                                        style={{
                                            position: "relative",
                                            backgroundImage:
                                                "url(/assets/cards/powers_back.png)",
                                            backgroundSize: "cover",
                                            width: cardDefaultWidth * 0.2,
                                            height: cardDefaultHeight * 0.2,
                                            margin: "auto",
                                        }}
                                    >
                                        <Paper
                                            elevation={3}
                                            style={{
                                                position: "absolute",
                                                zIndex: 1,
                                                top: "0%",
                                                left: "0%",
                                                backgroundColor: "goldenrod",
                                                width: "2rem",
                                                height: "2rem",
                                                display: "flex",
                                                borderRadius: "1.5rem",
                                                color: "white",
                                            }}
                                        >
                                            <Typography
                                                style={{
                                                    margin: "auto",
                                                    fontSize: "1.2rem",
                                                }}
                                            >
                                                {opponentHand &&
                                                    opponentHand.filter(
                                                        (c) =>
                                                            c.type !==
                                                            "Objective"
                                                    ).length}
                                            </Typography>
                                        </Paper>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ marginTop: "1rem" }}>
                                Scored objectives{" "}
                                {`(${
                                    opponentScoreObjectivesPile
                                        ? opponentScoreObjectivesPile.length
                                        : "empty"
                                })`}
                            </Typography>
                            <Divider />
                            <Grid container>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        overflowX: "scroll",
                                    }}
                                >
                                    {opponentScoreObjectivesPile &&
                                        opponentScoreObjectivesPile.length >
                                            0 &&
                                        opponentScoreObjectivesPile
                                            // .filter(c => c.type !== "Objective")
                                            .map((card, idx, arr) => (
                                                <Paper
                                                    key={card.id}
                                                    style={{
                                                        flexShrink: 0,
                                                        width:
                                                            cardDefaultWidth *
                                                            0.4,
                                                        height:
                                                            cardDefaultHeight *
                                                            0.4,
                                                        margin: `1rem ${
                                                            idx ===
                                                            arr.length - 1
                                                                ? "1rem"
                                                                : ".3rem"
                                                        } 0 ${
                                                            idx === 0
                                                                ? "1rem"
                                                                : "0"
                                                        }`,
                                                        borderRadius: "1rem",
                                                        // border: '3px dashed black',
                                                        // boxSizing: 'border-box',
                                                        backgroundPosition:
                                                            "center center",
                                                        backgroundSize: "cover",
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundImage: `url(/assets/cards/${card.id}.png)`,
                                                    }}
                                                    elevation={10}
                                                    onClick={handleHighlightCard(
                                                        card,
                                                        OBJECTIVES_SCORED
                                                    )}
                                                />
                                            ))}
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ marginTop: "1rem" }}>
                                Discarded objectives{" "}
                                {`(${
                                    opponentObjectivesDiscardPile
                                        ? opponentObjectivesDiscardPile.length
                                        : "empty"
                                })`}
                            </Typography>
                            <Divider />
                            <Grid container>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        overflowX: "scroll",
                                    }}
                                >
                                    {opponentObjectivesDiscardPile &&
                                        opponentObjectivesDiscardPile.length >
                                            0 &&
                                        opponentObjectivesDiscardPile
                                            // .filter(c => c.type !== "Objective")
                                            .map((card, idx, arr) => (
                                                <Paper
                                                    key={card.id}
                                                    style={{
                                                        flexShrink: 0,
                                                        width:
                                                            cardDefaultWidth *
                                                            0.4,
                                                        height:
                                                            cardDefaultHeight *
                                                            0.4,
                                                        margin: `1rem ${
                                                            idx ===
                                                            arr.length - 1
                                                                ? "1rem"
                                                                : ".3rem"
                                                        } 0 ${
                                                            idx === 0
                                                                ? "1rem"
                                                                : "0"
                                                        }`,
                                                        borderRadius: "1rem",
                                                        // border: '3px dashed black',
                                                        // boxSizing: 'border-box',
                                                        backgroundPosition:
                                                            "center center",
                                                        backgroundSize: "cover",
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundImage: `url(/assets/cards/${card.id}.png)`,
                                                    }}
                                                    elevation={10}
                                                    onClick={handleHighlightCard(
                                                        card,
                                                        OBJECTIVES_DISCARDED
                                                    )}
                                                />
                                            ))}
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ marginTop: "1rem" }}>
                                Discarded powers{" "}
                                {`(${
                                    opponentPowersDiscardPile
                                        ? opponentPowersDiscardPile.length
                                        : "empty"
                                })`}
                            </Typography>
                            <Divider />
                            <Grid container>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        overflowX: "scroll",
                                    }}
                                >
                                    {opponentPowersDiscardPile &&
                                        opponentPowersDiscardPile.length > 0 &&
                                        opponentPowersDiscardPile
                                            // .filter(c => c.type !== "Objective")
                                            .map((card, idx, arr) => (
                                                <Paper
                                                    key={card.id}
                                                    style={{
                                                        flexShrink: 0,
                                                        width:
                                                            cardDefaultWidth *
                                                            0.4,
                                                        height:
                                                            cardDefaultHeight *
                                                            0.4,
                                                        margin: `1rem ${
                                                            idx ===
                                                            arr.length - 1
                                                                ? "1rem"
                                                                : ".3rem"
                                                        } 0 ${
                                                            idx === 0
                                                                ? "1rem"
                                                                : "0"
                                                        }`,
                                                        borderRadius: "1rem",
                                                        // border: '3px dashed black',
                                                        // boxSizing: 'border-box',
                                                        backgroundPosition:
                                                            "center center",
                                                        backgroundSize: "cover",
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundImage: `url(/assets/cards/${card.id}.png)`,
                                                    }}
                                                    elevation={10}
                                                    onClick={handleHighlightCard(
                                                        card,
                                                        POWERS_DISCARDED
                                                    )}
                                                />
                                            ))}
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                {highlightCard && (
                    <CardHighlight
                        highlightCard={highlightCard}
                        myFighters={myFighters}
                        highlightFromSource={highlightFromSource}
                        selectedGroup={selectedGroup}
                        handleClickAwayHightlight={handleClickAwayHightlight}
                        handleStopHighlighting={handleStopHighlighting}
                        playCard={playCard}
                        returnToPile={returnToPile}
                        returnToHand={returnToHand}
                        discardCard={discardCard}
                        applyFighterUpgrade={applyUpgrade}
                    />
                )}
            </Container>
        </div>
    );
};

CardsHUD.propTypes = {
    roomId: PropTypes.string,
    myData: PropTypes.object,
    myFighters: PropTypes.array,
    objectivesPile: PropTypes.string,
    powerCardsPile: PropTypes.string,
    serverHand: PropTypes.string,
    enemyHand: PropTypes.string,
    scoredObjectivesPile: PropTypes.string,
    objectivesDiscardPile: PropTypes.string,
    powersDiscardPile: PropTypes.string,
    enemyScoredObjectivesPile: PropTypes.string,
    enemyObjectivesDiscardPile: PropTypes.string,
    enemyPowersDiscardPile: PropTypes.string,
    onClose: PropTypes.func,
};

export default CardsHUD;
