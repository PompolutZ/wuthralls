import React, { useEffect, useContext, useState } from "react";
import { FirebaseContext } from "../../../firebase";
import { useAuthUser } from "../../../components/Session";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FirstBoardPicker from "./FirstBoardPicker";
import SecondBoardPicker from "./SecondBoardPicker";
import PropTypes from "prop-types";
import PlayerRollOffs from "./OpponentsRollOffs";
import RollOffDiceTray from "./RollOffDiceTray";
import {
    BOARDS_PLACEMENT_ORDER,
    INITIATIVE_ROLL,
    PICK_FIRST_BOARD,
    PICK_SECOND_BOARD,
} from "./constants/waitingReasons";
import InitiativeRollButton from "./InitiativeRollButton";

function InitiativeAndBoardsSetup({ data }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const opponent = data.players.find((id) => id !== myself.uid);
    const [canMakeInitiativeRoll, setCanMakeInitiativeRoll] = useState(
        data.status.waitingFor.includes(myself.uid) &&
            data.status.waitingReason === INITIATIVE_ROLL
    );

    const {
        status: { top, rollOffs, waitingFor, waitingReason, rollOffNumber },
    } = data;

    useEffect(() => {
        if (
            waitingFor.includes(myself.uid) &&
            waitingReason === INITIATIVE_ROLL
        ) {
            setCanMakeInitiativeRoll(true);
        }
    }, [data, myself.uid, waitingFor, waitingReason]);

    const handlePickFirst = () => {
        const payload = {
            // [`status.rollOffNumber`]: rollOffNumber + 1,
            [`status.waitingFor`]: [myself.uid],
            [`status.waitingReason`]: PICK_FIRST_BOARD,
            [`status.willWaitFor`]: [opponent],
        };
        firebase.updateRoom(data.id, payload);
    };

    const handlePickSecond = () => {
        const payload = {
            // [`status.rollOffNumber`]: rollOffNumber + 1,
            [`status.waitingFor`]: [opponent],
            [`status.waitingReason`]: PICK_FIRST_BOARD,
            [`status.willWaitFor`]: [myself.uid],
        };
        firebase.updateRoom(data.id, payload);
    };

    const handlePickTopBoard = (index) => {
        const payload = {
            // [`status.rollOffNumber`]: rollOffNumber + 1,
            [`status.top.id`]: index,
            [`status.waitingReason`]: PICK_SECOND_BOARD,
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

    const update = (payload) => {
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
                waitingReason !== PICK_FIRST_BOARD &&
                waitingReason !== PICK_SECOND_BOARD && (
                    <PlayerRollOffs
                        reverse
                        name={data[myself.uid].name}
                        faction={data[myself.uid].faction}
                        rollOffs={Object.entries(rollOffs).filter(
                            ([id, v]) => id.startsWith(myself.uid) && Boolean(v)
                        )}
                    />
                )}

            <div
                style={{
                    flex:
                        waitingReason === PICK_SECOND_BOARD
                            ? 1
                            : waitingReason === PICK_FIRST_BOARD
                            ? "0 1 60%"
                            : "0 1 10%",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <InitiativeRollButton
                    myuid={myself.uid}
                    opponent={opponent}
                    waitingFor={waitingFor}
                    waitingReason={waitingReason}
                    rollOffs={rollOffs}
                    rollOffNumber={rollOffNumber}
                    onFirebaseUpdate={update}
                />
                {!waitingFor.includes(myself.uid) && (
                    <Typography variant="h4">
                        Waiting for opponent...
                    </Typography>
                )}
                {waitingFor.includes(myself.uid) &&
                    waitingReason === BOARDS_PLACEMENT_ORDER && (
                        <div
                            style={{
                                display: "flex",
                                maxWidth: "80vw",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePickFirst}
                            >
                                Place 3 Feature tokens
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePickSecond}
                            >
                                Place Boards
                            </Button>
                        </div>
                    )}
                {waitingFor.includes(myself.uid) &&
                    waitingReason === PICK_FIRST_BOARD && (
                        <FirstBoardPicker onBoardPicked={handlePickTopBoard} />
                    )}
                {waitingFor.includes(myself.uid) &&
                    waitingReason === PICK_SECOND_BOARD && (
                        <SecondBoardPicker
                            onBoardPicked={handlePickBottomBoard}
                            top={top}
                        />
                    )}
            </div>
            {opponent &&
                waitingReason !== PICK_FIRST_BOARD &&
                waitingReason !== PICK_SECOND_BOARD && (
                    <PlayerRollOffs
                        name={data[opponent].name}
                        faction={data[opponent].faction}
                        rollOffs={Object.entries(rollOffs).filter(
                            ([id, v]) => id.startsWith(opponent) && Boolean(v)
                        )}
                    />
                )}
        </div>
    );
}

InitiativeAndBoardsSetup.propTypes = {
    data: PropTypes.object,
};

export default InitiativeAndBoardsSetup;
