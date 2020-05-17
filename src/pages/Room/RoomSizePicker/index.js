import React, { useState, useEffect, useContext } from "react";
import PhoneRoom from "../Phone";
import { useLocation } from "react-router-dom";
import InitiativeAndBoardsSetup from "./InitiativeAndBoardsSetup";
import { FirebaseContext } from "../../../firebase";
import { MessagesProvider } from "../contexts/messagesContext";

export default function RoomSizePicker() {
    const [loaded, setLoaded] = useState(false);
    const { state } = useLocation();
    const [data, setData] = useState(state);
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        const unsubscribe = firebase.setRoomListener(state.id, (snapshot) => {
            if (snapshot.exists) {
                setData({ ...snapshot.data(), id: snapshot.id });
            }
        });

        // const unsubscribeFromMessages = firebase.fstore.collection('messages').doc(state.id).onSnapshot(s => {
        //     if(!s.data()) return;
        //     const msgs = Object.entries(s.data()).map(([key, value]) => ({...value, id: Number(key) }));
        //     console.log('MESSAGES', msgs);
        //     setMessages(msgs);
        // });

        setLoaded(true);

        return () => {
            unsubscribe();
            // unsubscribeFromMessages();
        };
    }, []);

    if (!loaded) return <span>Loading...</span>;

    if (data.status.stage === "SETUP") {
        return <InitiativeAndBoardsSetup data={data} />;
    } else {
        return (
            <MessagesProvider roomId={state.id}>
                <PhoneRoom />
            </MessagesProvider>
        );
        // if(isLg) {
        //     console.log('DESKTOP ROOM');
        //     return <DesktopRoom />
        // } else {
        //     console.log('PHONE ROOM');

        // }
    }
}
