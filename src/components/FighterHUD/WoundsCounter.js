import React, { useState, useEffect } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import PropTypes from "prop-types";

function WoundsCounter({ wounds, onWoundsCounterChange }) {
    const [value, setValue] = useState(wounds);

    useEffect(() => {
        onWoundsCounterChange(value);
    }, [value]);

    const handleChangeValue = (changeBy) => () => {
        setValue((prev) => {
            const nextValue = prev + changeBy;
            return nextValue >= 0 ? nextValue : 0;
        });
    };

    return (
        <div
            style={{
                display: "flex",
                position: "absolute",
                top: ".3rem",
                left: "-2.5rem",
                alignItems: "flex-end",
            }}
        >
            <ButtonBase
                onClick={handleChangeValue(-1)}
                style={{
                    backgroundColor: "green",
                    width: "3rem",
                    height: "3rem",
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
                    backgroundImage: "url(/assets/other/woundToken.png)",
                    backgroundPosition: "center, center",
                    backgroundSize: "cover",
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "2rem",
                    border: "2px solid white",
                }}
            >
                <div
                    style={{
                        margin: "auto",
                        color: "white",
                        fontSize: "1.5rem",
                    }}
                >
                    {value}
                </div>
            </div>
            <ButtonBase
                onClick={handleChangeValue(1)}
                style={{
                    backgroundColor: "red",
                    width: "3rem",
                    height: "3rem",
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

WoundsCounter.propTypes = {
    wounds: PropTypes.number,
    onWoundsCounterChange: PropTypes.func,
};

export default WoundsCounter;
