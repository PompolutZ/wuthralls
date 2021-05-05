import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import ActionsPalette from "./ActionsPalette";
import Board from "./Board";
import { useAuthUser } from "../../../components/Session";
import { boards as boardsData } from "../../../data/index";
import CardsHUD from "./CardsHUD/CardsHUD";
import MessagesList from "./Messenger";
import Telegram from "./components/Messanger";

export default function PhoneRoom({ data }) {
    const myself = useAuthUser();
    const { state } = useLocation();
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up("md"));
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedElement, setSelectedElement] = useState(null);
    const [activePaletteType, setActivePaletteType] = useState(null);
    const [, setActionsPanelOffsetHeight] = useState(4 * 16);
    const [isHUDOpen, setIsHUDOpen] = useState(false);

    const [boardScaleFactor, setBoardScaleFactor] = useState(0.5);

    // This is bad piece of code, since in reality we do not need to read boards meta, which
    // describes boards placement and appearance of special hexes on them. This is information
    // needed during setup and once per room load. But since we read everything in one package
    // we have what we have :)

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
                    <div
                        style={{
                            flex: 1,
                            display: "grid",
                            gridTemplateColumns: "33% 1fr",
                            columnGap: ".5rem",
                        }}
                    >
                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            <MessagesList roomId={state.id} state={data} />
                            <div style={{ flex: "0 0 auto", display: "flex" }}>
                                <Telegram />
                            </div>
                        </div>

                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            <Board
                                roomId={state.id}
                                state={data}
                                selectedElement={selectedElement}
                                scaleFactor={boardScaleFactor}
                                boardMeta={boardMeta}
                                onScaleFactorChange={setBoardScaleFactor}
                            />
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
                    </div>
                )}
                {!isMd && (
                    <>
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                backgroundColor: "dimgray",
                            }}
                        >
                            {tabIndex === 0 && (
                                <MessagesList roomId={state.id} state={data} />
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
                    </>
                )}
            </div>

            {isHUDOpen && (
                <CardsHUD
                    myFighters={Object.entries(
                        data.board.fighters
                    ).filter(([fighterId]) => fighterId.startsWith(myself.uid))}
                    onClose={setIsHUDOpen}
                />
            )}
        </div>
    );
}
