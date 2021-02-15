import React, { useEffect, useState, useRef, useContext } from "react";
import { defineGrid, extendHex } from "honeycomb-grid";
import * as SVG from "svg.js";
import { FirebaseContext } from "../../../../firebase";
import { useAuthUser } from "../../../../components/Session";
import { Typography } from "@material-ui/core";
import { cardsDb } from "../../../../data";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ButtonBase from "@material-ui/core/ButtonBase";
import StartingHexElement from "./StartingHexElement";
import { makeStyles } from "@material-ui/core/styles";
import BottomBoard from "./BottomBoard";
import TopBoard from "./TopBoard";
import LethalHex from "./LethalHex";
import FeatureHex from "./FeatureHex";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
    boardContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        display: "flex",
        overflow: "auto",
    },
}));

const baseSize = 55;

const verticalBoardHexes = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [0, 6],
    [1, 6],
    [2, 6],
    [3, 6],
    [4, 6],
    [0, 7],
    [2, 7],
    [4, 7],
];

const horizontalBoardHexes = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [5, 3],
    [6, 3],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
    [6, 4],
    [7, 4],
];

const noOnesHexesHorizontal = [
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5],
    [6, 5],
];

const modifyNoOnesArray = (array, offset) => {
    return offset > 0
        ? array.map(([x, y]) => [x + offset, y]).slice(0, 7 - offset)
        : array.slice(0, 7 - Math.abs(offset));
};

const renderHex = (hex, svg, color, lethals, blocked) => {
    const { x, y } = hex.toPoint();
    const corners = hex.corners();
    const isLethal = lethals.some(([x, y]) => x === hex.x && y === hex.y);
    const isBlocked = blocked.some(([x, y]) => x === hex.x && y === hex.y);

    const handleMouseOver = () => {
        const element = SVG.get(`hex${hex.x}${hex.y}`);
        if (element) {
            element
                .stop(true, true)
                .attr({ "stroke-width": isLethal ? 3 : 1 })
                .animate(175)
                .attr({ "stroke-width": isLethal ? 5 : 3 });
        }
    };

    const handleMouseOut = () => {
        const element = SVG.get(`hex${hex.x}${hex.y}`);
        if (element) {
            element
                .stop(true, true)
                .attr({ "stroke-width": isLethal ? 5 : 3 })
                .animate(175)
                .attr({ "stroke-width": isLethal ? 3 : 1 });
        }
    };

    svg.polygon(corners.map(({ x, y }) => `${x * 0.96},${y * 0.96}`))
        .fill(isBlocked ? "rgba(192,192,192, .5)" : "rgba(192,192,192, 0)")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .attr({
            stroke: isLethal ? "red" : "rgba(255,255,255,.7)",
            "stroke-width": isLethal ? 3 : 1,
        })
        .translate(x, y)
        .id(`hex${hex.x}${hex.y}`);
};

const highlightHex = (hex, lethals, blocked) => {
    const isLethal = lethals.some(([x, y]) => x === hex.x && y === hex.y);
    const isBlocked = blocked.some(([x, y]) => x === hex.x && y === hex.y);

    const hexElement = SVG.get(`hex${hex.x}${hex.y}`);
    if (hexElement) {
        hexElement
            .stop(true, true)
            .fill({ opacity: 1, color: isLethal ? "red" : "white" })
            .animate(500)
            .fill({
                opacity: isBlocked ? 0.5 : 0,
                color: isLethal ? "red" : "white",
            });
    }
};

const getGridFactory = (scaleFactor, orientation) => {
    const hexProto = {
        baseSize: baseSize,
        scaleFactor: 0.5,
        orientation: orientation === "horizontal" ? "pointy" : "flat",
        size: 55 * scaleFactor,
        origin:
            orientation === "horizontal"
                ? [0, (-55 / 2) * scaleFactor]
                : [(-55 / 2) * scaleFactor, 0],
        highlight(svg) {
            svg.stop(true, true)
                .fill({ opacity: 1, color: "white" })
                .animate(500)
                .fill({ opacity: 0, color: "white" });
        },
    };

    const Hex = extendHex(hexProto);
    return defineGrid(Hex);
};

