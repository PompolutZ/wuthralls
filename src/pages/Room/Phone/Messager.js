import React, {
    useEffect,
    useContext,
    useState,
    useRef,
    useLayoutEffect,
} from "react";
import { FirebaseContext } from "../../../firebase";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import { useAuthUser } from "../../../components/Session";
import SplitButton from "./SplitButton";
import Die from "../../../components/Die";
import { getDieRollResult } from "../../../common/function";
import HUDOverlay from "../../../components/HUDOverlay";
import boards from "../../../data/boards";
import ButtonBase from "@material-ui/core/ButtonBase";
import MoveNextIcon from "@material-ui/icons/LabelImportant";
import FlipIcon from "@material-ui/icons/RotateRight";
import VisibilityIcon from "@material-ui/icons/Visibility";
import useKatophrane from "../../../components/hooks/useKatophrane";
import Markdown from "react-markdown";
import AttackDie from "../../../components/AttackDie";
import DefenceDie from "../../../components/DefenceDie";
import MagicDie from "../../../components/MagicDie";
import Scrollbar from "react-scrollbars-custom";
import { warbandColors, boards as boardsInfo } from "../../../data";

const useStyles = makeStyles(theme => ({
    item: {
        // margin: '.5rem 1rem .5rem .5rem',
        padding: ".5rem",
        // borderRadius: '.3rem',
    },

    root: {
        flexGrow: 1,
    },
}));

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

