import React from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { PICK_FIRST_BOARD } from "./constants/waitingReasons";

function BoardSelectionOrderPicker({ me, opponent, onDecisionMade }) {
    const handleChoice = (pickFirst) => () => {
        const payload = {
            [`status.waitingFor`]: pickFirst ? [me] : [opponent],
            [`status.waitingReason`]: PICK_FIRST_BOARD,
            [`status.willWaitFor`]: pickFirst ? [opponent] : [me],
        };
        onDecisionMade(payload);
    };

    return (
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
                onClick={handleChoice(true)}
            >
                Place 3 Feature tokens
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleChoice(false)}
            >
                Place Boards
            </Button>
        </div>
    );
}

BoardSelectionOrderPicker.propTypes = {
    me: PropTypes.string,
    opponent: PropTypes.string,
    onDecisionMade: PropTypes.function,
};

export default BoardSelectionOrderPicker;
