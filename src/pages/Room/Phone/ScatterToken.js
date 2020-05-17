import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import ButtonBase from "@material-ui/core/ButtonBase";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import RotateRightIcon from "@material-ui/icons/RotateRight";
import PropTypes from "prop-types";

function ScatterToken({ onSelectionChange, orientation }) {
    const [rotateAngle, setRotateAngle] = useState(
        orientation === "horizontal" ? 0 : 30
    );
    const [isSelected, setIsSelected] = useState(false);
    const [values, setValues] = useState({
        id: "SCATTER_TOKEN",
        type: "SCATTER_TOKEN",
        isOnBoard: false,
        rotationAngle: rotateAngle,
        onBoard: { x: -1, y: -1 },
    });

    const handleRotateLeft = (e) => {
        setRotateAngle(rotateAngle - 60);
        const updated = {
            ...values,
            rotationAngle: rotateAngle - 60,
        };
        setValues(updated);
        onSelectionChange(updated);

        e.preventDefault();
    };

    const handleRotateRight = (e) => {
        setRotateAngle(rotateAngle + 60);
        const updated = {
            ...values,
            rotationAngle: rotateAngle + 60,
        };
        setValues(updated);
        onSelectionChange(updated);

        e.preventDefault();
    };

    const handleTokenClick = () => {
        if (!isSelected) {
            setIsSelected(true);
            const updated = {
                ...values,
                isOnBoard: true,
            };
            setValues(updated);
            onSelectionChange(updated);
        } else {
            setIsSelected(false);
            const updated = {
                ...values,
                isOnBoard: false,
            };
            setValues(updated);
            onSelectionChange(updated);
        }
    };

    return (
        <Grid container justify="center" spacing={3}>
            <Grid item xs={4}>
                <div
                    style={{
                        position: "relative",
                        width: "4rem",
                        height: "4rem",
                        marginTop: "2rem",
                        filter: isSelected
                            ? "drop-shadow(0 0 10px purple)"
                            : "",
                        transition: "all .175s ease-out",
                    }}
                >
                    <img
                        src={`/assets/other/scatter.png`}
                        style={{
                            width: "4rem",
                            transform: `rotate(${rotateAngle}deg)`,
                            transformOrigin: "center center",
                        }}
                        onClick={handleTokenClick}
                    />
                    <ButtonBase
                        style={{
                            position: "absolute",
                            width: "2.5rem",
                            height: "2.5rem",
                            top: "50%",
                            marginTop: "-1rem",
                            left: 0,
                            marginLeft: "-3rem",
                            backgroundColor: "teal",
                            color: "white",
                            boxSizing: "border-box",
                            border: "1px solid white",
                            borderRadius: "1rem",
                        }}
                        onClick={handleRotateLeft}
                    >
                        <RotateLeftIcon />
                    </ButtonBase>
                    <ButtonBase
                        style={{
                            position: "absolute",
                            width: "2.5rem",
                            height: "2.5rem",
                            top: "50%",
                            marginTop: "-1rem",
                            right: 0,
                            marginRight: "-3rem",
                            backgroundColor: "teal",
                            color: "white",
                            boxSizing: "border-box",
                            border: "1px solid white",
                            borderRadius: "1rem",
                        }}
                        onClick={handleRotateRight}
                    >
                        <RotateRightIcon />
                    </ButtonBase>
                </div>
            </Grid>
        </Grid>
    );
}

ScatterToken.propTypes = {
    onSelectionChange: PropTypes.func,
    orientation: PropTypes.string,
};

export default ScatterToken;
