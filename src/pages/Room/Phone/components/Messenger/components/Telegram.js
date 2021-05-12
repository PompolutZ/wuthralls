import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import PropTypes from "prop-types";
import { useAddCurrentPlayerMessage } from "../../../../hooks/useUpdateGameLog";
import { makeStyles, fade } from "@material-ui/core/styles";
import { useTheirGameState } from "../../../../hooks/playerStateHooks";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        padding: "1rem .5rem",
    },

    message: {
        flex: 1,
    },

    sendButton: () => ({
        color: "rgba(255,255,255, .9)",
    }),
}));

const useStylesInput = makeStyles((theme) => ({
    root: {
        overflow: "hidden",
        borderRadius: ".5rem",
        backgroundColor: "#363a3e",
        color: "#b8bbbe",
        padding: ".5rem .75rem",
        "&:hover": {
            backgroundColor: "#363a3e",
        },
        "&$focused": {
            backgroundColor: "#363a3e",
            boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
        },
    },
}));

function Telegram() {
    const classes = useStyles();
    const opponentsName = useTheirGameState((state) => state.name);
    const inputClasses = useStylesInput();
    const sendMessage = useAddCurrentPlayerMessage();
    const [currentMessage, setCurrentMessage] = useState("");

    const handleTyping = (e) => {
        setCurrentMessage(e.target.value);
    };

    const handleSendTextMessage = async () => {
        sendMessageAndClearInput();
    };

    const handleKeyUp = (e) => {
        if (e.key !== "Enter") return;

        sendMessageAndClearInput();
    };

    const sendMessageAndClearInput = () => {
        if (currentMessage.length <= 0) return;

        const copy = currentMessage;
        setCurrentMessage("");
        sendMessage(copy);
    };

    return (
        <div className={classes.root}>
            <TextField
                onKeyUp={handleKeyUp}
                className={classes.message}
                multiline
                placeholder={`Message ${opponentsName}`}
                value={currentMessage}
                onChange={handleTyping}
                InputProps={{
                    classes: inputClasses,
                    disableUnderline: true,
                }}
            />
            <Button
                disabled={currentMessage.length === 0}
                className={classes.sendButton}
                onClick={handleSendTextMessage}
            >
                <SendIcon />
            </Button>
        </div>
    );
}

Telegram.propTypes = {
    roomId: PropTypes.string,
};

export default Telegram;