const DiceRollMessage = React.memo(
    ({ id, author, value, type, timestamp, authorFaction }) => {
        const classes = useStyles();
        const [created, setCreated] = useState(null);

        useEffect(() => {
            const date = new Date();
            date.setTime(timestamp);
            setCreated(date);
        }, []);

        const { r, g, b } = hexToRgb(warbandColors[authorFaction]);

        return (
            <Grid
                id={timestamp}
                item
                xs={12}
                className={classes.item}
                style={{ backgroundColor: `rgba(${r},${g},${b}, .5)` }}
            >
                <Typography
                    variant="body2"
                    style={{
                        color: "ghostwhite",
                        fontWeight: "bold",
                        fontSize: ".6rem",
                    }}
                >{`${author} rolls ${type}:`}</Typography>
                <Typography
                    variant="body2"
                    style={{ color: "lightgray", fontSize: ".6rem" }}
                >{`${created &&
                    created.toLocaleString("en-US", {
                        hour12: false,
                    })}`}</Typography>
                <div style={{ display: "flex", margin: "1rem" }}>
                    {value.split(",").map((x, i) => (
                        <div
                            key={i}
                            style={{
                                width: 36,
                                height: 36,
                                marginRight: ".2rem",
                                backgroundColor: "white",
                                borderRadius: 36 * 0.2,
                                filter: "drop-shadow(2.5px 2.5px 5px black)",
                            }}
                        >
                            {type === "ATTACK" && (
                                <AttackDie
                                    accentColorHex={
                                        warbandColors[authorFaction]
                                    }
                                    size={36}
                                    side={x}
                                    useBlackOutline={
                                        authorFaction === "zarbags-gitz"
                                    }
                                />
                            )}
                            {type === "DEFENCE" && (
                                <DefenceDie
                                    accentColorHex={
                                        warbandColors[authorFaction]
                                    }
                                    size={36}
                                    side={x}
                                    useBlackOutline={
                                        authorFaction === "zarbags-gitz"
                                    }
                                />
                            )}
                            {type === "MAGIC" && (
                                <MagicDie size={36} side={x} />
                            )}
                            {type === "INITIATIVE" && i % 2 === 0 && (
                                <DefenceDie
                                    accentColorHex={
                                        warbandColors[authorFaction]
                                    }
                                    size={36}
                                    side={x}
                                    useBlackOutline={
                                        authorFaction === "zarbags-gitz"
                                    }
                                />
                            )}
                            {type === "INITIATIVE" && i % 2 !== 0 && (
                                <AttackDie
                                    accentColorHex={
                                        warbandColors[authorFaction]
                                    }
                                    size={36}
                                    side={x}
                                    useBlackOutline={
                                        authorFaction === "zarbags-gitz"
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            </Grid>
        );
    }
);

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const CardMessageItem = React.memo(
    ({ isLastMessage, author, isMineMessage, cardId, value, timestamp }) => {
        const classes = useStyles();
        const [highlight, setHighlight] = useState(false);
        const [created, setCreated] = useState(null);

        useEffect(() => {
            const date = new Date();
            date.setTime(timestamp);
            setCreated(date);
        }, []);

        const handleSwitchHighglight = () => {
            setHighlight(prev => !prev);
        };

        return (
            <Grid
                id={timestamp}
                item
                xs={12}
                className={classes.item}
                style={{
                    backgroundColor:
                        author === "Katophrane"
                            ? "rgba(0, 128, 128, 1)"
                            : isMineMessage
                            ? "rgba(255, 140, 0, 1)"
                            : "rgba(138, 43, 226, 1)",
                    // filter: 'drop-shadow(5px 5px 10px black)',
                }}
            >
                <div>
                    <Typography
                        variant="body2"
                        style={{
                            color: isMineMessage ? "magenta" : "ghostwhite",
                            fontWeight: "bold",
                            fontSize: ".6rem",
                        }}
                    >{`${author}`}</Typography>
                    <Typography
                        variant="body2"
                        style={{ color: "ghostwhite", fontSize: ".6rem" }}
                    >{`${created &&
                        created.toLocaleString("en-US", {
                            hour12: false,
                        })}`}</Typography>
                </div>
                <div style={{ display: 'flex' }}>
                    <div style={{ color: "white", flex: 1 }}>
                        <Markdown source={value} />
                    </div>
                    <Button style={{ flex: '0 0 auto', color: 'ghostwhite' }} onClick={handleSwitchHighglight}>
                        <VisibilityIcon />
                    </Button>
                </div>
                {/* <img
                    src={`/assets/cards/${cardId}.png`}
                    style={{ width: "5rem", borderRadius: ".3rem" }}
                    onClick={handleSwitchHighglight}
                /> */}
                {highlight && (
                    <div
                        style={{
                            position: "fixed",
                            width: "100%",
                            height: "100%",
                            top: "0",
                            left: "0",
                            display: "flex",
                            zIndex: 100000,
                            perspective: "5rem",
                            backgroundColor: "rgba(255,255,255,.5)",
                        }}
                    >
                        <Paper
                            style={{
                                position: "relative",
                                flexShrink: 0,
                                width: cardDefaultWidth,
                                height: cardDefaultHeight,
                                margin: "auto",
                                borderRadius: "1rem",
                                backgroundPosition: "center center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundImage: `url(/assets/cards/${cardId}.png)`,
                            }}
                            elevation={10}
                            onClick={handleSwitchHighglight}
                        ></Paper>
                    </div>
                )}
            </Grid>
        );
    }
);

const ChatMessageItem = React.memo(
    ({ isLastMessage, author, isMineMessage, value, timestamp }) => {
        const classes = useStyles();
        const [created, setCreated] = useState(null);

        useEffect(() => {
            const date = new Date();
            date.setTime(timestamp);
            setCreated(date);
        }, []);

        return (
            <Grid
                id={timestamp}
                item
                xs={12}
                className={classes.item}
                style={{
                    backgroundColor: "#36393F",
                }}
            >
                <div>
                    <Typography
                        variant="body2"
                        style={{
                            color: isMineMessage ? "magenta" : "ghostwhite",
                            fontWeight: "bold",
                            fontSize: ".6rem",
                        }}
                    >{`${author}`}</Typography>
                    <Typography
                        variant="body2"
                        style={{ color: "#727479", fontSize: ".6rem" }}
                    >{`${created &&
                        created.toLocaleString("en-US", {
                            hour12: false,
                        })}`}</Typography>
                </div>
                <div
                    style={{
                        color:
                            author === "Katophrane"
                                ? "#ACD0D4"
                                : isMineMessage
                                ? "#FFEFD5"
                                : "#FA8072",
                    }}
                >
                    <Markdown source={value} />
                </div>
            </Grid>
        );
    }
);

function InteractiveMessage({
    data,
    roomId,
    isLastMessage,
    timestamp,
    onShowHUD,
    state,
}) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const katophrane = useKatophrane(state);
    const actors = data.actors;
    const classes = useStyles();
    const [created, setCreated] = useState(null);
    const opponent = actors.find(p => p !== myself.uid) || "";
    const [rollResults, setRollResults] = useState(
        Object.entries(data)
            .filter(([k, v]) => k.includes("_roll"))
            .map(([k, v]) => ({ roll: v, id: k }))
    );
    const [boards, setBoards] = useState(
        Object.entries(data)
            .filter(([k, v]) => k.includes("_board"))
            .map(([k, v]) => ({ board: v, id: k }))
    );

    useEffect(() => {
        const date = new Date();
        date.setTime(timestamp);
        setCreated(date);
        console.log("LOADED", data);
    }, []);

    useEffect(() => {
        console.log("CHANGED DATA");
        setRollResults(
            Object.entries(data)
                .filter(([k, v]) => k.includes("_roll"))
                .map(([k, v]) => ({ roll: v, id: k }))
        );
        setBoards(
            Object.entries(data)
                .filter(([k, v]) => k.includes("_board"))
                .map(([k, v]) => ({ board: v, id: k }))
        );
    }, [data]);

    const handleInitiativeRoll = () => {
        const rollResult = new Array(4).fill(0).map(_ => getDieRollResult());
        //setMyRoll(rollResult);
        const allResults = [
            ...rollResults,
            {
                id: `${myself.uid}_roll_${rollResult.join("")}`,
                roll: rollResult.join(),
            },
        ];
        setRollResults(allResults);

        katophrane.registerInitiativeResult(timestamp, myself.uid, allResults);
    };

    const handlePickBoardFirst = () => {
        onShowHUD("PICK_FIRST_BOARD", {
            playerId: myself.uid,
            messageId: timestamp,
        });
    };

    const handlePickSecondBoard = () => {
        onShowHUD("PICK_SECOND_BOARD", {
            playerId: myself.uid,
            messageId: timestamp,
            opponentBoard: boards.find(b => !b.id.includes(myself.uid)).board,
        });
    };

    const handlePassFirstBoardSelection = () => {
        katophrane.passFirstBoardSelection(timestamp, myself.uid);
    };

    return (
        <Grid
            id={timestamp}
            item
            xs={12}
            className={classes.item}
            style={{ border: "3px solid rgba(255,69,0)" }}
        >
            <Typography
                variant="body2"
                style={{
                    color: "rgba(255,69,0)",
                    fontWeight: "bold",
                    fontSize: "1rem",
                }}
            >{`Initiative roll for boards selection`}</Typography>
            <Typography
                variant="body2"
                style={{ color: "ghostwhite", fontSize: ".6rem" }}
            >{`${created &&
                created.toLocaleString("en-US", {
                    hour12: false,
                })}`}</Typography>

            <Grid container>
                <Grid item xs={6}>
                    <Typography
                        variant="body2"
                        style={{
                            color: "gray",
                            fontWeight: "bold",
                            fontSize: ".8rem",
                        }}
                    >{`My results`}</Typography>
                    <Grid container direction="column" alignItems="center">
                        {rollResults &&
                            rollResults.length > 0 &&
                            rollResults
                                .filter(r => r.id.includes(myself.uid))
                                .map(r => (
                                    <div key={r.id} style={{ display: "flex" }}>
                                        {r.roll.split(",").map((x, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    marginRight: ".2rem",
                                                    backgroundColor: "white",
                                                    borderRadius: 36 * 0.2,
                                                }}
                                            >
                                                {i % 2 === 0 && (
                                                    <DefenceDie
                                                        accentColorHex={
                                                            warbandColors[
                                                                state[
                                                                    myself.uid
                                                                ].faction
                                                            ]
                                                        }
                                                        size={36}
                                                        side={x}
                                                        useBlackOutline={
                                                            state[myself.uid]
                                                                .faction ===
                                                            "zarbags-gitz"
                                                        }
                                                    />
                                                )}
                                                {i % 2 !== 0 && (
                                                    <AttackDie
                                                        accentColorHex={
                                                            warbandColors[
                                                                state[
                                                                    myself.uid
                                                                ].faction
                                                            ]
                                                        }
                                                        size={36}
                                                        side={x}
                                                        useBlackOutline={
                                                            state[myself.uid]
                                                                .faction ===
                                                            "zarbags-gitz"
                                                        }
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Typography
                        variant="body2"
                        style={{
                            color: "gray",
                            fontWeight: "bold",
                            fontSize: ".8rem",
                        }}
                    >{`Opponent's result`}</Typography>
                    <Grid container direction="column" alignItems="center">
                        {rollResults &&
                            rollResults.length > 0 &&
                            rollResults
                                .filter(r => r.id.includes(opponent))
                                .map(r => (
                                    <div key={r.id} style={{ display: "flex" }}>
                                        {r.roll.split(",").map((x, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    marginRight: ".2rem",
                                                    backgroundColor: "white",
                                                    borderRadius: 36 * 0.2,
                                                }}
                                            >
                                                {i % 2 === 0 && (
                                                    <DefenceDie
                                                        accentColorHex={
                                                            warbandColors[
                                                                state[opponent]
                                                                    .faction
                                                            ]
                                                        }
                                                        size={36}
                                                        side={x}
                                                        useBlackOutline={
                                                            state[opponent]
                                                                .faction ===
                                                            "zarbags-gitz"
                                                        }
                                                    />
                                                )}
                                                {i % 2 !== 0 && (
                                                    <AttackDie
                                                        accentColorHex={
                                                            warbandColors[
                                                                state[opponent]
                                                                    .faction
                                                            ]
                                                        }
                                                        size={36}
                                                        side={x}
                                                        useBlackOutline={
                                                            state[opponent]
                                                                .faction ===
                                                            "zarbags-gitz"
                                                        }
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                    </Grid>
                </Grid>
            </Grid>
            {data.waitingFor.length > 0 &&
                !data.waitingFor.includes(myself.uid) && (
                    <Typography>Waiting for the opponent</Typography>
                )}
            {data.waitingFor.includes(myself.uid) &&
                data.waitingReason === "INITIATIVE_ROLL" && (
                    <Grid container>
                        <Typography>Please roll the initiative.</Typography>
                        <Grid item xs={12} container justify="center">
                            <Button
                                onClick={handleInitiativeRoll}
                                variant="contained"
                                color="primary"
                            >
                                Roll
                            </Button>
                        </Grid>
                    </Grid>
                )}
            {data.waitingFor.includes(myself.uid) &&
                data.waitingReason === "SELECT_FIRST_BOARD_OR_PASS" && (
                    <Grid container>
                        <Typography>
                            You have won initiative roll and need to decide
                            whether to pick first or second board.
                        </Typography>
                        <Grid item xs={6}>
                            <Button onClick={handlePickBoardFirst}>
                                Pick Board First
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button onClick={handlePassFirstBoardSelection}>
                                Pick Board Second
                            </Button>
                        </Grid>
                    </Grid>
                )}
            {data.waitingFor.includes(myself.uid) &&
                data.waitingReason === "SELECT_FIRST_BOARD" && (
                    <Grid container>
                        <Typography>You need to pick first board.</Typography>
                        <Grid item xs={12}>
                            <Button onClick={handlePickBoardFirst}>
                                Pick my board
                            </Button>
                        </Grid>
                    </Grid>
                )}
            {data.waitingFor.includes(myself.uid) &&
                data.waitingReason === "SELECT_SECOND_BOARD" && (
                    <Grid container>
                        <Typography>
                            Your opponent has picked board:{" "}
                            {
                                boardsInfo[
                                    data[
                                        `${actors.find(
                                            a => a !== myself.uid
                                        )}_board`
                                    ]
                                ].name
                            }
                            .
                        </Typography>
                        <Grid item xs={12}>
                            <Button onClick={handlePickSecondBoard}>
                                Pick my board
                            </Button>
                        </Grid>
                    </Grid>
                )}
        </Grid>
    );
}

function Messenger({ roomId, state, messages }) {
    const classes = useStyles();
    const myself = useAuthUser();
    const containerRef = useRef(null);
    const firebase = useContext(FirebaseContext);
    const [showMainHUD, setShowMainHUD] = useState(null);
    const [mainHUDPayload, setMainHUDPayload] = useState(null);
    const [visibleMessages, setVisibleMessages] = useState(messages || []);
    const [sliceSize, setSliceSize] = useState(10);
    const [resizing, setResizing] = useState(true);
    const lastScrollHeight = React.useRef(1);

    const msgcontainerRef = useRef();

    useEffect(() => {
        if (!messages) return;
        setVisibleMessages(messages);
    }, [messages]);

    useLayoutEffect(() => {
        const {
            scrollHeight,
            scrollTop,
            offsetHeight,
        } = msgcontainerRef.current;
        if (
            scrollTop === 0 ||
            scrollHeight - scrollTop - offsetHeight < offsetHeight
        ) {
            const nextOffsetTop = scrollHeight - offsetHeight;
            msgcontainerRef.current.scrollTop = nextOffsetTop;
            lastScrollHeight.current = scrollHeight;
            setSliceSize(10);
        }
    }, [visibleMessages]);

    useLayoutEffect(() => {
        const { scrollHeight, scrollTop } = msgcontainerRef.current;
        msgcontainerRef.current.scrollTop = lastScrollHeight.current;
        console.log('useLayoutEffect', scrollHeight, scrollTop, lastScrollHeight.current);
    }, [sliceSize]);

    useEffect(() => {
        const { scrollHeight, scrollTop } = msgcontainerRef.current;

        console.log('useEffect', scrollHeight, scrollTop, lastScrollHeight.current);
    }, [sliceSize]);

    const handleShowHUDType = (type, payload) => {
        setShowMainHUD(type);
        setMainHUDPayload(payload);
    };

    // const handleScroll = e => {
    //     const { scrollHeight, scrollTop } = msgcontainerRef.current;
    //     console.log("UPDATE", scrollTop, scrollHeight, scrollTop / lastScrollHeight.current, '===', lastScrollHeight.current);
    //     if (sliceSize < visibleMessages.length && scrollTop / lastScrollHeight.current <= 0.25) {
    //         lastScrollHeight.current = scrollHeight;
    //         console.log("LOADING MOAR");
    //         setSliceSize(prev =>
    //             prev + 10 < visibleMessages.length ? prev + 10 : visibleMessages.length
    //         );
    //     }
    // };

    const handleLoadMore = () => {
        const { scrollHeight, scrollTop } = msgcontainerRef.current;
        // lastScrollHeight.current = scrollHeight;
        setSliceSize(prev =>
            prev + 10 < visibleMessages.length ? prev + 10 : visibleMessages.length
        );
    }

    return (
        <div id="msgroot" style={{ flex: 1, position: "relative" }}>
            <div
                ref={msgcontainerRef}
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    overflow: "auto",
                    marginBottom: "3rem",
                }}
                // onScroll={handleScroll}
            >
                <div
                    id="msgtotalheight"
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    {
                        sliceSize < visibleMessages.length && (
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem auto'}}>
                                <Button color="primary" variant="contained" onClick={handleLoadMore}>Load More...</Button>
                            </div>
                        )
                    }
                    {visibleMessages.slice(-sliceSize).map((m, i, arr) => {
                        if (m.type === "INTERACTIVE") {
                            return (
                                <InteractiveMessage
                                    state={state}
                                    key={m.id}
                                    roomId={roomId}
                                    data={m}
                                    isLastMessage={arr.length - 1 === i}
                                    timestamp={m.id}
                                    onShowHUD={handleShowHUDType}
                                />
                            );
                        }

                        if (
                            m.type === "INFO" &&
                            m.subtype &&
                            m.subtype.includes("CARD")
                        ) {
                            return (
                                <CardMessageItem
                                    key={m.id}
                                    timestamp={m.id}
                                    isLastMessage={arr.length - 1 === i}
                                    author={
                                        m.author === "Katophrane"
                                            ? m.author
                                            : Boolean(state[m.author])
                                            ? state[m.author].name
                                            : m.author
                                    }
                                    isMineMessage={m.author === myself.uid}
                                    cardId={m.cardId}
                                    value={m.value}
                                />
                            );
                        }

                        if (m.type === "CHAT" || m.type === "INFO") {
                            return (
                                <ChatMessageItem
                                    key={m.id}
                                    timestamp={m.id}
                                    isLastMessage={arr.length - 1 === i}
                                    author={
                                        m.author === "Katophrane"
                                            ? m.author
                                            : Boolean(state[m.author])
                                            ? state[m.author].name
                                            : m.author
                                    }
                                    isMineMessage={m.author === myself.uid}
                                    value={m.value}
                                />
                            );
                        }

                        if (m.type === "DICE_ROLL") {
                            return (
                                <DiceRollMessage
                                    key={m.created}
                                    timestamp={m.id}
                                    id={
                                        arr.length - 1 === i
                                            ? "lastMessage"
                                            : "message"
                                    }
                                    author={`${
                                        m.author === "Katophrane"
                                            ? m.author
                                            : Boolean(state[m.author])
                                            ? state[m.author].name
                                            : m.author
                                    }:`}
                                    authorFaction={state[m.author].faction}
                                    value={m.value}
                                    type={m.subtype}
                                />
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}

export default Messenger;
