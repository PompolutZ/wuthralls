import React, { useContext, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useAuthUser } from "../../../components/Session";
import { FirebaseContext } from "../../../firebase";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import PropTypes from "prop-types";

function RoundCounter({ round, onRoundChange }) {
    const [value, setValue] = useState(round);

    const handleChangeValue = (changeBy) => () => {
        const nextValue = value + changeBy > 1 ? value + changeBy : 1;
        setValue(nextValue);
        if (value === nextValue) return;
        onRoundChange(nextValue);
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <ButtonBase
                onClick={handleChangeValue(-1)}
                style={{
                    backgroundColor: "green",
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "1.5rem",
                    border: "3px solid white",
                    color: "white",
                    boxSizing: "border-box",
                }}
            >
                <RemoveIcon />
            </ButtonBase>
            <div
                style={{
                    display: "flex",
                    position: "relative",
                    width: "5rem",
                    height: "5rem",
                    borderRadius: "4rem",
                    border: "2px solid white",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        color: "white",
                        fontSize: "4rem",
                        fontWeight: "bold",
                    }}
                >
                    {value}
                </div>
                <div
                    style={{
                        backgroundImage: `url(/assets/other/roundToken.png)`,
                        backgroundPosition: "center, center",
                        backgroundSize: "cover",
                        width: "5rem",
                        height: "5rem",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        opacity: ".9",
                        zIndex: -1,
                    }}
                />
            </div>
            <ButtonBase
                onClick={handleChangeValue(1)}
                style={{
                    backgroundColor: "red",
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "1.5rem",
                    border: "3px solid white",
                    color: "white",
                    boxSizing: "border-box",
                }}
            >
                <AddIcon />
            </ButtonBase>
        </div>
    );
}

RoundCounter.propTypes = {
    round: PropTypes.number,
    onRoundChange: PropTypes.func,
};

function CombinedGloryCounter({
    canEdit,
    glory = 0,
    glorySpent = 0,
    onGloryChange,
}) {
    const [gloryEarned, setGloryEarned] = useState(glory);
    const [gloryUsed, setGloryUsed] = useState(glorySpent);

    const handleChangeEarnedGlory = (mod) => () => {
        const nextValue = gloryEarned + mod >= 0 ? gloryEarned + mod : 0;
        setGloryEarned(nextValue);
        onGloryChange({ earned: nextValue, spent: gloryUsed });
    };

    const handleChangeGloryUsed = (mod) => () => {
        const nextValue = gloryUsed + mod;
        setGloryUsed(nextValue >= 0 ? nextValue : 0);
        setGloryEarned(gloryEarned - mod >= 0 ? gloryEarned - mod : 0);
        onGloryChange({
            earned: gloryEarned - mod >= 0 ? gloryEarned - mod : 0,
            spent: nextValue,
        });
    };

    return (
        <Grid container spacing={3} justify="center" alignItems="center">
            {canEdit && (
                <Grid item xs={4}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: ".5rem",
                        }}
                    >
                        <ButtonBase
                            style={{
                                width: "3rem",
                                height: "3rem",
                                backgroundColor: "darkred",
                                color: "white",
                                boxSizing: "border-box",
                                border: "3px solid white",
                                borderRadius: "1.5rem",
                            }}
                            onClick={handleChangeEarnedGlory(-1)}
                        >
                            <RemoveIcon />
                        </ButtonBase>

                        <ButtonBase
                            style={{
                                width: "3rem",
                                height: "3rem",
                                backgroundColor: "teal",
                                color: "white",
                                boxSizing: "border-box",
                                border: "3px solid white",
                                borderRadius: "1.5rem",
                            }}
                            onClick={handleChangeEarnedGlory(1)}
                        >
                            <AddIcon />
                        </ButtonBase>
                    </div>
                </Grid>
            )}
            <Grid item xs={4}>
                <div style={{ position: "relative" }}>
                    <img
                        src={`/assets/other/gloryCounter.png`}
                        alt="glory counter"
                        style={{ width: "100%" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            top: 0,
                            left: 0,
                            display: "flex",
                            alignItems: "center",
                            color: "white",
                        }}
                    >
                        <div style={{ flex: 1, display: "flex" }}>
                            <Typography
                                style={{ fontSize: "2.5rem", margin: "auto" }}
                            >
                                {gloryEarned}
                            </Typography>
                        </div>
                        <div style={{ flex: 1, display: "flex" }}>
                            <Typography
                                style={{ fontSize: "2.5rem", margin: "auto" }}
                            >
                                {gloryUsed}
                            </Typography>
                        </div>
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            width: "2rem",
                            height: "2rem",
                            boxSizing: "border-box",
                            border: "2px solid white",
                            borderRadius: "1rem",
                            backgroundColor: "goldenrod",
                            color: "white",
                            zIndex: 1,
                            bottom: "0%",
                            left: "50%",
                            marginLeft: "-1rem",
                            marginBottom: "-1rem",
                            display: "flex",
                        }}
                    >
                        <Typography style={{ margin: "auto" }}>
                            {gloryEarned + gloryUsed}
                        </Typography>
                    </div>
                </div>
            </Grid>
            {canEdit && (
                <Grid item xs={4}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: ".5rem",
                        }}
                    >
                        <ButtonBase
                            style={{
                                width: "3rem",
                                height: "3rem",
                                backgroundColor: "teal",
                                color: "white",
                                boxSizing: "border-box",
                                border: "3px solid white",
                                borderRadius: "1.5rem",
                            }}
                            onClick={handleChangeGloryUsed(1)}
                        >
                            <AddIcon />
                        </ButtonBase>

                        <ButtonBase
                            style={{
                                width: "3rem",
                                height: "3rem",
                                backgroundColor: "darkred",
                                color: "white",
                                boxSizing: "border-box",
                                border: "3px solid white",
                                borderRadius: "1.5rem",
                            }}
                            onClick={handleChangeGloryUsed(-1)}
                            disabled={gloryUsed === 0}
                        >
                            <RemoveIcon />
                        </ButtonBase>
                    </div>
                </Grid>
            )}
        </Grid>
    );
}

