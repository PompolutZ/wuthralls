import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthUser } from "../../../components/Session";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Markdown from "react-markdown";
import AttackDie from "../../../components/AttackDie";
import DefenceDie from "../../../components/DefenceDie";
import MagicDie from "../../../components/MagicDie";
import { warbandColors } from "../../../data";
import { useMessages } from "../contexts/messagesContext";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
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
    ({ author, value, type, timestamp, authorFaction }) => {
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
                >{`${
                    created &&
                    created.toLocaleString("en-US", {
                        hour12: false,
                    })
                }`}</Typography>
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
                                    side={Number(x)}
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
                                    side={Number(x)}
                                    useBlackOutline={
                                        authorFaction === "zarbags-gitz"
                                    }
                                />
                            )}
                            {type === "MAGIC" && (
                                <MagicDie size={36} side={Number(x)} />
                            )}
                            {type === "INITIATIVE" && i % 2 === 0 && (
                                <DefenceDie
                                    accentColorHex={
                                        warbandColors[authorFaction]
                                    }
                                    size={36}
                                    side={Number(x)}
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
                                    side={Number(x)}
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

DiceRollMessage.displayName = "DiceRollMessage";
DiceRollMessage.propTypes = {
    author: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    timestamp: PropTypes.number,
    authorFaction: PropTypes.string,
};

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const CardMessageItem = React.memo(
    ({ author, isMineMessage, cardId, value, timestamp }) => {
        const classes = useStyles();
        const [highlight, setHighlight] = useState(false);
        const [created, setCreated] = useState(null);

        useEffect(() => {
            const date = new Date();
            date.setTime(timestamp);
            setCreated(date);
        }, []);

        const handleSwitchHighglight = () => {
            setHighlight((prev) => !prev);
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
                    >{`${
                        created &&
                        created.toLocaleString("en-US", {
                            hour12: false,
                        })
                    }`}</Typography>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ color: "white", flex: 1 }}>
                        <Markdown source={value} />
                    </div>
                    <Button
                        style={{ flex: "0 0 auto", color: "ghostwhite" }}
                        onClick={handleSwitchHighglight}
                    >
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

CardMessageItem.displayName = "CardMessageItem";
CardMessageItem.propTypes = {
    author: PropTypes.string,
    isMineMessage: PropTypes.bool,
    cardId: PropTypes.string,
    value: PropTypes.string,
    timestamp: PropTypes.number,
};

const ChatMessageItem = React.memo(
    ({ author, isMineMessage, value, timestamp }) => {
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
                    >{`${
                        created &&
                        created.toLocaleString("en-US", {
                            hour12: false,
                        })
                    }`}</Typography>
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

ChatMessageItem.displayName = "ChatMessageItem";
ChatMessageItem.propTypes = {
    author: PropTypes.string,
    isMineMessage: PropTypes.bool,
    value: PropTypes.string,
    timestamp: PropTypes.number,
};

function Messenger({ state }) {
    const messages = useMessages();
    const myself = useAuthUser();
    const [visibleMessages, setVisibleMessages] = useState(messages || []);
    const [sliceSize, setSliceSize] = useState(10);
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
        msgcontainerRef.current.scrollTop = lastScrollHeight.current;
    }, [sliceSize]);

    const handleLoadMore = () => {
        // lastScrollHeight.current = scrollHeight;
        setSliceSize((prev) =>
            prev + 10 < visibleMessages.length
                ? prev + 10
                : visibleMessages.length
        );
    };

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
                    {sliceSize < visibleMessages.length && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                margin: "1rem auto",
                            }}
                        >
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleLoadMore}
                            >
                                Load More...
                            </Button>
                        </div>
                    )}
                    {visibleMessages.slice(-sliceSize).map((m, i, arr) => {
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
                                            : state[m.author]
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
                                            : state[m.author]
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
                                            : state[m.author]
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

Messenger.propTypes = {
    state: PropTypes.object,
};

export default Messenger;
