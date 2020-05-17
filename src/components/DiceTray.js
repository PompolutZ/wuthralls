import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Die from "./Die";
import PropTypes from "prop-types";

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function DiceTray({
    defaultAmount,
    onRollBeingMade,
    canReduce,
    canIncrease,
    rollResult,
    canRoll,
}) {
    const [values, setValues] = useState(
        rollResult
            ? new Array(rollResult)
            : defaultAmount
            ? new Array(defaultAmount).fill(1)
            : []
    );

    const handleRollClick = () => {
        const updated = values.map(getRandomIntInclusive(1, 6));
        setValues(updated);
        onRollBeingMade(updated);
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
        <div style={{ display: "flex", flexFlow: "column nowrap" }}>
            <div style={{ display: "flex" }}>
                {values.length > 0 &&
                    values.map((x, i) => (
                        <Die
                            key={i}
                            side={x}
                            type="ATTACK"
                            style={{
                                width: "3rem",
                                height: "3rem",
                                marginRight: ".2rem",
                            }}
                        />
                    ))}
            </div>
            <div style={{ display: "flex" }}>
                {canReduce && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleMakeLess}
                    >
                        Less
                    </Button>
                )}

                <Button onClick={handleRollClick} disabled={!canRoll}>
                    Roll
                </Button>

                {canIncrease && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddMore}
                    >
                        More
                    </Button>
                )}
            </div>
        </div>
    );
}

DiceTray.propTypes = {
    defaultAmount: PropTypes.number,
    onRollBeingMade: PropTypes.func,
    canReduce: PropTypes.bool,
    canIncrease: PropTypes.bool,
    rollResult: PropTypes.array,
    canRoll: PropTypes.bool,
};

export default DiceTray;