CombinedGloryCounter.propTypes = {
    canEdit: PropTypes.bool,
    glory: PropTypes.number,
    glorySpent: PropTypes.number,
    onGloryChange: PropTypes.func,
};

function ActivationsCounter({
    activationsToMake,
    canEdit,
    onActivationsCounterChanged,
}) {
    const [value, setValue] = useState(activationsToMake);

    const handleMakeActivation = () => {
        if (!canEdit) return;

        const nextValue = value - 1;
        setValue(nextValue);
        onActivationsCounterChanged(nextValue);
    };

    const handleUndoActivation = () => {
        if (!canEdit) return;

        const nextValue = value + 1;
        setValue(nextValue);
        onActivationsCounterChanged(nextValue);
    };

    return (
        <div style={{ display: "flex" }}>
            {new Array(4 - value).fill(1).map((_, idx) => (
                <img
                    key={idx}
                    src={`/assets/other/activationTokenSpent.png`}
                    style={{
                        width: "5rem",
                        height: "5rem",
                        margin: "auto .1rem",
                    }}
                    onClick={handleUndoActivation}
                />
            ))}
            {new Array(value).fill(1).map((v, idx) => (
                <img
                    key={idx}
                    src={`/assets/other/activationToken_universal.png`}
                    style={{
                        width: "5rem",
                        height: "5rem",
                        margin: "auto .1rem",
                    }}
                    onClick={handleMakeActivation}
                />
            ))}
        </div>
    );
}

ActivationsCounter.propTypes = {
    activationsToMake: PropTypes.number,
    canEdit: PropTypes.bool,
    onActivationsCounterChanged: PropTypes.func,
};

function PrimacyOwner({ ownership, me, onOwnershipChange }) {
    const [[opponent, hasPrimacy]] = Object.entries(ownership).filter(
        ([k]) => k !== me
    );

    const handleClaimPrimacy = (owner) => () => {
        const payload = {
            [me]: false,
            [opponent]: false,
        };

        payload[owner] = true;
        onOwnershipChange(payload);
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                margin: "0 1rem",
            }}
        >
            <img
                src="/assets/other/Primacy.png"
                style={{
                    width: "2rem",
                    height: "2rem",
                    opacity: ownership[me] ? 1 : 0.5,
                }}
                onClick={handleClaimPrimacy(me)}
            />
            <Divider />
            <img
                src="/assets/other/Primacy.png"
                style={{
                    width: "2rem",
                    height: "2rem",
                    opacity: hasPrimacy ? 1 : 0.5,
                }}
                onClick={handleClaimPrimacy(opponent)}
            />
        </div>
    );
}

PrimacyOwner.propTypes = {
    ownership: PropTypes.object,
    me: PropTypes.string,
    onOwnershipChange: PropTypes.func,
};

