import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useMessages } from "../../contexts/messagesContext";
import PropTypes from "prop-types";
import CardMessageItem from "./CardMessage";
import ChatMessageItem from "./ChatMessage";
import DiceRollMessage from "./DiceRollMessage";
import { useAuthUser } from "../../../../components/Session";

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

function Messenger({ state }) {
    const messages = useMessages();
    const myself = useAuthUser();
    const [visibleMessages, setVisibleMessages] = useState(messages || []);
    const [sliceSize, setSliceSize] = useState(10);
    const lastScrollHeight = React.useRef(1);

    const msgcontainerRef = useRef();

    useEffect(() => {
        if (!messages) return;
        setVisibleMessages(messages.sort((prev, next) => prev.id - next.id));
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
