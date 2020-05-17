import React, { useEffect } from "react";
import { FirebaseContext } from "../../../firebase";
import PropTypes from "prop-types";

const MessagesContext = React.createContext();

function useMessages() {
    const context = React.useContext(MessagesContext);

    if (!context) {
        throw new Error(`useMessages should be used within MessagesProvider`);
    }

    return context;
}

function MessagesProvider(props) {
    const [messages, setMessages] = React.useState([]);
    const firebase = React.useContext(FirebaseContext);

    useEffect(() => {
        const unsubscribeFromMessages = firebase.fstore
            .collection("messages")
            .doc(props.roomId)
            .onSnapshot((s) => {
                if (!s.data()) return;
                const msgs = Object.entries(s.data()).map(([key, value]) => ({
                    ...value,
                    id: Number(key),
                }));

                setMessages(msgs);
            });

        return () => unsubscribeFromMessages();
    }, []);

    return <MessagesContext.Provider value={messages} {...props} />;
}

MessagesProvider.propTypes = {
    roomId: PropTypes.string,
};

export { MessagesProvider, useMessages };
