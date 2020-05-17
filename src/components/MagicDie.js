import React from "react";
import PropTypes from "prop-types";
import { MagicChannel, MagicFocus, Crit } from "./CommonSVGs";

function MagicDie({ side, size }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                display: "flex",
                boxSizing: "border-box",
                border: `2px solid indigo`,
                borderRadius: size * 0.2,
                background:
                    "linear-gradient(212deg, rgba(255,255,255,1) 0%, rgba(195,251,77,1) 20%, rgba(18,255,225,1) 80%, rgba(255,255,255,1) 100%)",
            }}
        >
            {side === 1 && (
                <MagicChannel
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: "indigo",
                    }}
                />
            )}
            {side === 2 && (
                <MagicFocus
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: "indigo",
                    }}
                />
            )}
            {side === 3 && (
                <MagicChannel
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: "indigo",
                    }}
                />
            )}
            {side === 4 && (
                <MagicFocus
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: "indigo",
                    }}
                />
            )}
            {side === 5 && (
                <MagicChannel
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: "indigo",
                    }}
                />
            )}
            {side === 6 && (
                <Crit
                    style={{
                        margin: "auto",
                        width: size * 0.8,
                        height: size * 0.8,
                        color: "indigo",
                    }}
                />
            )}
        </div>
    );
}

MagicDie.propTypes = {
    side: PropTypes.number,
    size: PropTypes.number,
};

export default MagicDie;
