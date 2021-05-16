import React, { useState, useRef, useEffect } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ButtonBase from "@material-ui/core/ButtonBase";
import Divider from "@material-ui/core/Divider";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import MessengerScreenIcon from "@material-ui/icons/QuestionAnswer";
import BoardScreenIcon from "@material-ui/icons/ViewStream";
import GameOverviewIcon from "@material-ui/icons/EmojiEvents";
import SendMessageAction from "./SendMessageAction";
import Warband from "./Warband";
import PropTypes from "prop-types";
import { useAuthUser } from "../../../../../components/Session";
import ObjectiveHexesPile from "./ObjectiveHexesPile";
import LethalHexesPile from "./LethalHexesPile";
import RollDiceAction from "./RollDiceAction";
import ScatterToken from "./ScatterToken";
import GameStatusHUD from "../../GameStatusHUD";

const actions = [
    {
        type: "SEND_MESSAGE",
        value: "Send Message",
    },
    {
        type: "ROLL_DICE",
        value: "Roll dice",
    },
    {
        type: "PLACE_LETHAL_HEX",
        value: "Lethal Hexes",
    },
    {
        type: "PLACE_FEATURE_HEX",
        value: "Feature Hexes",
    },
    {
        type: "SCATTER",
        value: "Scatter",
    },
    {
        type: "PASS_POWER",
        subtype: "MESSAGE",
        value: "Pass power",
        say: (str, playerName) => playerName + str[1],
    },
    // {
    //     type: 'FIGHTERS',
    //     value: 'Fighters',
    // },
];

// ==========
// Warrior Icon credit: <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
// ==========

