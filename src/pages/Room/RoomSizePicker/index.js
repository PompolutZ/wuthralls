import React, { useState, useEffect, useContext } from "react";
import PhoneRoom from "../Phone";
import { useLocation } from "react-router-dom";
import InitiativeAndBoardsSetup from "./InitiativeAndBoardsSetup";
import { FirebaseContext } from "../../../firebase";
import { MessagesProvider } from "../contexts/messagesContext";
import create from "zustand";
import { useAuthUser } from "../../../components/Session";
import { useMyGameState, useTheirGameState } from "../hooks/playerStateHooks";
import {
    useFightersInfo,
    useGameRound,
    useRoomInfo,
} from "../hooks/gameStateHooks";

// activationsLeft
// faction
// gloryScored
// glorySpent
// name
// oDeck
// pDeck

// Maybe better to write this to take more usage from the react-router-dom?..
export default function RoomSizePicker() {
    const [loaded, setLoaded] = useState(false);
    const { state } = useLocation();
    const [data, setData] = useState(state);
    const firebase = useContext(FirebaseContext);
    const myself = useAuthUser();

    useEffect(() => {
        useRoomInfo.setState({
            roomId: state.id,
            players: state.players,
            withPrimacy: !!state.status.primacy,
        });
    }, [state]);

    useEffect(() => {
        setLoaded(false);
        const unsubscribe = firebase.setRoomListener(state.id, (snapshot) => {
            if (snapshot.exists) {
                console.log("RoomSizePicker - Updated from server");
                const serverData = snapshot.data();
                const [opponent] = serverData.players.filter(
                    (p) => p !== myself.uid
                );

                useMyGameState.setState({
                    ...serverData[myself.uid],
                    hasPrimacy:
                        serverData.status.primacy &&
                        serverData.status.primacy[myself.uid],
                    id: myself.uid,
                });
                useTheirGameState.setState({
                    ...serverData[opponent],
                    hasPrimacy:
                        serverData.status.primacy &&
                        serverData.status.primacy[opponent],
                    id: opponent,
                });
                useGameRound.setState({ round: serverData.status.round });

                useFightersInfo.setState({
                    ...serverData.board.fighters,
                });

                setData({ ...serverData, id: snapshot.id });
                setLoaded(true);
            }
        });

        return () => {
            console.log("Unsubscribe");
            unsubscribe();
        };
    }, [firebase, state.id, myself.uid]);

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
