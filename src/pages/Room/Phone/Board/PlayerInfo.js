import React from "react";
import { Typography } from "@material-ui/core";
import { cardsDb } from "../../../../data";
import {
    useMyGameState,
    useTheirGameState,
} from "../../hooks/playerStateHooks";

const convertHandStringIntoCards = (hand) =>
    hand ? hand.split(",").map((id) => ({ ...cardsDb[id], id })) : [];

function MyStateSummary(props) {
    const faction = useMyGameState((state) => state.faction);
    const gloryScored = useMyGameState((state) => state.gloryScored);
    const glorySpent = useMyGameState((state) => state.glorySpent);
    const activationsLeft = useMyGameState((state) => state.activationsLeft);
    const hasPrimacy = useMyGameState((state) => state.hasPrimacy);
    const hand = useMyGameState((state) =>
        convertHandStringIntoCards(state.hand)
    );

    return (
        <PlayerInfo
            faction={faction}
            gloryScored={gloryScored}
            glorySpent={glorySpent}
            activationsLeft={activationsLeft}
            hasPrimacy={hasPrimacy}
            hand={hand}
            {...props}
        />
    );
}

function OpponentStateSummary(props) {
    const faction = useTheirGameState((state) => state.faction);
    const gloryScored = useTheirGameState((state) => state.gloryScored);
    const glorySpent = useTheirGameState((state) => state.glorySpent);
    const activationsLeft = useTheirGameState((state) => state.activationsLeft);
    const hasPrimacy = useTheirGameState((state) => state.hasPrimacy);

    const hand = useTheirGameState((state) =>
        convertHandStringIntoCards(state.hand)
    );

    return (
        <PlayerInfo
            faction={faction}
            gloryScored={gloryScored}
            glorySpent={glorySpent}
            activationsLeft={activationsLeft}
            hasPrimacy={hasPrimacy}
            hand={hand}
            {...props}
        />
    );
}

function PlayerInfo({
    hasPrimacy,
    faction,
    gloryScored,
    glorySpent,
    activationsLeft,
    style,
    hand = [],
}) {
    const objectivesCount = hand.filter((card) => card.type === "Objective")
        .length;
    const powerCardsCount = hand.length - objectivesCount;

    return (
        <div
            style={{
                ...{
                    display: "flex",
                    alignItems: "center",
                },
                ...style,
            }}
        >
            <div style={{ position: "relative" }}>
                <img
                    src={`/assets/factions/${faction}-icon.png`}
                    style={{
                        width: hasPrimacy ? "2rem" : "1.5rem",
                        height: hasPrimacy ? "2rem" : "1.5rem",
                        paddingLeft: ".2rem",
                    }}
                />
                {hasPrimacy && (
                    <img
                        src={`/assets/other/Primacy.png`}
                        style={{
                            width: "1.2rem",
                            height: "1.2rem",
                            position: "absolute",
                            bottom: 0,
                            left: "50%",
                            marginLeft: "-0.5rem",
                            marginBottom: "-0.6rem",
                            boxSizing: "border-box",
                            border: "2px solid #363a3e",
                            borderRadius: "1rem",
                        }}
                    />
                )}
            </div>

            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-1rem",
                }}
            >
                <div
                    style={{
                        marginLeft: ".2rem",
                        width: "1.2rem",
                        height: "1.2rem",
                        backgroundColor: "goldenrod",
                        borderRadius: "1rem",
                        color: "white",
                        display: "flex",
                    }}
                >
                    <Typography style={{ margin: "auto", fontSize: ".7rem" }}>
                        {gloryScored}
                    </Typography>
                </div>
                <div
                    style={{
                        marginLeft: ".2rem",
                        width: "1.2rem",
                        height: "1.2rem",
                        backgroundColor: "darkgray",
                        borderRadius: "1rem",
                        color: "white",
                        display: "flex",
                    }}
                >
                    <Typography style={{ margin: "auto", fontSize: ".7rem" }}>
                        {glorySpent}
                    </Typography>
                </div>
                <div
                    style={{
                        position: "absolute",
                        margin: "0 -0.7rem",
                        width: "1.5rem",
                        height: "1.5rem",
                        backgroundColor: "goldenrod",
                        borderRadius: "2rem",
                        boxSizing: "border-box",
                        border: "2px solid #363a3e",
                        color: "white",
                        display: "flex",
                        top: "70%",
                        left: "50%",
                    }}
                >
                    <Typography style={{ margin: "auto", fontSize: ".7rem" }}>
                        {gloryScored + glorySpent}
                    </Typography>
                </div>
            </div>
            <div
                style={{
                    marginLeft: ".2rem",
                    width: "1.2rem",
                    height: "1.2rem",
                    backgroundColor: "teal",
                    borderRadius: "1rem",
                    color: "white",
                    display: "flex",
                }}
            >
                <Typography style={{ margin: "auto", fontSize: ".7rem" }}>
                    {activationsLeft}
                </Typography>
            </div>
            <div
                style={{
                    marginLeft: ".2rem",
                    width: "1rem",
                    height: "1.5rem",
                    backgroundColor: "goldenrod",
                    borderRadius: ".2rem",
                    color: "white",
                    display: "flex",
                }}
            >
                <Typography style={{ margin: "auto", fontSize: ".7rem" }}>
                    {objectivesCount}
                </Typography>
            </div>
            <div
                style={{
                    marginLeft: ".2rem",
                    width: "1rem",
                    height: "1.5rem",
                    backgroundColor: "teal",
                    borderRadius: ".2rem",
                    color: "white",
                    display: "flex",
                }}
            >
                <Typography style={{ margin: "auto", fontSize: ".7rem" }}>
                    {powerCardsCount}
                </Typography>
            </div>
        </div>
    );
}

export { MyStateSummary, OpponentStateSummary };