const getGrid = (scaleFactor, orientation, offset) => {
    const hexProto = {
        baseSize: baseSize,
        scaleFactor: 0.5,
        orientation: orientation === "horizontal" ? "pointy" : "flat",
        size: 55 * scaleFactor,
        origin:
            orientation === "horizontal"
                ? [0, (-55 / 2) * scaleFactor]
                : [(-55 / 2) * scaleFactor, 0],
        highlight(svg) {
            svg.stop(true, true)
                .fill({ opacity: 1, color: "white" })
                .animate(500)
                .fill({ opacity: 0, color: "white" });
        },
    };

    const Hex = extendHex(hexProto);
    const Grid = defineGrid(Hex);

    return Grid(
        orientation === "horizontal"
            ? [
                  ...horizontalBoardHexes.map(([x, y]) =>
                      offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                  ),
                  ...modifyNoOnesArray(
                      noOnesHexesHorizontal,
                      offset
                  ).map(([x, y]) =>
                      offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                  ),
                  ...horizontalBoardHexes.map(([x, y]) =>
                      offset > 0 ? [x + offset, y + 6] : [x, y + 6]
                  ),
              ]
            : [
                  ...verticalBoardHexes,
                  ...[
                      [1, 7],
                      [3, 7],
                  ],
                  ...verticalBoardHexes.map(([x, y]) => [x, y + 8]),
              ]
    );
};

