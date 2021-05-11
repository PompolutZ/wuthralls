import React, { useState, useContext, useEffect } from "react";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Grid from "@material-ui/core/Grid";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useMyGameState } from "../../../../hooks/playerStateHooks";
import AttackDie from "../../../../../../components/AttackDie";
import DefenceDie from "../../../../../../components/DefenceDie";
import MagicDie from "../../../../../../components/MagicDie";
import { useAuthUser } from "../../../../../../components/Session";
import { FirebaseContext } from "../../../../../../firebase";
import { warbandColors } from "../../../../../../data";
import { getDieRollResult } from "../../../../../../utils";
import { useDiceRoll } from "../../../../hooks/useUpdateGameLog";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        position: "relative",
        "&::-webkit-scrollbar-thumb": {
            width: "10px",
            height: "10px",
        },
        display: "flex",
    },

    itemsContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
    },

    diceContainer: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        background: "#363a3e",
        padding: "1rem .5rem",
    },

    sendButton: {
        color: "rgba(255,255,255, .9)",
    },
}));

function AttackDiceRoller({ values = [], onChangeDiceAmount }) {
    const maxAmountOfDiceToRoll = 7;
    const classes = useStyles();
    const myFaction = useMyGameState((state) => state.faction);

    return (
        <div className={classes.diceContainer}>
            {values
                .sort((x, y) => y - x)
                .map((value, i) => (
                    <div
                        key={i}
                        style={{
                            background: "#fcfcfc",
                            borderRadius: ".5rem",
                            margin: "0 .25rem",
                            opacity: 1,
                            cursor: "pointer",
                        }}
                        onClick={() => onChangeDiceAmount(i + 1)}
                    >
                        <AttackDie
                            accentColorHex={warbandColors[myFaction]}
                            size={36}
                            side={value}
                            useBlackOutline={
                                myFaction === "zarbags-gitz" ||
                                myFaction === "khagras-ravagers"
                            }
                        />
                    </div>
                ))}
            {new Array(maxAmountOfDiceToRoll - values.length)
                .fill(1)
                .map((value, i) => (
                    <div
                        key={i * 31}
                        style={{
                            background: "#fcfcfc",
                            borderRadius: ".5rem",
                            margin: "0 .25rem",
                            opacity: 0.2,
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            onChangeDiceAmount(values.length + i + 1)
                        }
                    >
                        <AttackDie
                            accentColorHex={warbandColors[myFaction]}
                            size={36}
                            side={value}
                            useBlackOutline={
                                myFaction === "zarbags-gitz" ||
                                myFaction === "khagras-ravagers"
                            }
                        />
                    </div>
                ))}
        </div>
    );
}

export function DiceRoller({ type }) {
    const classes = useStyles();
    const [values, setValues] = useState(new Array(2).fill(1));
    const sendRollResult = useDiceRoll();

    const handleSendRollResult = () => {
        const rollResult = values.map(getDieRollResult);
        setValues(rollResult);

        sendRollResult(type, rollResult);
    };

    return (
        <div className={classes.root}>
            <AttackDiceRoller
                values={values}
                onChangeDiceAmount={(count) =>
                    setValues(new Array(count).fill(1))
                }
            />
            <Button
                className={classes.sendButton}
                onClick={handleSendRollResult}
            >
                <SendIcon />
            </Button>
        </div>
    );
}

function RollDiceAction({ roomId, rollResult, defaultAmount, myFaction }) {
    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [canReduce, setCanReduce] = useState(false);
    const [canIncrease, setCanIncrease] = useState(false);
    const [selectedType, setSelectedType] = useState("INITIATIVE");
    const [values, setValues] = useState(
        rollResult
            ? new Array(rollResult)
            : defaultAmount
            ? new Array(defaultAmount).fill(1)
            : []
    );

    const handleSendTextMessage = async () => {
        const updated = values.map(getDieRollResult);
        setValues(updated);

        await firebase.addDiceRoll2(roomId, {
            uid: myself.uid,
            type: selectedType,
            value: updated.join(),
        });
    };

    const handleSwitchTo = (type) => () => {
        setSelectedType(type);
        setCanIncrease(true);
        setCanReduce(true);

        if (type === "ATTACK") {
            setValues([1, 1]);
        } else if (type === "DEFENCE") {
            setValues([1]);
        } else if (type === "MAGIC") {
            setValues([1]);
        } else {
            setValues([1, 1, 1, 1]);
            setCanReduce(false);
            setCanIncrease(false);
        }
    };

    const handleAddMore = () => {
        setValues((prev) => [...prev, 1]);
    };

    const handleMakeLess = () => {
        setValues((prev) => prev.slice(1));
    };

    useEffect(() => {
        if (rollResult) {
            setValues(rollResult.split(","));
        }
    }, [rollResult]);

    return (
        <div className={classes.root}>
            <div className={classes.itemsContainer}>
                <Grid item xs={12} md={6} style={{ marginTop: "2rem" }}>
                    <Grid
                        container
                        spacing={1}
                        direction="column"
                        alignItems="center"
                    >
                        <Grid item>
                            <ButtonGroup
                                variant="text"
                                size="small"
                                aria-label="small contained button group"
                            >
                                <Button
                                    color={
                                        selectedType === "ATTACK"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={handleSwitchTo("ATTACK")}
                                >
                                    Attack
                                </Button>
                                <Button
                                    color={
                                        selectedType === "DEFENCE"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={handleSwitchTo("DEFENCE")}
                                >
                                    Defence
                                </Button>
                                <Button
                                    color={
                                        selectedType === "MAGIC"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={handleSwitchTo("MAGIC")}
                                >
                                    Magic
                                </Button>
                                <Button
                                    color={
                                        selectedType === "INITIATIVE"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={handleSwitchTo("INITIATIVE")}
                                >
                                    Initiative
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Grid>
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        alignItems: "center",
                        alignSelf: "center",
                    }}
                >
                    {canReduce && (
                        <ButtonBase
                            variant="contained"
                            color="primary"
                            onClick={handleMakeLess}
                            style={{
                                width: "2rem",
                                height: "2rem",
                            }}
                        >
                            <RemoveIcon
                                style={{
                                    width: "2rem",
                                    height: "2rem",
                                }}
                            />
                        </ButtonBase>
                    )}

                    {values.length > 0 &&
                        values.map((x, i) => (
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
                                {selectedType === "ATTACK" && (
                                    <AttackDie
                                        accentColorHex={
                                            warbandColors[myFaction]
                                        }
                                        size={36}
                                        side={x}
                                        useBlackOutline={
                                            myFaction === "zarbags-gitz" ||
                                            myFaction === "khagras-ravagers"
                                        }
                                    />
                                )}
                                {selectedType === "DEFENCE" && (
                                    <DefenceDie
                                        accentColorHex={
                                            warbandColors[myFaction]
                                        }
                                        size={36}
                                        side={x}
                                        useBlackOutline={
                                            myFaction === "zarbags-gitz" ||
                                            myFaction === "khagras-ravagers"
                                        }
                                    />
                                )}
                                {selectedType === "MAGIC" && (
                                    <MagicDie size={36} side={x} />
                                )}
                                {selectedType === "INITIATIVE" &&
                                    i % 2 === 0 && (
                                        <DefenceDie
                                            accentColorHex={
                                                warbandColors[myFaction]
                                            }
                                            size={36}
                                            side={x}
                                            useBlackOutline={
                                                myFaction === "zarbags-gitz" ||
                                                myFaction === "khagras-ravagers"
                                            }
                                        />
                                    )}
                                {selectedType === "INITIATIVE" &&
                                    i % 2 !== 0 && (
                                        <AttackDie
                                            accentColorHex={
                                                warbandColors[myFaction]
                                            }
                                            size={36}
                                            side={x}
                                            useBlackOutline={
                                                myFaction === "zarbags-gitz" ||
                                                myFaction === "khagras-ravagers"
                                            }
                                        />
                                    )}
                            </div>
                        ))}
                    {canIncrease && (
                        <ButtonBase
                            variant="contained"
                            color="primary"
                            onClick={handleAddMore}
                            style={{
                                width: "2rem",
                                height: "2rem",
                            }}
                        >
                            <AddIcon
                                style={{
                                    width: "2rem",
                                    height: "2rem",
                                }}
                            />
                        </ButtonBase>
                    )}
                </div>
                <Button
                    onClick={handleSendTextMessage}
                    style={{
                        flex: "0 0 auto",
                        alignSelf: "flex-end",
                        margin: "0 1rem 1.5rem 0",
                    }}
                >
                    <SendIcon />
                </Button>
            </div>
        </div>
    );
}

RollDiceAction.propTypes = {
    roomId: PropTypes.string,
    rollResult: PropTypes.string,
    defaultAmount: PropTypes.number,
    myFaction: PropTypes.string,
};

export default RollDiceAction;