function ActionsPalette({
    data,
    activePaletteType,
    onSelectedElementChange,
    onActionTypeChange,
    onOpenDeckHUD,
    visibleScreenType,
    onSetScreenTabIndex,
}) {
    const myself = useAuthUser();
    // const firebase = useContext(FirebaseContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedAction, setSelectedAction] = useState(actions[0].type);
    const actionsRootRef = useRef(null);
    const [showMainHUD, setShowMainHUD] = useState(null);
    const [mainHUDPayload, setMainHUDPayload] = useState(null);
    const [mainHUDWasModified, setMainHUDWasModified] = useState(false);
    const [mainHUDModifications, setMainHUDModifications] = useState(null);

    useEffect(() => {
        if (!activePaletteType) return;
        setSelectedAction(activePaletteType);
    }, [activePaletteType]);

    const handleClick = (event) => {
        if (anchorEl) {
            setAnchorEl(null);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleItemSelect = (type) => () => {
        setSelectedAction(type);
        setAnchorEl(null);
        onActionTypeChange(actionsRootRef.current.offsetHeight);
    };

    // const handleMessageMenuItemClick = (action) => async () => {
    //     setAnchorEl(null);
    //     await firebase.addMessage2(data.id, {
    //         uid: myself.uid,
    //         value: action.say`${myself.username} will **pass on power**.`,
    //     });
    // };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFightersClick = () => {
        setSelectedAction("FIGHTERS");
    };

    const handleShowGameStatus = () => {
        setShowMainHUD("GAME_STATUS_INFO");
    };

    const handleShowFighterInfo = (fighter) => {
        setShowMainHUD("FIGHTER_INFO");
        setMainHUDPayload(fighter);
    };

    const handleCloseOverlay = (e) => {
        setShowMainHUD(null);
    };

    const handleSwitchScreen = () => {
        onSetScreenTabIndex(Number(!visibleScreenType));
    };

    const onGameStatusHUDModified = (value) => {
        setMainHUDWasModified(true);
        setMainHUDModifications(value);
    };

    return (
        <div
            ref={actionsRootRef}
            style={{
                flexGrow: 1,
                display: "flex",
                position: "relative",
                minHeight: 120 * 1.2,
                backgroundColor: "rgba(192,192,192, .8)",
            }}
        >
            <ButtonBase
                onClick={handleClick}
                style={{
                    padding: 0,
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "teal",
                    right: 0,
                    borderRadius: "1.5rem",
                    position: "absolute",
                    top: "-2rem",
                    transform: anchorEl ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform .2s ease-in-out",
                }}
            >
                <AddCircleIcon
                    style={{ width: "3rem", height: "3rem", color: "white" }}
                />
            </ButtonBase>

            <ButtonBase
                onClick={onOpenDeckHUD}
                style={{
                    padding: 0,
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "teal",
                    right: "4rem",
                    borderRadius: "1.5rem",
                    position: "absolute",
                    top: "-2rem",
                    boxSizing: "border-box",
                    boxShadow: "0 0 5px 5px darkgrey",
                }}
            >
                <svg
                    width="40"
                    height="31"
                    viewBox="0 0 40 31"
                    fill="none"
                    style={{ width: "2rem", height: "2rem" }}
                >
                    <path
                        d="M17.4313 0H17.4381L22.9498 0.0106234C22.9529 0.00725778 22.9562 0.00567981 22.9582 0.00389181C22 0.665979 21.2461 1.63413 20.8521 2.80832L14.3475 22.1917C14.3174 22.2795 14.2921 22.3656 14.2666 22.4528L14.3037 3.18717C14.3072 1.4242 15.7077 0 17.4313 0ZM1.0859 15.5037C-0.223877 14.3516 -0.368423 12.3326 0.759228 10.9978L3.83662 7.35364C3.88037 7.49311 3.92567 7.63247 3.97962 7.76846L10.2806 23.6102L1.0859 15.5037ZM11.9874 3.18486L11.952 21.5261L6.12569 6.8774C5.47595 5.24348 6.24367 3.37943 7.84265 2.71388L12.5428 0.762006C12.1929 1.49488 11.9908 2.31673 11.9874 3.18486ZM39.8307 9.4536L33.326 28.8365C32.8816 30.1639 31.6661 31 30.3665 31C30.0299 31 29.6901 30.9432 29.3531 30.8245L18.4817 27.019C16.8489 26.448 15.9768 24.6283 16.5394 22.9587L23.0437 3.57548C23.4881 2.24952 24.7036 1.41505 26.003 1.41505C26.3367 1.41505 26.6798 1.47079 27.0164 1.58912L37.8844 5.39504C39.5207 5.96773 40.3894 7.7835 39.8307 9.4536Z"
                        fill="white"
                    />
                </svg>
            </ButtonBase>

            <ButtonBase
                onClick={handleFightersClick}
                style={{
                    padding: 0,
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "teal",
                    right: "8rem",
                    borderRadius: "1.5rem",
                    position: "absolute",
                    top: "-2rem",
                    boxSizing: "border-box",
                    boxShadow: "0 0 5px 5px darkgrey",
                    color: "white",
                }}
            >
                <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 295.771 295.771"
                    fill="white"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                >
                    <path d="m257.764,224.086c-0.888-4.686-3.166-8.996-6.538-12.368l-26.112-26.112c2.88,22.33 9.967,56.375 14.155,75.647l20.943,3.967c1.249,0.237 2.535-0.16 3.434-1.059 0.899-0.899 1.296-2.185 1.059-3.434l-6.941-36.641z" />
                    <path d="m79.188,119.725l12.324,12.324c4.522-5.186 9.638-9.59 16.036-13.38l-13.652-13.652-14.708,14.708z" />
                    <path d="m48.13,129.57l80.926-80.926c5.2-5.2 5.2-13.631 0-18.83l-7.723-7.722c-6.514-6.514-17.558-4.607-21.477,3.777l-15.917,34.048c-13.684-13.683-10.738-10.738-24.622-24.622 1.525-9.186-1.247-18.946-8.334-26.033-11.663-11.663-30.573-11.663-42.236,0-11.663,11.663-11.663,30.572 0,42.236 7.086,7.086 16.847,9.859 26.032,8.334 13.886,13.884 10.939,10.938 24.623,24.622l-34.049,15.916c-8.369,3.912-10.294,14.96-3.777,21.478l7.722,7.722c5.201,5.2 13.632,5.2 18.832-2.84217e-14z" />
                    <path d="m44.546,211.717c-3.373,3.372-5.651,7.682-6.539,12.368l-6.94,36.641c-0.237,1.249 0.16,2.535 1.059,3.434 0.899,0.899 2.184,1.295 3.434,1.059l20.943-3.967c4.188-19.272 11.276-53.317 14.155-75.647l-26.112,26.112z" />
                    <path d="m204.26,132.049l12.324-12.324-14.708-14.708-13.652,13.652c6.39,3.786 11.508,8.188 16.036,13.38z" />
                    <path d="m147.886,108.378l-28.675-28.675-14.708,14.707 17.768,17.768c7.738-2.38 16.223-3.589 25.42-3.606 0.066,0 0.129-0.004 0.195-0.004 9.273,0 17.822,1.212 25.615,3.61l17.768-17.768-14.708-14.708-28.675,28.676z" />
                    <path d="m260.992,59.832c9.186,1.525 18.946-1.248 26.033-8.334 11.663-11.663 11.663-30.573 0-42.236s-30.572-11.663-42.235,0c-7.086,7.086-9.859,16.847-8.334,26.032-13.883,13.883-10.894,10.894-24.623,24.623l-15.916-34.049c-3.924-8.395-14.971-10.283-21.477-3.777l-7.722,7.722c-5.2,5.2-5.2,13.63 0,18.83l80.926,80.926c5.2,5.2 13.63,5.2 18.83,0l7.723-7.722c6.519-6.52 4.59-17.566-3.777-21.478l-34.049-15.916c13.682-13.683 10.736-10.737 24.621-24.621z" />
                    <path d="m147.886,123.569c-34.308,0-56.898,19.425-62.119,62.119-3.287,26.878-12.937,71.378-16.525,87.49-0.767,3.442 1.19,6.912 4.535,8.028l41.063,13.696c2.027,0.676 4.252,0.373 6.025-0.82 1.772-1.193 2.891-3.141 3.027-5.273l3.507-54.728c0.18-2.803-1.361-5.434-3.893-6.649l-19.598-9.406c-6.607-3.171-9.393-11.097-6.222-17.704 3.169-6.603 11.098-9.392 17.704-6.222l29.517,14.166c1.884,0.904 4.076,0.904 5.96,0l29.516-14.166c6.603-3.169 14.534-0.385 17.704,6.222 3.171,6.607 0.385,14.534-6.222,17.704l-19.598,9.406c-2.532,1.215-4.073,3.846-3.893,6.649l3.507,54.728c0.137,2.132 1.255,4.08 3.027,5.273 1.772,1.193 3.998,1.496 6.025,0.82l41.063-13.696c3.352-1.118 5.303-4.579 4.535-8.028-3.588-16.113-13.238-60.612-16.525-87.49-5.222-42.694-27.813-62.119-62.12-62.119z" />
                </svg>
            </ButtonBase>

            <ButtonBase
                onClick={handleShowGameStatus}
                style={{
                    padding: 0,
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "teal",
                    left: 0,
                    marginLeft: ".3rem",
                    borderRadius: "1.5rem",
                    position: "absolute",
                    top: "-2rem",
                    boxSizing: "border-box",
                    boxShadow: "0 0 5px 5px darkgrey",
                    color: "white",
                }}
            >
                <GameOverviewIcon />
            </ButtonBase>

            <ButtonBase
                onClick={handleSwitchScreen}
                style={{
                    padding: 0,
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "teal",
                    left: 0,
                    marginLeft: "4rem",
                    borderRadius: "1.5rem",
                    position: "absolute",
                    top: "-2rem",
                    boxSizing: "border-box",
                    boxShadow: "0 0 5px 5px darkgrey",
                    color: "white",
                }}
            >
                {visibleScreenType === 1 ? (
                    <MessengerScreenIcon />
                ) : (
                    <BoardScreenIcon />
                )}
            </ButtonBase>

            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {/* {actions
                    .filter(
                        (action) =>
                            action.subtype && action.subtype === "MESSAGE"
                    )
                    .map((action) => (
                        <MenuItem
                            key={action.type}
                            onClick={handleMessageMenuItemClick(action)}
                        >
                            {action.value}
                        </MenuItem>
                    ))} */}
                <Divider />
                {actions
                    .filter((action) => !action.subtype)
                    .map((action) => (
                        <MenuItem
                            key={action.type}
                            onClick={handleItemSelect(action.type)}
                        >
                            {action.value}
                        </MenuItem>
                    ))}
            </Menu>
            {selectedAction === "SEND_MESSAGE" && (
                <SendMessageAction roomId={data.id} />
            )}
            {selectedAction === "ROLL_DICE" && (
                <RollDiceAction
                    roomId={data.id}
                    defaultAmount={4}
                    myFaction={data[myself.uid].faction}
                />
            )}
            {selectedAction === "PLACE_LETHAL_HEX" && (
                <LethalHexesPile
                    roomId={data.id}
                    onSelectedTokenChange={onSelectedElementChange}
                    tokens={Object.entries(data.board.tokens)
                        .map(([id, value]) => ({ ...value, id: id }))
                        .filter((token) => token.id.startsWith("Lethal"))}
                />
            )}
            {selectedAction === "PLACE_FEATURE_HEX" && (
                <ObjectiveHexesPile
                    roomId={data.id}
                    onSelectedTokenChange={onSelectedElementChange}
                    tokens={Object.entries(data.board.tokens)
                        .map(([id, value]) => ({ ...value, id: id }))
                        .filter((token) => token.id.startsWith("Feature"))}
                />
            )}
            {selectedAction === "FIGHTERS" && (
                <Warband
                    roomId={data.id}
                    onSelectedFighterChange={onSelectedElementChange}
                    myfighters={Object.entries(data.board.fighters)
                        .map(([id, value]) => ({ ...value, id: id }))
                        .filter((token) => token.id.startsWith(myself.uid))}
                    enemyFighters={Object.entries(data.board.fighters)
                        .map(([id, value]) => ({ ...value, id: id }))
                        .filter((token) => !token.id.startsWith(myself.uid))}
                    onShowSelectedFighterInfo={handleShowFighterInfo}
                    playerInfo={data[myself.uid]}
                />
            )}
            {selectedAction === "SCATTER" && (
                <ScatterToken
                    onSelectionChange={onSelectedElementChange}
                    orientation={data.status && data.status.orientation}
                />
            )}
            {showMainHUD === "GAME_STATUS_INFO" && (
                <GameStatusHUD data={data} onClose={handleCloseOverlay} />
            )}
        </div>
    );
}

ActionsPalette.propTypes = {
    data: PropTypes.object,
    activePaletteType: PropTypes.string,
    onSelectedElementChange: PropTypes.func,
    onActionTypeChange: PropTypes.func,
    onOpenDeckHUD: PropTypes.func,
    visibleScreenType: PropTypes.number,
    onSetScreenTabIndex: PropTypes.func,
};

export default ActionsPalette;
