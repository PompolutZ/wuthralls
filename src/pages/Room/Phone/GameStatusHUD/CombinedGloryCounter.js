import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import PropTypes from "prop-types";

function CombinedGloryCounter({
    canEdit,
    glory = 0,
    glorySpent = 0,
    onGloryChange,
}) {
    const [gloryEarned, setGloryEarned] = useState(glory);
    const [gloryUsed, setGloryUsed] = useState(glorySpent);

    const handleChangeEarnedGlory = (mod) => () => {
        const nextValue = gloryEarned + mod >= 0 ? gloryEarned + mod : 0;
        setGloryEarned(nextValue);
        onGloryChange({ earned: nextValue, spent: gloryUsed });
    };

    const handleChangeGloryUsed = (mod) => () => {
        const nextValue = gloryUsed + mod;
        setGloryUsed(nextValue >= 0 ? nextValue : 0);
        setGloryEarned(gloryEarned - mod >= 0 ? gloryEarned - mod : 0);
        onGloryChange({
            earned: gloryEarned - mod >= 0 ? gloryEarned - mod : 0,
            spent: nextValue,
        });
    };

    return (
        <Grid container spacing={3} justify="center" alignItems="center">
            {canEdit && (
                <Grid item xs={4}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: ".5rem",
                        }}
                    >
                        <ButtonBase
                            style={{
                                width: "3rem",
                                height: "3rem",
                                backgroundColor: "darkred",
                                color: "white",
                                boxSizing: "border-box",
                                border: "3px solid white",
                                borderRadius: "1.5rem",
                            }}
                            onClick={handleChangeEarnedGlory(-1)}
                        >
                            <RemoveIcon />
                        </ButtonBase>

                        <ButtonBase
                            style={{
                                width: "3rem",
                                height: "3rem",
                                backgroundColor: "teal",
                                color: "white",
                                boxSizing: "border-box",
                                border: "3px solid white",
                                borderRadius: "1.5rem",
                            }}
                            onClick={handleChangeEarnedGlory(1)}
                        >
                            <AddIcon />
                        </ButtonBase>
                    </div>
                </Grid>
            )}
            <Grid item xs={4}>
                <div style={{ position: "relative" }}>
                    <img
                        src={`/assets/other/gloryCounter.png`}
                        alt="glory counter"
                        style={{ width: "100%" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            top: 0,
                            left: 0,
                            display: "flex",
                            alignItems: "center",
                            color: "white",
                        }}
                    >
                        <div style={{ flex: 1, display: "flex" }}>
                            <Typography
                                style={{ fontSize: "2.5rem", margin: "auto" }}
                            >
                                {gloryEarned}
                            </Typography>
                        </div>
                        <div style={{ flex: 1, display: "flex" }}>
                            <Typography
                                style={{ fontSize: "2.5rem", margin: "auto" }}
                            >
                                {gloryUsed}
                            </Typography>
                        </div>
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            width: "2rem",
                            height: "2rem",
                            boxSizing: "border-box",
                            border: "2px solid white",
                            borderRadius: "1rem",
                            backgroundColor: "goldenrod",
                            color: "white",
                            zIndex: 1,
                            bottom: "0%",
                            left: "50%",
                            marginLeft: "-1rem",
                            marginBottom: "-1rem",
                            display: "flex",
                        }}
                    >
                        <Typography style={{ margin: "auto" }}>
                            {gloryEarned + gloryUsed}
                        </Typography>
                    </div>
                </div>
            </Grid>
            {canEdit && (
                <Grid item xs={4}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: ".5rem",
                        }}
                    >
                        <ButtonBase
                            style={{
                                width: "3rem",
                                height: "3rem",
                                backgroundColor: "teal",
                                color: "white",
                                boxSizing: "border-box",
                                border: "3px solid white",
                                borderRadius: "1.5rem",
                            }}
                            onClick={handleChangeGloryUsed(1)}
                        >
                            <AddIcon />
                        </ButtonBase>

                        <ButtonBase
                            style={{
                                width: "3rem",
                                height: "3rem",
                                backgroundColor: "darkred",
                                color: "white",
                                boxSizing: "border-box",
                                border: "3px solid white",
                                borderRadius: "1.5rem",
                            }}
                            onClick={handleChangeGloryUsed(-1)}
                            disabled={gloryUsed === 0}
                        >
                            <RemoveIcon />
                        </ButtonBase>
                    </div>
                </Grid>
            )}
        </Grid>
    );
}

CombinedGloryCounter.propTypes = {
    canEdit: PropTypes.bool,
    glory: PropTypes.number,
    glorySpent: PropTypes.number,
    onGloryChange: PropTypes.func,
};

export default CombinedGloryCounter;
