import React, { useState, useContext } from "react";
import { useAuthUser } from "../../../components/Session";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { FirebaseContext } from "../../../firebase";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { sortByIdAsc } from "../../../utils";
import FighterHUD from "./FighterHUD";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        position: "relative",
        "&::-webkit-scrollbar-thumb": {
            width: "10px",
            height: "10px",
        },
    },

    itemsContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        overflow: "auto",
    },
}));
function Warband({
    roomId,
    myfighters,
    enemyFighters,
    onSelectedFighterChange,
    onShowSelectedFighterInfo,
    playerInfo,
}) {
    const classes = useStyles();
    const myself = useAuthUser();
    const fighters = [
        ...myfighters.sort(sortByIdAsc),
        ...enemyFighters.sort(sortByIdAsc),
    ];
    const pointyTokenBaseWidth = 95;
    const [selectedFighter, setSelectedFighter] = useState(null);
    const firebase = useContext(FirebaseContext);
    const [fighterHUDId, setFighterHUDId] = useState(undefined);

    const handleFighterClicked = (fighter) => () => {
        if (!selectedFighter || selectedFighter.id !== fighter.id) {
            setSelectedFighter(fighter);
            onSelectedFighterChange(fighter);
        } else {
            setSelectedFighter(null);
            onSelectedFighterChange(null);
        }
    };

    const handleRemoveFromBoard = (fighter) => (e) => {
        e.preventDefault();
        firebase.updateBoardProperty(roomId, `board.fighters.${fighter.id}`, {
            ...fighter,
            isOnBoard: false,
            left: 0,
            top: 0,
            onBoard: { x: -1, y: -1 },
            tokens: "",
        });
        firebase.addGenericMessage2(roomId, {
            author: "Katophrane",
            type: "INFO",
            subtype: "PLACEMENT",
            value: `${myself.username} took ${fighter.name} out of action.`,
        });
    };

    const handleShowFighterInfo = (fighter) => (e) => {
        setFighterHUDId(fighter.id);
        // onShowSelectedFighterInfo({
        //     ...fighter,
        //     unspentGlory: playerInfo.gloryScored - playerInfo.glorySpent,
        //     playerInfo: playerInfo,
        //     roomId: roomId,
        // });
        // e.preventDefault();
    };

    const handleCloseFighterHUD = () => {
        console.log("O cmon dude!");
        setFighterHUDId(undefined);
    };

    return (
        <>
            <div className={classes.root}>
                <div className={classes.itemsContainer}>
                    {fighters.map((fighter) => (
                        <div
                            key={fighter.id}
                            style={{
                                marginRight: "1rem",
                                paddingTop: "1rem",
                                paddingLeft: "1rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                            onClick={handleFighterClicked(fighter)}
                        >
                            <div
                                style={{
                                    width: pointyTokenBaseWidth * 0.7,
                                    height: pointyTokenBaseWidth * 0.7,
                                    borderRadius: pointyTokenBaseWidth * 0.7,
                                    boxSizing: "border-box",
                                    position: "relative",
                                    border: fighter.id.startsWith(myself.uid)
                                        ? selectedFighter &&
                                          selectedFighter.id === fighter.id
                                            ? "3px dashed green"
                                            : "3px solid green"
                                        : selectedFighter &&
                                          selectedFighter.id === fighter.id
                                        ? "3px dashed red"
                                        : "3px solid red",
                                    filter:
                                        selectedFighter &&
                                        selectedFighter.id === fighter.id
                                            ? fighter.id.startsWith(myself.uid)
                                                ? "drop-shadow(0 0 .5rem green)"
                                                : "drop-shadow(0 0 .5rem crimson)"
                                            : "",
                                    transition: "all .175s ease-out",
                                }}
                            >
                                <img
                                    src={
                                        fighter.isInspired
                                            ? fighter.iconInspired
                                                ? `/assets/fighters/${fighter.iconInspired}-icon.png`
                                                : `/assets/fighters/${fighter.icon}-icon.png`
                                            : `/assets/fighters/${fighter.icon}-icon.png`
                                    }
                                    style={{
                                        width: "100%",
                                        filter: fighter.isOnBoard
                                            ? ""
                                            : "grayscale(100%)",
                                        transform: !fighter.id.startsWith(
                                            myself.uid
                                        )
                                            ? "scaleX(-1)"
                                            : "",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        width: "2rem",
                                        height: "2rem",
                                        boxSizing: "border-box",
                                        background: "darkred",
                                        color: "white",
                                        borderRadius: "1rem",
                                        border: "2px solid white",
                                        top: 0,
                                        marginTop: "-1rem",
                                        left: 0,
                                        marginLeft: "-1rem",
                                        display: "flex",
                                        zIndex: "1",
                                    }}
                                >
                                    <Typography
                                        style={{
                                            margin: "auto",
                                            fontSize: ".8rem",
                                        }}
                                    >
                                        {fighter.wounds}
                                    </Typography>
                                </div>

                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                        top: 0,
                                        zIndex: 1,
                                        boxSizing: "border-box",
                                        // border: fighter.id.startsWith(myself.uid) ? '3px solid green' : '3px dashed red',
                                        borderRadius: "70%",
                                        boxShadow: fighter.isInspired
                                            ? "inset 0px 0px 15px yellow"
                                            : "",
                                    }}
                                />
                                {selectedFighter &&
                                    selectedFighter.id === fighter.id &&
                                    fighter.isOnBoard && (
                                        <ButtonBase
                                            style={{
                                                position: "absolute",
                                                bottom: "0%",
                                                right: "0%",
                                                marginBottom: "-.7rem",
                                                marginRight: "-1rem",
                                                backgroundColor: "red",
                                                color: "white",
                                                width: "2rem",
                                                height: "2rem",
                                                borderRadius: "1.5rem",
                                                zIndex: 2,
                                                boxSizing: "border-box",
                                                border: "2px solid white",
                                            }}
                                            onClick={handleRemoveFromBoard(
                                                fighter
                                            )}
                                        >
                                            <DeleteIcon
                                                style={{
                                                    width: "1rem",
                                                    height: "1rem",
                                                }}
                                            />
                                        </ButtonBase>
                                    )}
                                {selectedFighter &&
                                    selectedFighter.id === fighter.id &&
                                    !fighter.subtype && (
                                        <ButtonBase
                                            style={{
                                                position: "absolute",
                                                top: "0%",
                                                right: "0%",
                                                backgroundColor: "teal",
                                                color: "white",
                                                width: "2rem",
                                                height: "2rem",
                                                marginTop: "-.7rem",
                                                marginRight: "-1rem",
                                                borderRadius: "1.5rem",
                                                zIndex: 2,
                                                boxSizing: "border-box",
                                                border: "2px solid white",
                                            }}
                                            onClick={handleShowFighterInfo(
                                                fighter
                                            )}
                                        >
                                            <EditIcon
                                                style={{
                                                    width: "1rem",
                                                    height: "1rem",
                                                }}
                                            />
                                        </ButtonBase>
                                    )}
                            </div>
                            <Typography style={{ fontSize: ".7rem" }}>
                                {!fighter.isInspired ||
                                (fighter.isInspired && !fighter.nameInspired)
                                    ? fighter.name
                                    : fighter.nameInspired}
                            </Typography>
                            <div style={{ display: "flex" }}>
                                {Boolean(fighter.tokens) &&
                                    fighter.tokens
                                        .split(",")
                                        .map((token, idx) => (
                                            <img
                                                key={idx}
                                                src={`/assets/other/${token}.png`}
                                                style={{
                                                    width: "1rem",
                                                    height: "1rem",
                                                    marginRight: ".1rem",
                                                }}
                                            />
                                        ))}
                                {Boolean(fighter.counters) &&
                                    fighter.counters
                                        .split(",")
                                        .map((counter, idx) => (
                                            <img
                                                key={idx}
                                                src={`/assets/other/${counter}.png`}
                                                style={{
                                                    width: "1rem",
                                                    height: "1rem",
                                                    marginRight: ".1rem",
                                                }}
                                            />
                                        ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {fighterHUDId && (
                <FighterHUD
                    fighterId={fighterHUDId}
                    onClose={handleCloseFighterHUD}
                />
            )}
        </>
    );
}

Warband.propTypes = {
    roomId: PropTypes.string,
    myfighters: PropTypes.array,
    enemyFighters: PropTypes.array,
    onSelectedFighterChange: PropTypes.func,
    onShowSelectedFighterInfo: PropTypes.func,
    playerInfo: PropTypes.object,
};

export default Warband;
