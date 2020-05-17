import React from "react";
import PropTypes from "prop-types";

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function Die({ side, type, style, prefix }) {
    const dieLetter =
        prefix || type === "ATTACK"
            ? "A"
            : type === "DEFENCE"
            ? "D"
            : type === "MAGIC"
            ? "M"
            : ["A", "D"][getRandomIntInclusive(0, 1)];
    if (prefix) {
        return (
            <img
                src={`/assets/dice/${prefix}${side}.png`}
                style={style}
                alt="die"
            />
        );
    }

    return (
        <img
            src={`/assets/dice/${dieLetter}${side}.png`}
            style={style}
            alt="die"
        />
    );
}

Die.propTypes = {
    side: PropTypes.number,
    type: PropTypes.string,
    style: PropTypes.object,
    prefix: PropTypes.string,
};

export default Die;
