import React from "react";

const BottomBoard = React.memo(
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
                orientation === "horizontal"
                    ? ""
                    : "v"
            }.jpg`}
            alt="board2"
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
                zIndex: "1",
                top:
                    orientation === "horizontal"
                        ? baseBoardHeight * scaleFactor
                        : baseBoardWidth * scaleFactor,
                left:
                    orientation === "horizontal" &&
                    offset > 0
                        ? Math.abs(offset) *
                        (94 * scaleFactor)
                        : 0,
                transformOrigin: "center center",
                transform: `rotate(${rotate}deg)`,
            }}
        />
    )
);

export default BottomBoard;
