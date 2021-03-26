import React, { useEffect, useContext, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { FirebaseContext } from "../../../firebase";
import ActionsPalette from "./ActionsPalette";
import Board from "./Board";
import { useAuthUser } from "../../../components/Session";
import { boards as boardsData } from "../../../data/index";
import CardsHUD from "./CardsHUD/CardsHUD";
import Messenger from "./Messenger";

export default function PhoneRoom({ data }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const { state } = useLocation();
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up("md"));
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedElement, setSelectedElement] = useState(null);
    // const [data, setData] = useState(state);
    const [activePaletteType, setActivePaletteType] = useState(null);
    const [, setActionsPanelOffsetHeight] = useState(4 * 16);
    const [isHUDOpen, setIsHUDOpen] = useState(false);

    const [hand, setHand] = useState(data[myself.uid] && data[myself.uid].hand);
    const [objectiveDrawPile, setObjectiveDrawPile] = useState(
        data[myself.uid] && data[myself.uid].oDeck
    );
    const [powersDrawPile, setPowersDrawPile] = useState(
        data[myself.uid] && data[myself.uid].pDeck
    );
    const [scoredObjectivesPile, setScoredObjectivesPile] = useState(
        data[myself.uid] && data[myself.uid].sObjs
    );
    const [objectivesDiscardPile, setObjectivesDiscardPile] = useState(
        data[myself.uid] && data[myself.uid].dObjs
    );
    const [powersDiscardPile, setPowersDiscardPile] = useState(
        data[myself.uid] && data[myself.uid].dPws
    );

    const [opponent] = useState(
        data[data.players.find((p) => p !== myself.uid)]
    );

    const [enemyHand, setEnemyHand] = useState(opponent && opponent.hand);
    const [enemyScoredObjectivesPile, setEnemyScoredObjectivesPile] = useState(
        opponent && opponent.sObjs
    );
    const [
        enemyObjectivesDiscardPile,
        setEnemyObjectivesDiscardPile,
    ] = useState(opponent && opponent.dObjs);
    const [enemyPowersDiscardPile, setEnemyPowersDiscardPile] = useState(
        opponent && opponent.dPws
    );

    const [boardScaleFactor, setBoardScaleFactor] = useState(0.5);
    const boardMeta = useMemo(() => {
        const { stage, orientation, offset, top, bottom } = data.status;
        const meta = {
            scaleFactor: boardScaleFactor,
            startingHexes:
                stage !== "READY"
                    ? []
                    : orientation === "horizontal"
                    ? [
                          ...boardsData[top.id][orientation].startingHexes[
                              top.rotate
                          ].map(([x, y]) =>
                              offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                          ),
                          ...boardsData[bottom.id][orientation].startingHexes[
                              bottom.rotate
                          ].map(([x, y]) =>
                              offset > 0 ? [x + offset, y + 6] : [x, y + 6]
                          ),
                      ]
                    : [
                          ...boardsData[top.id][orientation].startingHexes[
                              top.rotate
                          ], // .map(([x, y]) => offset < 0 ? [x + Math.abs(offset), y] : [x, y])
                          ...boardsData[bottom.id][orientation].startingHexes[
                              bottom.rotate
                          ].map(([x, y]) => [x, y + 8]),
                      ],
            blockedHexes:
                stage !== "READY"
                    ? []
                    : orientation === "horizontal"
                    ? [
                          ...boardsData[top.id][orientation].blockedHexes[
                              top.rotate
                          ].map(([x, y]) =>
                              offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                          ),
                          ...boardsData[bottom.id][orientation].blockedHexes[
                              bottom.rotate
                          ].map(([x, y]) =>
                              offset > 0 ? [x + offset, y + 6] : [x, y + 6]
                          ),
                      ]
                    : [
                          ...boardsData[top.id][orientation].blockedHexes[
                              top.rotate
                          ], // .map(([x, y]) => offset < 0 ? [x + Math.abs(offset), y] : [x, y])
                          ...boardsData[bottom.id][orientation].blockedHexes[
                              bottom.rotate
                          ].map(([x, y]) => [x, y + 8]),
                      ],
            lethalHexes:
                stage !== "READY"
                    ? []
                    : orientation === "horizontal"
                    ? [
                          ...boardsData[top.id][orientation].lethalHexes[
                              top.rotate
                          ].map(([x, y]) =>
                              offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                          ),
                          ...boardsData[bottom.id][orientation].lethalHexes[
                              bottom.rotate
                          ].map(([x, y]) =>
                              offset > 0 ? [x + offset, y + 6] : [x, y + 6]
                          ),
                      ]
                    : [
                          ...boardsData[top.id][orientation].lethalHexes[
                              top.rotate
                          ], // .map(([x, y]) => offset < 0 ? [x + Math.abs(offset), y] : [x, y])
                          ...boardsData[bottom.id][orientation].lethalHexes[
                              bottom.rotate
                          ].map(([x, y]) => [x, y + 8]),
                      ],
        };

        return meta;
    }, [boardScaleFactor, data.status]);

    useEffect(() => {
        window.addEventListener("keydown", handleHotkeyDown);

        return () => {
            window.removeEventListener("keydown", handleHotkeyDown);
        };
    }, []);

    useEffect(() => {
        if (data[myself.uid].hand !== hand) {
            setHand(data[myself.uid] && data[myself.uid].hand);
        }

        // my drawing piles
        if (data[myself.uid].oDeck !== objectiveDrawPile) {
            setObjectiveDrawPile(data[myself.uid] && data[myself.uid].oDeck);
        }

        if (data[myself.uid].pDeck !== powersDrawPile) {
            setPowersDrawPile(data[myself.uid] && data[myself.uid].pDeck);
        }

        // my stuff
        if (data[myself.uid].sObjs !== scoredObjectivesPile) {
            setScoredObjectivesPile(data[myself.uid] && data[myself.uid].sObjs);
        }

        if (data[myself.uid].dObjs !== objectivesDiscardPile) {
            setObjectivesDiscardPile(
                data[myself.uid] && data[myself.uid].dObjs
            );
        }

        if (data[myself.uid].dPws !== powersDiscardPile) {
            setPowersDiscardPile(data[myself.uid] && data[myself.uid].dPws);
        }

        // enemy stuff
        const opponent = data[data.players.find((p) => p !== myself.uid)];
        setEnemyHand(opponent && opponent.hand);
        setEnemyScoredObjectivesPile(opponent && opponent.sObjs);
        setEnemyObjectivesDiscardPile(opponent && opponent.dObjs);
        setEnemyPowersDiscardPile(opponent && opponent.dPws);
    }, [data]);

    const handleHotkeyDown = (event) => {
        if (event && event.target.type === "textarea") return;

        // switch main tab
        if (event.key === "q") {
            setTabIndex((current) => Number(!current));
            return;
        }

        if (event.key === "w") {
            setActivePaletteType("FIGHTERS");
            return;
        }

        if (event.key === "a") {
            setActivePaletteType("ROLL_DICE");
            return;
        }
    };

    const handleActionTypeChange = (offsetHeight) => {
        setActionsPanelOffsetHeight(offsetHeight);
    };

    const changeOpenDeckHUD = () => {
        setIsHUDOpen(true);
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "dimgray",
            }}
        >
            <div
                style={{
                    filter: isHUDOpen ? "blur(3px)" : "",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {isMd && (
                    <div style={{ flex: 1, display: "flex" }}>
                        <Messenger roomId={state.id} state={data} />
                        <Board
                            roomId={state.id}
                            state={data}
                            selectedElement={selectedElement}
                            scaleFactor={boardScaleFactor}
                            boardMeta={boardMeta}
                            onScaleFactorChange={setBoardScaleFactor}
                        />
                    </div>
                )}
                {!isMd && (
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            backgroundColor: "dimgray",
                        }}
                    >
                        {tabIndex === 0 && (
                            <Messenger roomId={state.id} state={data} />
                        )}
                        {tabIndex === 1 && (
                            <Board
                                roomId={state.id}
                                state={data}
                                selectedElement={selectedElement}
                                scaleFactor={boardScaleFactor}
                                boardMeta={boardMeta}
                                onScaleFactorChange={setBoardScaleFactor}
                            />
                        )}
                    </div>
                )}
                <div style={{ flex: "0 0 25%", display: "flex" }}>
                    <ActionsPalette
                        onActionTypeChange={handleActionTypeChange}
                        data={data}
                        onSelectedElementChange={setSelectedElement}
                        onOpenDeckHUD={changeOpenDeckHUD}
                        visibleScreenType={tabIndex}
                        onSetScreenTabIndex={setTabIndex}
                        activePaletteType={activePaletteType}
                    />
                </div>
            </div>

            {isHUDOpen && (
                <CardsHUD
                    roomId={data.id}
                    myData={data[myself.uid]}
                    myFighters={Object.entries(
                        data.board.fighters
                    ).filter(([fighterId]) => fighterId.startsWith(myself.uid))}
                    objectivesPile={objectiveDrawPile}
                    powerCardsPile={powersDrawPile}
                    serverHand={hand}
                    enemyHand={enemyHand}
                    scoredObjectivesPile={scoredObjectivesPile}
                    objectivesDiscardPile={objectivesDiscardPile}
                    powersDiscardPile={powersDiscardPile}
                    enemyScoredObjectivesPile={enemyScoredObjectivesPile}
                    enemyObjectivesDiscardPile={enemyObjectivesDiscardPile}
                    enemyPowersDiscardPile={enemyPowersDiscardPile}
                    onClose={setIsHUDOpen}
                />
            )}
        </div>
    );
}
