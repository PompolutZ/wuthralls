import React, { useState } from "react";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { useAuthUser } from "../../../../components/Session";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";

import CardHighlight from "./CardHighlight";
import { shuffle } from "../../../../utils";
import CloseHUDButton from "./CloseHUDButton";
import { cardDefaultHeight, cardDefaultWidth } from "../../../../constants/mix";
import DrawPile from "./DrawPile";
import {
    useMyGameState,
    useTheirGameState,
} from "../../hooks/playerStateHooks";
import useUpdateGameLog, {
    createAppliedUpgradePayload,
    createPlayerPlayedPowerCardPayload,
    createPlayerScoredObjectiveCardPayload,
    createPlayerDiscardedPowerCardPayload,
    createPlayerDiscardedObjectiveCardPayload,
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
import CardsRow from "./CardsRow";

const CardsHUD = ({
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
    const [highlightCard, setHighlightCard] = useState(null);
    const [highlightFromSource, setHighlightFromSource] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(MY_CARDS_GROUP);
    const [modified, setModified] = useState(false);
    const [pendingUpgrades, setPendingUpgrades] = useState({});

    const opponentHand = useTheirGameState((state) =>
        stringToCards(state.hand)
    );
    const opponentScoreObjectivesPile = useTheirGameState((state) =>
        stringToCards(state.sObjs)
    );
    const opponentObjectivesDiscardPile = useTheirGameState((state) =>
        stringToCards(state.dObjs)
    );
    const opponentPowersDiscardPile = useTheirGameState((state) =>
        stringToCards(state.dPws)
    );

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

    const curryHighlightCard = (source) => (card) => () => {
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

            updateGameLog(
                `**${myself.username}** has returned scored objective card back to hand.`
            );
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

            updateGameLog(
                `**${myself.username}** has returned discarded objective card back to hand.`
            );
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

            updateGameLog(
                `**${myself.username}** has returned discarded power card back to hand.`
            );
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
        if (card.type === "Objective") {
            const [nextSource, nextDestination] = moveCard(
                card.id,
                hand,
                discardedObjectives
            );
            updateMyDeck("hand", nextSource.join());
            updateMyDeck("dObjs", nextDestination.join());
            updateGameLog(
                createPlayerDiscardedObjectiveCardPayload(
                    card.id,
                    `**${myself.username}** discarded objective card: **${card.name}**.`
                )
            );
        } else {
            const [nextSource, nextDestination] = moveCard(
                card.id,
                hand,
                discardedPowers
            );
            updateMyDeck("hand", nextSource.join());
            updateMyDeck("dPws", nextDestination.join());

            updateGameLog(
                createPlayerDiscardedPowerCardPayload(
                    card.id,
                    `**${myself.username}** discarded power card: **${card.name}**.`
                )
            );
        }

        resetHighlight();
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
                backgroundColor: "rgba(0,0,0,.3)",
            }}
        >
            <Container maxWidth="md" style={{ paddingBottom: "3rem" }}>
                <CloseHUDButton modified={modified} onClick={handleClose} />

                <Grid container style={{ marginTop: "2.5rem" }}>
                    <Grid item xs={12}>
                        <ButtonGroup
                            fullWidth
                            aria-label="full width outlined button group"
                            style={{ marginBottom: ".5rem", color: "white" }}
                        >
                            <Button
                                onClick={selectGroup(MY_CARDS_GROUP)}
                                variant={
                                    selectedGroup !== MY_CARDS_GROUP
                                        ? "contained"
                                        : ""
                                }
                                color={
                                    selectedGroup !== MY_CARDS_GROUP
                                        ? "primary"
                                        : ""
                                }
                                style={{ color: "white", borderColor: "white" }}
                            >
                                My Cards
                            </Button>
                            <Button
                                onClick={selectGroup(ENEMY_CARDS_GROUP)}
                                variant={
                                    selectedGroup !== ENEMY_CARDS_GROUP
                                        ? "contained"
                                        : ""
                                }
                                color={
                                    selectedGroup !== ENEMY_CARDS_GROUP
                                        ? "primary"
                                        : ""
                                }
                                style={{ color: "white", borderColor: "white" }}
                            >
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
                        <CardsRow
                            title="Objectives"
                            cards={hand.filter((c) => c.type === "Objective")}
                            onHighlightCard={curryHighlightCard(
                                OBJECTIVES_HAND
                            )}
                        />
                        <CardsRow
                            title="Power cards"
                            cards={hand.filter((c) => c.type !== "Objective")}
                            onHighlightCard={curryHighlightCard(POWERS_HAND)}
                        />
                        <CardsRow
                            title="Scored objectives"
                            cards={scoredObjectives}
                            onHighlightCard={curryHighlightCard(
                                OBJECTIVES_SCORED
                            )}
                        />
                        <CardsRow
                            title="Discarded objectives"
                            cards={discardedObjectives}
                            onHighlightCard={curryHighlightCard(
                                OBJECTIVES_DISCARDED
                            )}
                        />
                        <CardsRow
                            title="Discarded powers"
                            cards={discardedPowers}
                            onHighlightCard={curryHighlightCard(
                                POWERS_DISCARDED
                            )}
                        />
                    </Grid>
                )}

                {selectedGroup === ENEMY_CARDS_GROUP && (
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography
                                style={{ marginTop: "1rem", color: "white" }}
                            >
                                {`Opponent's Hand (${
                                    opponentHand ? opponentHand.length : "empty"
                                })`}
                            </Typography>
                            <Divider />
                            <Grid container style={{ marginTop: "1rem" }}>
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
                        <CardsRow
                            title="Scored objectives"
                            cards={opponentScoreObjectivesPile}
                            onHighlightCard={curryHighlightCard(
                                OBJECTIVES_SCORED
                            )}
                        />
                        <CardsRow
                            title="Discarded objectives"
                            cards={opponentObjectivesDiscardPile}
                            onHighlightCard={curryHighlightCard(
                                OBJECTIVES_DISCARDED
                            )}
                        />
                        <CardsRow
                            title="Discarded powers"
                            cards={opponentPowersDiscardPile}
                            onHighlightCard={curryHighlightCard(
                                POWERS_DISCARDED
                            )}
                        />
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
