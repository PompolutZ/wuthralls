import React from "react";

const TopBoard = React.memo(
    ({
        baseBoardWidth,
        baseBoardHeight,
        boardId,
        orientation,
        offset,
        rotate,
        scaleFactor,
    }) => (
        <img
            src={`/assets/boards/${boardId}${
                orientation === "horizontal" ? "" : "v"
            }.jpg`}
            alt="board"
            style={{
                opacity: 0.8,
                width:
                    orientation === "horizontal"
                        ? baseBoardWidth * scaleFactor
                        : baseBoardHeight * scaleFactor,
                height:
                    orientation === "horizontal"
                        ? baseBoardHeight * scaleFactor
                        : baseBoardWidth * scaleFactor,
                position: "absolute",
                left:
                    orientation === "horizontal" && offset < 0
                        ? Math.abs(offset) * (94 * scaleFactor)
                        : 0,
                zIndex: "1",
                transformOrigin: "center center",
                transform: `rotate(${rotate}deg)`,
            }}
        />
    )
);

export default TopBoard;