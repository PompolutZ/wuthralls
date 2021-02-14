import React, { useEffect, useContext, useState } from "react";
import { FirebaseContext } from "../../../firebase";
import { useAuthUser } from "../../../components/Session";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AttackDie from "../../../components/AttackDie";
import DefenceDie from "../../../components/DefenceDie";
import { warbandColors } from "../../../data";
import { getDieRollResult } from "../../../common/function";
import FirstBoardPicker from "./FirstBoardPicker";
import SecondBoardPicker from "./SecondBoardPicker";
import PropTypes from "prop-types";

function RollOffDiceTray({ rollResults, faction }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {rollResults.map(([id, roll]) => (
                <div key={id} style={{ display: "flex" }}>
                    {roll.split(",").map((x, i) => (
                        <div
                            key={i}
                            style={{
                                width: 36,
                                height: 36,
                                marginRight: ".2rem",
                                backgroundColor: "white",
                                borderRadius: 36 * 0.2,
                            }}
                        >
                            {i % 2 === 0 && (
                                <DefenceDie
                                    accentColorHex={warbandColors[faction]}
                                    size={36}
                                    side={Number(x)}
                                    useBlackOutline={
                                        faction === "zarbags-gitz" ||
                                        faction === "khagras-ravagers"
                                    }
                                />
                            )}
                            {i % 2 !== 0 && (
                                <AttackDie
                                    accentColorHex={warbandColors[faction]}
                                    size={36}
                                    side={Number(x)}
                                    useBlackOutline={
                                        faction === "zarbags-gitz" ||
                                        faction === "khagras-ravagers"
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

RollOffDiceTray.propTypes = {
    rollResults: PropTypes.array,
    faction: PropTypes.string,
};

function InitiativeAndBoardsSetup({ data }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const opponent = data.players.find((id) => id !== myself.uid);
    const [canMakeInitiativeRoll, setCanMakeInitiativeRoll] = useState(
        data.status.waitingFor.includes(myself.uid) &&
            data.status.waitingReason === "INITIATIVE_ROLL"
    );

    const {
        status: { top, rollOffs, waitingFor, waitingReason, rollOffNumber },
    } = data;

    useEffect(() => {
        if (
            waitingFor.includes(myself.uid) &&
            waitingReason === "INITIATIVE_ROLL"
        ) {
            setCanMakeInitiativeRoll(true);
        }
    }, [data]);

    const handleInitiativeRoll = () => {
        setCanMakeInitiativeRoll(false);
        const rollResult = new Array(4).fill(0).map(getDieRollResult);

        if (waitingFor.some((id) => opponent === id)) {
            // just record because waiting for opponent
            firebase.updateRoom(data.id, {
                [`status.rollOffs.${myself.uid}_${rollOffNumber}`]: rollResult.join(),
                [`status.waitingFor`]: firebase.firestoreArrayRemove(
                    myself.uid
                ),
            });
        } else {
            const opponentResult = rollOffs[`${opponent}_${rollOffNumber}`];
            const opponentScore = opponentResult
                .split(",")
                .map((s) => Number(s))
                .reduce((accumulatedInitiativeResult, dieSideNumber) => {
                    if (dieSideNumber === 6)
                        return accumulatedInitiativeResult + 1091;
                    if (dieSideNumber === 1)
                        return accumulatedInitiativeResult + 79;
                    if (dieSideNumber === 5)
                        return accumulatedInitiativeResult + 3;
                    return accumulatedInitiativeResult;
                }, 0);

            const myScore = rollResult.reduce(
                (accumulatedInitiativeResult, dieSideNumber) => {
                    if (dieSideNumber === 6)
                        return accumulatedInitiativeResult + 1091;
                    if (dieSideNumber === 1)
                        return accumulatedInitiativeResult + 79;
                    if (dieSideNumber === 5)
                        return accumulatedInitiativeResult + 3;
                    return accumulatedInitiativeResult;
                },
                0
            );

            if (myScore === opponentScore) {
                const payload = {
                    [`status.rollOffNumber`]: rollOffNumber + 1,
                    [`status.waitingFor`]: data.players,
                    [`status.waitingReason`]: "INITIATIVE_ROLL",
                    [`status.rollOffs.${myself.uid}_${rollOffNumber}`]: rollResult.join(),
                };

                firebase.updateRoom(data.id, payload);
            } else if (myScore > opponentScore) {
                const payload = {
                    // [`status.rollOffNumber`]: rollOffNumber + 1,
                    [`status.waitingFor`]: [myself.uid],
                    [`status.waitingReason`]: "BOARDS_PLACEMENT_ORDER",
                    [`status.rollOffs.${myself.uid}_${rollOffNumber}`]: rollResult.join(),
                };
                firebase.updateRoom(data.id, payload);
            } else {
                const payload = {
                    // [`status.rollOffNumber`]: rollOffNumber + 1,
                    [`status.waitingFor`]: [opponent],
                    [`status.waitingReason`]: "BOARDS_PLACEMENT_ORDER",
                    [`status.rollOffs.${myself.uid}_${rollOffNumber}`]: rollResult.join(),
                };
                firebase.updateRoom(data.id, payload);
            }
        }
    };

    const handlePickFirst = () => {
        const payload = {
            // [`status.rollOffNumber`]: rollOffNumber + 1,
            [`status.waitingFor`]: [myself.uid],
            [`status.waitingReason`]: "PICK_FIRST_BOARD",
            [`status.willWaitFor`]: [opponent],
        };
        firebase.updateRoom(data.id, payload);
    };

    const handlePickSecond = () => {
        const payload = {
            // [`status.rollOffNumber`]: rollOffNumber + 1,
            [`status.waitingFor`]: [opponent],
            [`status.waitingReason`]: "PICK_FIRST_BOARD",
            [`status.willWaitFor`]: [myself.uid],
        };
        firebase.updateRoom(data.id, payload);
    };

    const handlePickTopBoard = (index) => {
        const payload = {
            // [`status.rollOffNumber`]: rollOffNumber + 1,
            [`status.top.id`]: index,
            [`status.waitingReason`]: "PICK_SECOND_BOARD",
            [`status.waitingFor`]: data.status.willWaitFor,
            [`status.willWaitFor`]: [],
        };
        firebase.updateRoom(data.id, payload);
    };

    const handlePickBottomBoard = (playerChoice) => {
        const payload = {
            [`status.stage`]: "READY",
            [`status.waitingReason`]: "",
            [`status.waitingFor`]: [],
            [`status.willWaitFor`]: [],

            [`status.top`]: playerChoice.top,
            [`status.bottom`]: playerChoice.bottom,
            [`status.orientation`]: playerChoice.orientation,
            [`status.offset`]: playerChoice.offset,
        };
        firebase.updateRoom(data.id, payload);
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "#36393F",
                color: "whitesmoke",
            }}
        >
            {data[myself.uid] &&
                waitingReason !== "PICK_FIRST_BOARD" &&
                waitingReason !== "PICK_SECOND_BOARD" && (
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                    >
                        <RollOffDiceTray
                            rollResults={Object.entries(rollOffs).filter(
                                ([id, v]) =>
                                    id.startsWith(myself.uid) && Boolean(v)
                            )}
                            faction={data[myself.uid].faction}
                        />
                        <div
                            style={{
                                display: "flex",
                                margin: "1rem",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    marginRight: "1rem",
                                    boxSizing: "border-box",
                                    borderRadius: "1.5rem",
                                    border: "2px solid whitesmoke",
                                    display: "flex",
                                }}
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        margin: "auto",
                                    }}
                                    src={`/assets/factions/${
                                        data[myself.uid].faction
                                    }-icon.png`}
                                />
                            </div>
                            <Typography>{data[myself.uid].name}</Typography>
                        </div>
                    </div>
                )}

            <div
                style={{
                    flex:
                        waitingReason === "PICK_SECOND_BOARD"
                            ? 1
                            : waitingReason === "PICK_FIRST_BOARD"
                            ? "0 1 60%"
                            : "0 1 10%",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {waitingFor.includes(myself.uid) &&
                    waitingReason === "INITIATIVE_ROLL" && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleInitiativeRoll}
                            disabled={!canMakeInitiativeRoll}
                        >
                            Roll Initiative
                        </Button>
                    )}
                {!waitingFor.includes(myself.uid) && (
                    <Typography variant="h4">
                        Waiting for opponent...
                    </Typography>
                )}
                {waitingFor.includes(myself.uid) &&
                    waitingReason === "BOARDS_PLACEMENT_ORDER" && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePickFirst}
                            >
                                Pick First
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePickSecond}
                            >
                                Pick Second
                            </Button>
                        </div>
                    )}
                {waitingFor.includes(myself.uid) &&
                    waitingReason === "PICK_FIRST_BOARD" && (
                        <FirstBoardPicker onBoardPicked={handlePickTopBoard} />
                    )}
                {waitingFor.includes(myself.uid) &&
                    waitingReason === "PICK_SECOND_BOARD" && (
                        <SecondBoardPicker
                            onBoardPicked={handlePickBottomBoard}
                            top={top}
                        />
                    )}
            </div>
            {opponent &&
                waitingReason !== "PICK_FIRST_BOARD" &&
                waitingReason !== "PICK_SECOND_BOARD" && (
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                margin: "1rem",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    marginRight: "1rem",
                                    boxSizing: "border-box",
                                    borderRadius: "1.5rem",
                                    border: "2px solid whitesmoke",
                                    display: "flex",
                                }}
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        margin: "auto",
                                    }}
                                    src={`/assets/factions/${data[opponent].faction}-icon.png`}
                                />
                            </div>
                            <Typography variant="h6">
                                {data[opponent].name}
                            </Typography>
                        </div>
                        <RollOffDiceTray
                            rollResults={Object.entries(rollOffs).filter(
                                ([id, v]) =>
                                    id.startsWith(opponent) && Boolean(v)
                            )}
                            faction={data[opponent].faction}
                        />
                    </div>
                )}
        </div>
    );
}

InitiativeAndBoardsSetup.propTypes = {
    data: PropTypes.object,
};

export default InitiativeAndBoardsSetup;
