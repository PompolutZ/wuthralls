import React from "react";
import AttackDie from "../../../components/AttackDie";
import DefenceDie from "../../../components/DefenceDie";
import { warbandColors } from "../../../data";
import PropTypes from "prop-types";

function RollOffDiceTray({ rollResults, faction }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {rollResults.map(([id, roll]) => (
                <div key={id} style={{ display: "flex" }}>
                    {roll.split(",").map((x, i) => (
                        <div
                            key={i}
                            style={{
                                width: 36,
                                height: 36,
                                marginRight: ".2rem",
                                backgroundColor: "white",
                                borderRadius: 36 * 0.2,
                            }}
                        >
                            {i % 2 === 0 && (
                                <DefenceDie
                                    accentColorHex={warbandColors[faction]}
                                    size={36}
                                    side={Number(x)}
                                    useBlackOutline={
                                        faction === "zarbags-gitz" ||
                                        faction === "khagras-ravagers"
                                    }
                                />
                            )}
                            {i % 2 !== 0 && (
                                <AttackDie
                                    accentColorHex={warbandColors[faction]}
                                    size={36}
                                    side={Number(x)}
                                    useBlackOutline={
                                        faction === "zarbags-gitz" ||
                                        faction === "khagras-ravagers"
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

RollOffDiceTray.propTypes = {
    rollResults: PropTypes.array,
    faction: PropTypes.string,
};

export default RollOffDiceTray;
