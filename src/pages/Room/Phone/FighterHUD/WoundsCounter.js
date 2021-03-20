import React, { useState, useEffect } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import PropTypes from "prop-types";

function WoundsCounter({ wounds, onRemoveWoundCounter }) {
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
                flexDirection: "column",
            }}
        >
            {wounds > 0 && (
                <ButtonBase
                    onClick={onRemoveWoundCounter}
                    style={{
                        position: "absolute",
                        width: "3rem",
                        height: "3rem",
                        left: "-2.5rem",
                        top: ".5rem",
                        borderRadius: "1.5rem",
                        color: "white",
                        boxSizing: "border-box",
                    }}
                >
                    <AddIcon
                        style={{
                            transform: "rotate(45deg)",
                            width: "3rem",
                            height: "3rem",
                            filter: "drop-shadow(0px 4px 7px rgba(0,0,0,.5))",
                        }}
                    />
                </ButtonBase>
            )}
            <div
                style={{
                    display: "flex",
                    backgroundImage: "url(/assets/other/woundToken.png)",
                    backgroundPosition: "center, center",
                    backgroundSize: "cover",
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "2rem",
                    cursor: "pointer",
                    // border: "2px solid white",
                    filter: "drop-shadow(0px 4px 7px rgba(0,0,0,.5))",
                    zIndex: wounds,
                }}
            >
                <div
                    style={{
                        margin: "auto",
                        color: "white",
                        fontSize: "1.5rem",
                        userSelect: "none",
                    }}
                >
                    {wounds}
                </div>
            </div>
            {wounds > 1 &&
                new Array(wounds - 1).fill(true).map((x, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            marginTop: "2rem",
                            top: `${i}rem`,

                            backgroundImage:
                                "url(/assets/other/woundToken.png)",
                            backgroundPosition: "center, center",
                            backgroundSize: "cover",
                            width: "3rem",
                            height: "3rem",
                            borderRadius: "2rem",
                            left: ".5rem",
                            filter: "drop-shadow(0px 2px 2px rgba(0,0,0,.5))",
                            zIndex: wounds - 1 - i,
                        }}
                    />
                ))}
            {/* <ButtonBase
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
            </ButtonBase> */}
        </div>
    );
}

WoundsCounter.propTypes = {
    wounds: PropTypes.number,
    onWoundsCounterChange: PropTypes.func,
};

export default WoundsCounter;
