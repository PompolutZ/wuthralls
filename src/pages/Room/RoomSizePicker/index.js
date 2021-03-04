import React, { useState, useEffect, useContext } from "react";
import PhoneRoom from "../Phone";
import { useLocation } from "react-router-dom";
import InitiativeAndBoardsSetup from "./InitiativeAndBoardsSetup";
import { FirebaseContext } from "../../../firebase";
import { MessagesProvider } from "../contexts/messagesContext";
import create from "zustand";
import { useAuthUser } from "../../../components/Session";

export const useMyState = create(() => ({
    data: {},
}));

// Maybe better to write this to take more usage from the react-router-dom?..
export default function RoomSizePicker() {
    const [loaded, setLoaded] = useState(false);
    const { state } = useLocation();
    const [data, setData] = useState(state);
    const firebase = useContext(FirebaseContext);
    const myself = useAuthUser();

    useEffect(() => {
        setLoaded(false);
        const unsubscribe = firebase.setRoomListener(state.id, (snapshot) => {
            if (snapshot.exists) {
                console.log("RoomSizePicker - Updated from server");
                const serverData = snapshot.data();
                useMyState.setState({ data: serverData[myself.uid] });
                setData({ ...serverData, id: snapshot.id });
                setLoaded(true);
            }
        });

        return () => {
            console.log("Unsubscribe");
            unsubscribe();
        };
    }, [firebase, state.id]);

    if (!loaded)
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: "#36393F",
                    color: "whitesmoke",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                Loading...
            </div>
        );

    if (data.status.stage === "SETUP") {
        return <InitiativeAndBoardsSetup data={data} />;
    } else {
        return (
            <MessagesProvider roomId={state.id}>
                <PhoneRoom data={data} />
            </MessagesProvider>
        );
    }
}
