import React from "react";
import {
    SingleAssist,
    AttackFury,
    AttackSmash,
    DoubleAssist,
    Crit,
} from "./CommonSVGs";
import PropTypes from "prop-types";

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

function AttackDie({ side, accentColorHex, size, useBlackOutline }) {
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
                backgroundColor: `rgba(${r},${g},${b}, ${
                    useBlackOutline ? 1 : 0.1
                })`,
            }}
        >
            {Number(side) === 1 && (
                <SingleAssist
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline ? "black" : accentColorHex,
                    }}
                />
            )}
            {Number(side) === 2 && (
                <AttackFury
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline ? "black" : accentColorHex,
                    }}
                />
            )}
            {Number(side) === 3 && (
                <AttackSmash
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline ? "black" : accentColorHex,
                    }}
                />
            )}
            {Number(side) === 4 && (
                <AttackSmash
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline ? "black" : accentColorHex,
                    }}
                />
            )}
            {Number(side) === 5 && (
                <DoubleAssist
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline ? "black" : accentColorHex,
                    }}
                />
            )}
            {Number(side) === 6 && (
                <Crit
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: useBlackOutline ? "black" : accentColorHex,
                    }}
                />
            )}
        </div>
    );
}

AttackDie.propTypes = {
    side: PropTypes.number,
    accentColorHex: PropTypes.string,
    size: PropTypes.number,
    useBlackOutline: PropTypes.bool,
};

export default AttackDie;