function GameStatusHUD({ data, onModified }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [myValues, setMyValues] = useState({
        activationsLeft: data[myself.uid].activationsLeft,
        gloryScored: data[myself.uid].gloryScored,
        glorySpent: data[myself.uid].glorySpent,
    });

    const opponent = data.players.find((p) => p !== myself.uid);
    const [opponentValues, setOpponentValues] = useState({
        activationsLeft: opponent ? data[opponent].activationsLeft : 0,
        gloryScored: opponent ? data[opponent].gloryScored : 0,
        glorySpent: opponent ? data[opponent].glorySpent : 0,
    });

    useEffect(() => {
        setOpponentValues({
            activationsLeft: opponent ? data[opponent].activationsLeft : 0,
            gloryScored: opponent ? data[opponent].gloryScored : 0,
            glorySpent: opponent ? data[opponent].glorySpent : 0,
        });
    }, [data]);

    const handleOnGloryChange = (value) => {
        setMyValues({
            ...myValues,
            gloryScored: value.earned,
            glorySpent: value.spent,
        });

        onModified({
            save: () => {
                firebase.updateRoom(data.id, {
                    [`${myself.uid}.activationsLeft`]: myValues.activationsLeft,
                    [`${myself.uid}.gloryScored`]: value.earned,
                    [`${myself.uid}.glorySpent`]: value.spent,
                });
            },
        });
    };

    const handleActivationsLeftChanged = (value) => {
        setMyValues({
            ...myValues,
            activationsLeft: value,
        });

        firebase.addGenericMessage2(data.id, {
            author: "Katophrane",
            type: "INFO",
            value: `${myself.username} flipped activation token and has ${value} activations left.`,
        });

        onModified({
            save: () => {
                firebase.updateRoom(data.id, {
                    [`${myself.uid}.activationsLeft`]: value,
                    [`${myself.uid}.gloryScored`]: myValues.gloryScored,
                    [`${myself.uid}.glorySpent`]: myValues.glorySpent,
                });
            },
        });
    };

    const handleRoundCounterChange = (value) => {
        setMyValues({
            ...myValues,
            activationsLeft: 4,
        });

        setOpponentValues({
            ...opponentValues,
            activationsLeft: 4,
        });

        const fightersWithoutTokens = Object.entries(
            data.board.fighters
        ).reduce(
            (r, [fighterId, fighterData]) => ({
                ...r,
                [fighterId]: { ...fighterData, tokens: "" },
            }),
            {}
        );

        firebase.updateRoom(data.id, {
            [`status.round`]: value,
            ...data.players.reduce(
                (r, p) => ({ ...r, [`${p}.activationsLeft`]: 4 }),
                {}
            ),
            [`board.fighters`]: fightersWithoutTokens,
        });

        firebase.addGenericMessage2(data.id, {
            author: "Katophrane",
            type: "INFO",
            value: `${myself.username} has started round ${value}.`,
        });
    };

    const handleOwnershipChange = (value) => {
        firebase.updateRoom(data.id, {
            [`status.primacy`]: value,
        });

        firebase.addGenericMessage2(data.id, {
            author: "Katophrane",
            type: "INFO",
            value: `${
                value[myself.uid] ? myself.username : data[opponent].name
            } has claimed Primacy token.`,
        });
    };

    return (
        <Grid container alignItems="center" direction="column">
            <Grid item>
                <Typography variant="h6">{myself.username}</Typography>
            </Grid>
            <Grid item xs={12}>
                <CombinedGloryCounter
                    canEdit
                    glory={myValues.gloryScored}
                    glorySpent={myValues.glorySpent}
                    onGloryChange={handleOnGloryChange}
                />
            </Grid>
            <Grid item xs={12} style={{ marginTop: "1rem" }}>
                <Grid container justify="center">
                    <ActivationsCounter
                        activationsToMake={myValues.activationsLeft}
                        onActivationsCounterChanged={
                            handleActivationsLeftChanged
                        }
                        canEdit
                    />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <div style={{ display: "flex", width: "100%" }}>
                    <RoundCounter
                        round={data.status.round}
                        onRoundChange={handleRoundCounterChange}
                    />
                    {data.status.primacy && (
                        <PrimacyOwner
                            ownership={data.status.primacy}
                            me={myself.uid}
                            onOwnershipChange={handleOwnershipChange}
                        />
                    )}
                </div>
            </Grid>
            <Grid item xs={4}></Grid>

            {Boolean(opponent) && (
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <ActivationsCounter
                            activationsToMake={opponentValues.activationsLeft}
                            canEdit={false}
                        />
                    </Grid>

                    <Grid container justify="center">
                        <Grid item xs={12} style={{ marginTop: "1rem" }}>
                            <CombinedGloryCounter
                                canEdit={false}
                                glory={opponentValues.gloryScored}
                                glorySpent={opponentValues.glorySpent}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        justify="center"
                        style={{ marginTop: "1rem" }}
                    >
                        <Grid item>
                            <Typography variant="h6">
                                {data[opponent].name}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
}

GameStatusHUD.propTypes = {
    data: PropTypes.object,
    onModified: PropTypes.func,
};

export default GameStatusHUD;
