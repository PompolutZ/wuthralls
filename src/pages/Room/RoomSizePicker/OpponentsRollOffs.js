import Typography from "@material-ui/core/Typography";
import React from "react";
import RollOffDiceTray from "./RollOffDiceTray";
import PropTypes from "prop-types";

function PlayerRollOffs({ name, faction, rollOffs, reverse = false }) {
    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                flexDirection: reverse ? "column" : "column-reverse",
                alignItems: "center",
                justifyContent: "flex-start",
            }}
        >
            <div
                style={{
                    display: "flex",
                    margin: "1rem",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: "3rem",
                        height: "3rem",
                        marginRight: "1rem",
                        boxSizing: "border-box",
                        borderRadius: "1.5rem",
                        border: "2px solid whitesmoke",
                        display: "flex",
                    }}
                >
                    <img
                        style={{
                            width: "100%",
                            height: "100%",
                            margin: "auto",
                        }}
                        src={`/assets/factions/${faction}-icon.png`}
                    />
                </div>
                <Typography variant="h6">{name}</Typography>
            </div>
            <RollOffDiceTray rollResults={rollOffs} faction={faction} />
        </div>
    );
}

PlayerRollOffs.propTypes = {
    name: PropTypes.string,
    faction: PropTypes.string,
    rollOffs: PropTypes.array,
    reverse: PropTypes.bool,
};

export default PlayerRollOffs;
