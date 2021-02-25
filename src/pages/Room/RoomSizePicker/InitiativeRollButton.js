import React, { useState } from "react";
import { getDieRollResult } from "../../../utils";
import {
    BOARDS_PLACEMENT_ORDER,
    INITIATIVE_ROLL,
} from "./constants/waitingReasons";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { firestoreArrayRemove } from "../../../firebase/firebase";

function InitiativeRollButton({
    myuid,
    opponent,
    waitingFor,
    waitingReason,
    rollOffs,
    rollOffNumber,
    onFirebaseUpdate,
}) {
    const [canMakeInitiativeRoll, setCanMakeInitiativeRoll] = useState(
        waitingFor.includes(myuid) && waitingReason === INITIATIVE_ROLL
    );

    const handleInitiativeRoll = () => {
        setCanMakeInitiativeRoll(false);
        const rollResult = new Array(4).fill(0).map(getDieRollResult);

        let payload = undefined;
        if (waitingFor.some((id) => opponent === id)) {
            payload = {
                [`status.rollOffs.${myuid}_${rollOffNumber}`]: rollResult.join(),
                [`status.waitingFor`]: firestoreArrayRemove(myuid),
            };
        } else {
            const opponentResult = rollOffs[`${opponent}_${rollOffNumber}`];
            const opponentScore = sumByDiceSideWeights(
                opponentResult.split(",").map(Number)
            );
            const myScore = sumByDiceSideWeights(rollResult);

            if (myScore === opponentScore) {
                payload = {
                    [`status.rollOffNumber`]: rollOffNumber + 1,
                    [`status.waitingFor`]: [myuid, opponent],
                    [`status.waitingReason`]: INITIATIVE_ROLL,
                    [`status.rollOffs.${myuid}_${rollOffNumber}`]: rollResult.join(),
                };
            } else if (myScore > opponentScore) {
                payload = {
                    [`status.waitingFor`]: [myuid],
                    [`status.waitingReason`]: BOARDS_PLACEMENT_ORDER,
                    [`status.rollOffs.${myuid}_${rollOffNumber}`]: rollResult.join(),
                };
            } else {
                payload = {
                    [`status.waitingFor`]: [opponent],
                    [`status.waitingReason`]: BOARDS_PLACEMENT_ORDER,
                    [`status.rollOffs.${myuid}_${rollOffNumber}`]: rollResult.join(),
                };
            }
        }

        onFirebaseUpdate(payload);
    };

    return canMakeInitiativeRoll ? (
        <Button
            variant="contained"
            color="primary"
            onClick={handleInitiativeRoll}
        >
            Roll Initiative
        </Button>
    ) : null;
}

InitiativeRollButton.propTypes = {
    myuid: PropTypes.string,
    opponent: PropTypes.string,
    waitingFor: PropTypes.array,
    waitingReason: PropTypes.string,
    rollOffs: PropTypes.object,
    rollOffNumber: PropTypes.number,
    onFirebaseUpdate: PropTypes.func,
};

function sumByDiceSideWeights(rolledDice) {
    return rolledDice.reduce((accumulatedInitiativeResult, dieSideNumber) => {
        if (dieSideNumber === 6) return accumulatedInitiativeResult + 1091;
        if (dieSideNumber === 1) return accumulatedInitiativeResult + 79;
        if (dieSideNumber === 5) return accumulatedInitiativeResult + 3;
        return accumulatedInitiativeResult;
    }, 0);
}

export default InitiativeRollButton;
