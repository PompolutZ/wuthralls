import React, { useState, useContext } from "react";
import { useAuthUser } from "../../../components/Session";
import { FirebaseContext } from "../../../firebase";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import PropTypes from "prop-types";

function SendMessageAction({ roomId }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [currentMessage, setCurrentMessage] = useState("");

    const handleTyping = (e) => {
        setCurrentMessage(e.target.value);
    };

    const handleSendTextMessage = async () => {
        if (currentMessage.length <= 0) return;

        const copy = currentMessage;
        setCurrentMessage("");
        await firebase.addMessage2(roomId, {
            uid: myself.uid,
            value: copy,
        });
    };

    return (
        <div
            style={{
                flexGrow: 1,
                display: "flex",
                alignSelf: "flex-end",
                alignItems: "flex-end",
            }}
        >
            <TextField
                multiline
                placeholder="type here what you want to say..."
                style={{ flex: 1, margin: "2rem 1rem 3rem 1rem" }}
                value={currentMessage}
                onChange={handleTyping}
                rowsMax={3}
            />
            <Button
                onClick={handleSendTextMessage}
                style={{ margin: "0 0 3rem 0" }}
            >
                <SendIcon />
            </Button>
        </div>
    );
}

SendMessageAction.propTypes = {
    roomId: PropTypes.string,
};

export default SendMessageAction;
