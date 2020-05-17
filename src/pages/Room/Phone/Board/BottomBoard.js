import React from "react";
import PropTypes from "prop-types";

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
                orientation === "horizontal" ? "" : "v"
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
                    orientation === "horizontal" && offset > 0
                        ? Math.abs(offset) * (94 * scaleFactor)
                        : 0,
                transformOrigin: "center center",
                transform: `rotate(${rotate}deg)`,
            }}
        />
    )
);

BottomBoard.displayName = "BottomBoard";
BottomBoard.propTypes = {
    baseBoardWidth: PropTypes.number,
    baseBoardHeight: PropTypes.number,
    boardId: PropTypes.number,
    orientation: PropTypes.string,
    offset: PropTypes.number,
    rotate: PropTypes.number,
    scaleFactor: PropTypes.number,
};

export default BottomBoard;
