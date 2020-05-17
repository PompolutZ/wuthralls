import React from "react";
import PropTypes from "prop-types";
import {
    SingleAssist,
    DefenceDodge,
    DefenceBlock,
    DoubleAssist,
    Crit,
} from "./CommonSVGs";

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

function DefenceDie({ side, accentColorHex, size, useBlackOutline }) {
    const { r, g, b } = hexToRgb(accentColorHex);
    return (
        <div
            style={{
                width: size,
                height: size,
                display: "flex",
                boxSizing: "border-box",
                border: `2px solid ${
                    useBlackOutline ? "black" : accentColorHex
                }`,
                borderRadius: size * 0.2,
                backgroundColor: useBlackOutline
                    ? "black"
                    : `rgba(${r},${g},${b})`,
            }}
        >
            {Number(side) === 1 && (
                <SingleAssist
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline
                            ? `rgba(${r},${g},${b})`
                            : "white",
                    }}
                />
            )}
            {Number(side) === 2 && (
                <DefenceDodge
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline
                            ? `rgba(${r},${g},${b})`
                            : "white",
                    }}
                />
            )}
            {Number(side) === 3 && (
                <DefenceBlock
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline
                            ? `rgba(${r},${g},${b})`
                            : "white",
                    }}
                />
            )}
            {Number(side) === 4 && (
                <DefenceBlock
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline
                            ? `rgba(${r},${g},${b})`
                            : "white",
                    }}
                />
            )}
            {Number(side) === 5 && (
                <DoubleAssist
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline
                            ? `rgba(${r},${g},${b})`
                            : "white",
                    }}
                />
            )}
            {Number(side) === 6 && (
                <Crit
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline
                            ? `rgba(${r},${g},${b})`
                            : "white",
                    }}
                />
            )}
        </div>
    );
}

DefenceDie.propTypes = {
    side: PropTypes.number,
    accentColorHex: PropTypes.string,
    size: PropTypes.number,
    useBlackOutline: PropTypes.bool,
};

export default DefenceDie;