function Board({
    state,
    selectedElement,
    scaleFactor,
    boardMeta,
    onScaleFactorChange,
}) {
    const baseBoardWidth = 757;
    const baseBoardHeight = 495;
    const baseSize = 55;
    const pointyTokenBaseWidth = 95;

    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const rootRef = useRef(null);
    const boardContainerRef = useRef(null);
    const [svg, setSvg] = React.useState(null);
    const [tokenHexes, setTokenHexes] = useState(state.board.tokens);
    const [fighters, setFighters] = useState(state.board.fighters);
    const [scatterToken, setScatterToken] = useState({
        id: "SCATTER_TOKEN",
        type: "SCATTER_TOKEN",
        isOnBoard: false,
        rotationAngle: 0,
        onBoard: { x: -1, y: -1 },
        top: -10000,
        left: -10000,
    });
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    const myData = state[myself.uid];
    const opponent = state.players.find((p) => p !== myself.uid);
    const opponentData = state.players.length > 1 ? state[opponent] : null;

    useEffect(() => {
        if (state.status.stage !== "READY") return;

        const currentSvg = svg ? svg : SVG(rootRef.current);
        currentSvg.clear();
        setSvg(currentSvg);
        const initGrid = getGrid(
            scaleFactor,
            state.status.orientation,
            state.status.offset
        );

        initGrid.forEach((hex) => {
            renderHex(
                hex,
                currentSvg,
                "rgba(255,255,255, 1)",
                boardMeta.lethalHexes,
                boardMeta.blockedHexes
            );
        });
    }, [scaleFactor]);

    useEffect(() => {
        if (selectedElement && selectedElement.type === "SCATTER_TOKEN") {
            setScatterToken({
                ...scatterToken,
                rotationAngle: selectedElement.rotationAngle,
                isOnBoard: selectedElement.isOnBoard,
            });
        }

        if (!selectedElement) {
            setSelectedTokenId(null);
        } else {
            setSelectedTokenId(selectedElement.id);
        }
    }, [selectedElement]);

    useEffect(() => {
        setTokenHexes(state.board.tokens);
        setFighters(state.board.fighters);
    }, [state]);

    useEffect(() => {
        const featureTokens = Object.entries(tokenHexes).filter(([k, v]) => {
            return k.startsWith("Feature") && v.isOnBoard && !v.isRevealed;
        });

        if (featureTokens.length < 5) return;

        const update = {
            ...tokenHexes,
            ...featureTokens.reduce(
                (r, [k, v]) => ({
                    ...r,
                    [k]: { ...v, isRevealed: true, isLethal: false },
                }),
                {}
            ),
        };
        setTokenHexes(update);

        firebase.updateBoardProperty(state.id, "board.tokens", update);
        firebase.addGenericMessage2(state.id, {
            author: "Katophrane",
            type: "INFO",
            value: `All feature hexes has been revealed.`,
        });
    }, [tokenHexes]);

    const handleIncreazeScaleFactor = () => {
        onScaleFactorChange((prev) => prev * 1.1);
    };

    const handleDecreaseScaleFactor = () => {
        onScaleFactorChange((prev) => prev * 0.9);
    };

    const handleClick = (e) => {
        const { clientX, clientY } = e;
        const boardContainerBoundingRect = boardContainerRef.current.getBoundingClientRect();

        const offsetX = clientX - boardContainerBoundingRect.left;
        const offsetY = clientY - boardContainerBoundingRect.top;
        const hex = getGridFactory(
            scaleFactor,
            state.status.orientation
        ).pointToHex([offsetX, offsetY]);

        const hexes =
            state.status.orientation === "horizontal"
                ? [
                      ...horizontalBoardHexes.map(([x, y]) =>
                          state.status.offset < 0
                              ? [x + Math.abs(state.status.offset), y]
                              : [x, y]
                      ),
                      ...modifyNoOnesArray(
                          noOnesHexesHorizontal,
                          state.status.offset
                      ).map(([x, y]) =>
                          state.status.offset < 0
                              ? [x + Math.abs(state.status.offset), y]
                              : [x, y]
                      ),
                      ...horizontalBoardHexes.map(([x, y]) =>
                          state.status.offset > 0
                              ? [x + state.status.offset, y + 6]
                              : [x, y + 6]
                      ),
                  ]
                : [
                      ...verticalBoardHexes,
                      ...[
                          [1, 7],
                          [3, 7],
                      ],
                      ...verticalBoardHexes.map(([x, y]) => [x, y + 8]),
                  ];
        const isHexOnBoard = hexes.find(([x, y]) => hex.x === x && hex.y === y);

        if (!isHexOnBoard) return;

        if (hex) {
            highlightHex(svg, boardMeta.lethalHexes, boardMeta.blockedHexes);

            if (selectedTokenId) {
                if (selectedElement.type === "SCATTER_TOKEN") {
                    setScatterToken({
                        ...scatterToken,
                        onBoard: { x: hex.x, y: hex.y },
                    });
                } else if (selectedElement.type === "FIGHTER") {
                    const updatedFighter = {
                        ...fighters[selectedTokenId],
                        from: fighters[selectedTokenId].isOnBoard
                            ? fighters[selectedTokenId].onBoard
                            : { x: -1, y: -1 },
                        isOnBoard: true,
                        onBoard: { x: hex.x, y: hex.y },
                    };

                    setFighters({
                        ...fighters,
                        [selectedTokenId]: updatedFighter,
                    });

                    firebase.updateBoardProperty(
                        state.id,
                        `board.fighters.${selectedTokenId}`,
                        updatedFighter
                    );
                    firebase.addGenericMessage2(state.id, {
                        author: "Katophrane",
                        type: "INFO",
                        subtype: "PLACEMENT",
                        value: `${myself.username} placed ${
                            selectedTokenId.startsWith(myself.uid)
                                ? "HIS"
                                : "ENEMIES"
                        } ${fighters[selectedTokenId].name} to (${hex.x},${
                            hex.y
                        }).`,
                    });
                } else {
                    const updatedToken = {
                        ...tokenHexes[selectedTokenId],
                        from: tokenHexes[selectedTokenId].isOnBoard
                            ? tokenHexes[selectedTokenId].onBoard
                            : { x: -1, y: -1 },
                        isOnBoard: true,
                        onBoard: { x: hex.x, y: hex.y },
                    };
                    firebase.updateBoardProperty(
                        state.id,
                        `board.tokens.${selectedTokenId}`,
                        updatedToken
                    );
                    firebase.addGenericMessage2(state.id, {
                        author: "Katophrane",
                        type: "INFO",
                        subtype: "PLACEMENT",
                        value: `${myself.username} placed ${selectedTokenId} to (${hex.x},${hex.y}).`,
                    });
                    setTokenHexes({
                        ...tokenHexes,
                        [selectedTokenId]: updatedToken,
                    });
                }
            }
        }
    };

    if (state.status.stage !== "READY") {
        return (
            <div style={{ display: "flex", width: "100%", height: "100%" }}>
                <div style={{ margin: "auto" }}>
                    Waiting for players to select board pieces...
                </div>
            </div>
        );
    }

    const scatterTokenHex =
        scatterToken && scatterToken.isOnBoard
            ? getGrid(
                  scaleFactor,
                  state.status.orientation,
                  state.status.offset
              ).get(scatterToken.onBoard)
            : null;
    const { x: scatterTokenX, y: scatterTokenY } = scatterTokenHex
        ? scatterTokenHex.toPoint()
        : { x: -10, y: -10 };
    const myHand =
        myData && myData.hand
            ? myData.hand
                  .split(",")
                  .map((cardId) => ({ ...cardsDb[cardId], id: cardId }))
            : [];
    const opponentHand =
        opponentData && opponentData.hand
            ? opponentData.hand
                  .split(",")
                  .map((cardId) => ({ ...cardsDb[cardId], id: cardId }))
            : [];

    return (
        <div
            id="mainContainer"
            style={{
                flexGrow: 1,
                display: "flex",
                flexFlow: "column nowrap",
                backgroundColor: "#36393F",
                color: "white",
            }}
        >
            <div
                style={{
                    flex: "0 0 auto",
                    display: "flex",
                    borderBottom: "1px solid lighgray",
                    paddingBottom: ".2rem",
                    paddingTop: "1rem",
                    marginBottom: ".2rem",
                    alignItems: "center",
                }}
            >
                {myData && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row-reverse",
                            flex: 1,
                            borderRight: "1px solid gray",
                            paddingRight: ".2rem",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <img
                                src={`/assets/factions/${myData.faction}-icon.png`}
                                style={{ width: "1.5rem", height: "1.5rem" }}
                            />
                            {state.status.primacy &&
                                state.status.primacy[myself.uid] && (
                                    <img
                                        src={`/assets/other/Primacy.png`}
                                        style={{
                                            width: "1rem",
                                            height: "1rem",
                                            position: "absolute",
                                            bottom: 0,
                                            left: "50%",
                                            marginLeft: "-0.5rem",
                                            marginBottom: "-0.5rem",
                                            boxSizing: "border-box",
                                            border: "1px solid #ccc",
                                            borderRadius: "1rem",
                                        }}
                                    />
                                )}
                        </div>
                        <div
                            style={{
                                marginRight: ".2rem",
                                width: "1.2rem",
                                height: "1.2rem",
                                backgroundColor: "goldenrod",
                                borderRadius: "1rem",
                                color: "white",
                                display: "flex",
                            }}
                        >
                            <Typography
                                style={{ margin: "auto", fontSize: ".7rem" }}
                            >
                                {myData.gloryScored}
                            </Typography>
                        </div>
                        <div
                            style={{
                                marginRight: ".2rem",
                                width: "1.2rem",
                                height: "1.2rem",
                                backgroundColor: "darkgray",
                                borderRadius: "1rem",
                                color: "white",
                                display: "flex",
                            }}
                        >
                            <Typography
                                style={{ margin: "auto", fontSize: ".7rem" }}
                            >
                                {myData.glorySpent}
                            </Typography>
                        </div>
                        <div
                            style={{
                                marginRight: ".2rem",
                                width: "1.2rem",
                                height: "1.2rem",
                                backgroundColor: "teal",
                                borderRadius: "1rem",
                                color: "white",
                                display: "flex",
                            }}
                        >
                            <Typography
                                style={{ margin: "auto", fontSize: ".7rem" }}
                            >
                                {myData.activationsLeft}
                            </Typography>
                        </div>
                        <div
                            style={{
                                marginRight: ".2rem",
                                width: "1rem",
                                height: "1.5rem",
                                backgroundColor: "goldenrod",
                                borderRadius: ".2rem",
                                color: "white",
                                display: "flex",
                            }}
                        >
                            <Typography
                                style={{ margin: "auto", fontSize: ".7rem" }}
                            >
                                {
                                    myHand.filter((c) => c.type === "Objective")
                                        .length
                                }
                            </Typography>
                        </div>
                        <div
                            style={{
                                marginRight: ".2rem",
                                width: "1rem",
                                height: "1.5rem",
                                backgroundColor: "teal",
                                borderRadius: ".2rem",
                                color: "white",
                                display: "flex",
                            }}
                        >
                            <Typography
                                style={{ margin: "auto", fontSize: ".7rem" }}
                            >
                                {
                                    myHand.filter((c) => c.type !== "Objective")
                                        .length
                                }
                            </Typography>
                        </div>
                        <ButtonBase
                            onClick={handleIncreazeScaleFactor}
                            style={{ flex: 1 }}
                        >
                            <ZoomInIcon />
                        </ButtonBase>
                    </div>
                )}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        margin: "auto .5rem auto .5rem",
                    }}
                >
                    <Typography style={{ fontSize: ".7rem" }}>
                        {state.status.round}
                    </Typography>
                    <Typography style={{ fontSize: ".5rem" }}>round</Typography>
                </div>
                {opponentData && (
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            alignItems: "center",
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <img
                                src={`/assets/factions/${opponentData.faction}-icon.png`}
                                style={{
                                    width: "1.5rem",
                                    height: "1.5rem",
                                    borderLeft: "1px solid gray",
                                    paddingLeft: ".2rem",
                                }}
                            />
                            {state.status.primacy &&
                                opponent &&
                                state.status.primacy[opponent] && (
                                    <img
                                        src={`/assets/other/Primacy.png`}
                                        style={{
                                            width: "1rem",
                                            height: "1rem",
                                            position: "absolute",
                                            bottom: 0,
                                            right: "50%",
                                            marginRight: "-0.5rem",
                                            marginBottom: "-0.5rem",
                                            boxSizing: "border-box",
                                            border: "1px solid #ccc",
                                            borderRadius: "1rem",
                                        }}
                                    />
                                )}
                        </div>

                        <div
                            style={{
                                marginLeft: ".2rem",
                                width: "1.2rem",
                                height: "1.2rem",
                                backgroundColor: "goldenrod",
                                borderRadius: "1rem",
                                color: "white",
                                display: "flex",
                            }}
                        >
                            <Typography
                                style={{ margin: "auto", fontSize: ".7rem" }}
                            >
                                {opponentData.gloryScored}
                            </Typography>
                        </div>
                        <div
                            style={{
                                marginLeft: ".2rem",
                                width: "1.2rem",
                                height: "1.2rem",
                                backgroundColor: "darkgray",
                                borderRadius: "1rem",
                                color: "white",
                                display: "flex",
                            }}
                        >
                            <Typography
                                style={{ margin: "auto", fontSize: ".7rem" }}
                            >
                                {opponentData.glorySpent}
                            </Typography>
                        </div>
                        <div
                            style={{
                                marginLeft: ".2rem",
                                width: "1.2rem",
                                height: "1.2rem",
                                backgroundColor: "teal",
                                borderRadius: "1rem",
                                color: "white",
                                display: "flex",
                            }}
                        >
                            <Typography
                                style={{ margin: "auto", fontSize: ".7rem" }}
                            >
                                {opponentData.activationsLeft}
                            </Typography>
                        </div>
                        <div
                            style={{
                                marginLeft: ".2rem",
                                width: "1rem",
                                height: "1.5rem",
                                backgroundColor: "goldenrod",
                                borderRadius: ".2rem",
                                color: "white",
                                display: "flex",
                            }}
                        >
                            <Typography
                                style={{ margin: "auto", fontSize: ".7rem" }}
                            >
                                {
                                    opponentHand.filter(
                                        (c) => c.type === "Objective"
                                    ).length
                                }
                            </Typography>
                        </div>
                        <div
                            style={{
                                marginLeft: ".2rem",
                                width: "1rem",
                                height: "1.5rem",
                                backgroundColor: "teal",
                                borderRadius: ".2rem",
                                color: "white",
                                display: "flex",
                            }}
                        >
                            <Typography
                                style={{ margin: "auto", fontSize: ".7rem" }}
                            >
                                {
                                    opponentHand.filter(
                                        (c) => c.type !== "Objective"
                                    ).length
                                }
                            </Typography>
                        </div>
                        <ButtonBase onClick={handleDecreaseScaleFactor}>
                            <ZoomOutIcon />
                        </ButtonBase>
                    </div>
                )}
            </div>
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    position: "relative",
                }}
            >
                <div className={classes.boardContainer}>
                    <div
                        ref={boardContainerRef}
                        style={{
                            position: "relative",
                            width:
                                state.status.orientation === "horizontal"
                                    ? baseBoardWidth * scaleFactor +
                                      Math.abs(state.status.offset) *
                                          (94 * scaleFactor)
                                    : baseBoardHeight * scaleFactor, //baseBoardWidth * scaleFactor, //baseBoardHeight * 2 * scaleFactor,//baseBoardWidth * scaleFactor + (Math.abs(boardOffset) * (94 * scaleFactor)),
                            height:
                                state.status.orientation === "horizontal"
                                    ? baseBoardHeight * 2 * scaleFactor
                                    : baseBoardWidth * 2 * scaleFactor, //baseBoardWidth * scaleFactor * 2, //baseBoardHeight * 2 * scaleFactor,
                            margin: "auto",
                            filter: "drop-shadow(5px 5px 10px black)",
                        }}
                    >
                        <TopBoard
                            baseBoardWidth={baseBoardWidth}
                            baseBoardHeight={baseBoardHeight}
                            boardId={state.status.top.id}
                            orientation={state.status.orientation}
                            offset={state.status.offset}
                            rotate={state.status.top.rotate}
                            scaleFactor={scaleFactor}
                        />
                        <BottomBoard
                            baseBoardWidth={baseBoardWidth}
                            baseBoardHeight={baseBoardHeight}
                            boardId={state.status.bottom.id}
                            orientation={state.status.orientation}
                            offset={state.status.offset}
                            rotate={state.status.bottom.rotate}
                            scaleFactor={scaleFactor}
                        />
                        {boardMeta.startingHexes.map((hex) => {
                            const { x, y } = getGrid(
                                scaleFactor,
                                state.status.orientation,
                                state.status.offset
                            )
                                .get(hex)
                                .toPoint();
                            return (
                                <StartingHexElement
                                    key={`${hex[0]}:${hex[1]}`}
                                    x={
                                        state.status.orientation ===
                                        "horizontal"
                                            ? x
                                            : x +
                                              (baseSize * scaleFactor) / 2 +
                                              4
                                    }
                                    y={
                                        state.status.orientation ===
                                        "horizontal"
                                            ? y
                                            : y -
                                              (baseSize * scaleFactor) / 2 -
                                              4
                                    }
                                    pointyTokenBaseWidth={pointyTokenBaseWidth}
                                    scaleFactor={scaleFactor}
                                    baseSize={baseSize}
                                />
                            );
                        })}
                        <div
                            style={{
                                width:
                                    state.status.orientation === "horizontal"
                                        ? baseBoardWidth * scaleFactor +
                                          Math.abs(state.status.offset) *
                                              (94 * scaleFactor)
                                        : baseBoardHeight * scaleFactor, //baseBoardWidth * scaleFactor, //baseBoardHeight * 2 * scaleFactor,//baseBoardWidth * scaleFactor + (Math.abs(boardOffset) * (94 * scaleFactor)),
                                height:
                                    state.status.orientation === "horizontal"
                                        ? baseBoardHeight * 2 * scaleFactor
                                        : baseBoardWidth * 2 * scaleFactor, //baseBoardWidth * scaleFactor * 2, //baseBoardHeight * 2 * scaleFactor,
                                position: "absolute",
                                top:
                                    state.status.orientation === "horizontal"
                                        ? "50%"
                                        : 0,
                                left:
                                    state.status.orientation === "horizontal"
                                        ? 0
                                        : "50%",
                                marginTop:
                                    state.status.orientation === "horizontal"
                                        ? (-baseBoardHeight * 2 * scaleFactor) /
                                          2
                                        : 0,
                                marginLeft:
                                    state.status.orientation === "horizontal"
                                        ? 0
                                        : -(baseBoardHeight * scaleFactor) / 2,
                                zIndex: 700,
                            }}
                            ref={rootRef}
                            onClick={handleClick}
                        />
                        {tokenHexes &&
                            Object.entries(tokenHexes).map(([k, hex]) => {
                                if (k.startsWith("Lethal") && hex.isOnBoard) {
                                    const { x, y } = getGrid(
                                        scaleFactor,
                                        state.status.orientation,
                                        state.status.offset
                                    )
                                        .get(hex.onBoard)
                                        .toPoint();

                                    return (
                                        <LethalHex
                                            key={k}
                                            x={x}
                                            y={y}
                                            pointyTokenBaseWidth={
                                                pointyTokenBaseWidth
                                            }
                                            baseSize={baseSize}
                                            scaleFactor={scaleFactor}
                                            orientation={
                                                state.status.orientation
                                            }
                                            isSelected={k === selectedTokenId}
                                        />
                                    );
                                }

                                if (k.startsWith("Feature") && hex.isOnBoard) {
                                    const { x, y } = getGrid(
                                        scaleFactor,
                                        state.status.orientation,
                                        state.status.offset
                                    )
                                        .get(hex.onBoard)
                                        .toPoint();

                                    return (
                                        <FeatureHex
                                            key={k}
                                            x={x}
                                            y={y}
                                            counter={hex.counter}
                                            pointyTokenBaseWidth={
                                                pointyTokenBaseWidth
                                            }
                                            baseSize={baseSize}
                                            scaleFactor={scaleFactor}
                                            orientation={
                                                state.status.orientation
                                            }
                                            isSelected={k === selectedTokenId}
                                            isLethal={hex.isLethal}
                                            number={hex.number}
                                        />
                                    );
                                }
                            })}
                        {fighters &&
                            Object.entries(fighters).map(([k, fighter]) => {
                                if (fighter.isOnBoard) {
                                    const { x, y } = getGrid(
                                        scaleFactor,
                                        state.status.orientation,
                                        state.status.offset
                                    )
                                        .get(fighter.onBoard)
                                        .toPoint();

                                    return (
                                        <div
                                            key={k}
                                            style={{
                                                position: "absolute",
                                                opacity:
                                                    selectedElement &&
                                                    selectedElement.type ===
                                                        "FEATURE_HEX"
                                                        ? 0.7
                                                        : 1,
                                                zIndex: !fighter.subtype
                                                    ? 600
                                                    : 599,
                                                width: 80 * scaleFactor,
                                                height: 80 * scaleFactor,
                                                transition: "all .17s ease-out",
                                                top:
                                                    state.status.orientation ===
                                                    "horizontal"
                                                        ? y +
                                                          (95 - 80) *
                                                              scaleFactor *
                                                              2.75 -
                                                          4
                                                        : y, //  + (((95 - 80) * scaleFactor) * 2.75 -4) * .5
                                                left:
                                                    state.status.orientation ===
                                                    "horizontal"
                                                        ? x +
                                                          ((95 - 80) *
                                                              scaleFactor) /
                                                              2 -
                                                          4
                                                        : x +
                                                          (baseSize *
                                                              scaleFactor) /
                                                              2 +
                                                          4, // + (((95 - 80) * scaleFactor) / 2 -4) * .5
                                                border: k.startsWith(myself.uid)
                                                    ? "3px solid limegreen"
                                                    : "3px solid red",
                                                borderRadius: 80,
                                                boxShadow:
                                                    k === selectedTokenId
                                                        ? k.startsWith(
                                                              myself.uid
                                                          )
                                                            ? "0 0 7px 7px limegreen"
                                                            : "0 0 7px 7px red"
                                                        : "",
                                            }}
                                        >
                                            <img
                                                src={`/assets/fighters/${fighter.icon}-icon.png`}
                                                style={{
                                                    width: "100%",
                                                    transform: !k.startsWith(
                                                        myself.uid
                                                    )
                                                        ? "scaleX(-1)"
                                                        : "",
                                                }}
                                            />
                                            {!fighter.subtype && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        zIndex: 601,
                                                        width: "2rem",
                                                        height: "2rem",
                                                        backgroundColor:
                                                            "darkred",
                                                        display: "flex",
                                                        border:
                                                            "1px solid white",
                                                        borderRadius: "1rem",
                                                        top: "-.5rem",
                                                        left: "-.5rem",
                                                        transformOrigin:
                                                            "center center",
                                                        transform: `scale(${scaleFactor})`,
                                                        boxSizing:
                                                            "boarder-box",
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    <Typography
                                                        style={{
                                                            fontSize: "1.5rem",
                                                            margin: "auto",
                                                            color: "white",
                                                            verticalAlign:
                                                                "middle",
                                                        }}
                                                    >
                                                        {fighter.wounds}
                                                    </Typography>
                                                </div>
                                            )}
                                            {fighter.tokens && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        display: "flex",
                                                        bottom:
                                                            -(
                                                                (75 / 2) *
                                                                scaleFactor
                                                            ) / 2,
                                                    }}
                                                >
                                                    {fighter.tokens
                                                        .split(",")
                                                        .map((t, idx) => (
                                                            <div
                                                                key={idx}
                                                                style={{
                                                                    backgroundImage: `url(/assets/other/${t}.png)`,
                                                                    width:
                                                                        (75 /
                                                                            2) *
                                                                        scaleFactor,
                                                                    height:
                                                                        (75 /
                                                                            2) *
                                                                        scaleFactor,
                                                                    backgroundSize:
                                                                        "cover",
                                                                    boxSizing:
                                                                        "border-box",
                                                                    border:
                                                                        "1px solid white",
                                                                    marginRight:
                                                                        ".2rem",
                                                                }}
                                                            />
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            })}
                        {scatterToken && scatterToken.isOnBoard && (
                            <img
                                src={`/assets/other/scatter.png`}
                                style={{
                                    position: "absolute",
                                    zIndex: 550,
                                    width: pointyTokenBaseWidth * scaleFactor,
                                    top:
                                        scatterTokenY < 0
                                            ? -10000
                                            : state.status.orientation ===
                                              "horizontal"
                                            ? scatterTokenY +
                                              (baseSize * scaleFactor) / 2
                                            : scatterTokenY - 4,
                                    left:
                                        scatterTokenX < 0
                                            ? -10000
                                            : state.status.orientation ===
                                              "horizontal"
                                            ? scatterTokenX
                                            : scatterTokenX +
                                              (baseSize * scaleFactor) / 2,
                                    transform: `rotate(${scatterToken.rotationAngle}deg)`,
                                    transformOrigin: "center center",
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div style={{ flex: "0 0 auto", height: "3rem" }}></div>
        </div>
    );
}

Board.propTypes = {
    state: PropTypes.object,
    selectedElement: PropTypes.object,
    scaleFactor: PropTypes.number,
    boardMeta: PropTypes.object,
    onScaleFactorChange: PropTypes.func,
};

export default Board;
