import React, { useState } from "react";
import { StartingHex } from "../../../../components/CommonSVGs";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
    main: {
        position: "absolute",
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

const StartingHexElement = React.memo(
    ({ pointyTokenBaseWidth, scaleFactor, baseSize, x, y }) => {
        const classes = useStyles();
        const [isMouseOver, setIsMouseOver] = useState(false);

        const handleMouseEnter = () => {
            setIsMouseOver(true);
        };

        const handleMouseLeave = () => {
            setIsMouseOver(false);
        };

        return (
            <div
                className={classes.main}
                style={{
                    width: pointyTokenBaseWidth * scaleFactor,
                    height: pointyTokenBaseWidth * scaleFactor,
                    top: y + (baseSize * scaleFactor) / 2,
                    left: x,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <StartingHex
                    style={{
                        width: "75%",
                        height: "75%",
                        margin: "auto",
                        paddingTop: ".5rem",
                        color: isMouseOver ? "white" : "rgba(211,211,211,.7)",
                        filter: isMouseOver
                            ? "drop-shadow(0px 0px 10px yellow)"
                            : "",
                    }}
                />
            </div>
        );
    }
);

StartingHexElement.displayName = "StartingHexElement";
StartingHexElement.propTypes = {
    pointyTokenBaseWidth: PropTypes.number,
    scaleFactor: PropTypes.number,
    baseSize: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
};

export default StartingHexElement;
