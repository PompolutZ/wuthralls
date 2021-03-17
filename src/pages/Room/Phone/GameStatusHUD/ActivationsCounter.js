import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function ActivationsCounter({
    activationsToMake,
    canEdit,
    onActivationsCounterChanged,
}) {
    const [value, setValue] = useState(activationsToMake);

    useEffect(() => {
        setValue(activationsToMake);
    }, [activationsToMake]);

    const handleMakeActivation = (modifier) => () => {
        if (!canEdit) return;

        const nextValue = value + modifier;
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
                    onClick={handleMakeActivation(1)}
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
                    onClick={handleMakeActivation(-1)}
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

export default ActivationsCounter;
