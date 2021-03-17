import React, { useContext, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useAuthUser } from "../../../../components/Session";
import { FirebaseContext } from "../../../../firebase";
import PropTypes from "prop-types";
import shallow from "zustand/shallow";
import {
    useMyGameState,
    useTheirGameState,
} from "../../hooks/playerStateHooks";
import useUpdateRoom from "../../hooks/useUpdateRoom";
import HUDOverlay from "../../../../components/HUDOverlay";
import RoundCounter from "./RoundCounter";
import CombinedGloryCounter from "./CombinedGloryCounter";
import ActivationsCounter from "./ActivationsCounter";
import PrimacyOwner from "./PrimacyOwner";
import {
    MyNameAndFaction,
    OpponentNameAndFaction,
} from "./PlayerNameAndFaction";

/// Eventually, we should get rid of data property.
/// A thorough investigation of data dependencies is pending...
function GameStatusHUD({ data, onClose }) {
    const updateRoom = useUpdateRoom();
    const [myActivationsLeft, setMyActivationsLeft] = useMyGameState(
        (state) => [state.activationsLeft, state.setActivationsLeft],
        shallow
    );
    const opponentActivationsLeft = useTheirGameState(
        (player) => player.activationsLeft
    );

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
    const [modified, setModified] = useState(false);
    const [payload, setPayload] = useState({});

    useEffect(() => {
        setOpponentValues({
            activationsLeft: opponent ? data[opponent].activationsLeft : 0,
            gloryScored: opponent ? data[opponent].gloryScored : 0,
            glorySpent: opponent ? data[opponent].glorySpent : 0,
        });
    }, [data, opponent]);

    const handleOnGloryChange = (value) => {
        setMyValues({
            ...myValues,
            gloryScored: value.earned,
            glorySpent: value.spent,
        });
        setModified(true);
        setPayload({
            [`${myself.uid}.activationsLeft`]: myValues.activationsLeft,
            [`${myself.uid}.gloryScored`]: value.earned,
            [`${myself.uid}.glorySpent`]: value.spent,
        });
    };

    const handleActivationsLeftChanged = (value) => {
        setMyValues({
            ...myValues,
            activationsLeft: value,
        });
        setModified(true);

        firebase.addGenericMessage2(data.id, {
            author: "Katophrane",
            type: "INFO",
            value: `${myself.username} flipped activation token and has ${value} activations left.`,
        });

        setPayload({
            [`${myself.uid}.activationsLeft`]: value,
            [`${myself.uid}.gloryScored`]: myValues.gloryScored,
            [`${myself.uid}.glorySpent`]: myValues.glorySpent,
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

    const handleCloseOverlay = () => {
        updateRoom(payload);
        onClose();
    };

    return (
        <HUDOverlay
            modified={modified}
            onCloseOverlayClick={handleCloseOverlay}
        >
            <Grid container alignItems="center" direction="column">
                <Grid item>
                    <MyNameAndFaction />
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
                            activationsToMake={myActivationsLeft}
                            onActivationsCounterChanged={
                                handleActivationsLeftChanged
                            }
                            canEdit
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                        }}
                    >
                        <RoundCounter />
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
                                activationsToMake={opponentActivationsLeft}
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
                                <OpponentNameAndFaction />
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </HUDOverlay>
    );
}

GameStatusHUD.propTypes = {
    data: PropTypes.object,
    onModified: PropTypes.func,
};

export default GameStatusHUD;
