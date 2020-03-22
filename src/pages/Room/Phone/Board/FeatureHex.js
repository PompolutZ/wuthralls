import React from "react";

export default function FeatureHex({ x, y, pointyTokenBaseWidth, baseSize, scaleFactor, orientation, isLethal, number, isSelected }) {
    return (
        <div
            style={{
                position: "absolute",
                zIndex: 500,
                transition:
                    "all .17s ease-out",
                width:
                    pointyTokenBaseWidth *
                    scaleFactor,
                top: orientation ===
                    "horizontal"
                        ? y +
                          (baseSize *
                              scaleFactor) /
                              2
                        : y - 4,
                left: orientation ===
                    "horizontal"
                        ? x
                        : x +
                          (baseSize *
                              scaleFactor) /
                              2,
                transform: `rotate(${
                    orientation ===
                    "horizontal"
                        ? 0
                        : 30
                }deg)`,
                transformOrigin:
                    "center center",
            }}
        >
            <img
                src={
                    isLethal
                        ? `/assets/tokens/feature_back.png`
                        : `/assets/tokens/feature_front_${number}.png`
                }
                style={{
                    width:
                        pointyTokenBaseWidth *
                        scaleFactor,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    zIndex: 501,
                    width:
                        pointyTokenBaseWidth *
                        scaleFactor,
                    height:
                        pointyTokenBaseWidth *
                        scaleFactor,
                    borderRadius: `${(pointyTokenBaseWidth *
                        scaleFactor) /
                        2}px`,
                    top: "5px",
                    left: 0,
                    boxShadow:
                        isSelected
                            ? `0 0 35px 13px ${
                                  isLethal
                                      ? "rgba(255,0,0, .7)"
                                      : "rgba(255,215,0, .7)"
                              }`
                            : `0 0 12.5px 5px ${
                                  isLethal
                                      ? "rgba(255,0,0, .7)"
                                      : "rgba(255,215,0, .7)"
                              }`,
                }}
            />
        </div>
    );
}