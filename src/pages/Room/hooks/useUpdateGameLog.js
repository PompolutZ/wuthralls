import { useContext } from "react";
import { FirebaseContext } from "../../../firebase";
import { useRoomInfo } from "./gameStateHooks";

export function createAppliedUpgradePayload(cardId, message) {
    return {
        author: "Katophrane",
        type: "INFO",
        subtype: "APPLIED_UPGRADE_CARD",
        cardId: cardId,
        value: message,
    };
}

export function createPlayerDiscardsUpgradePayload(cardId, message) {
    return {
        author: "Katophrane",
        type: "INFO",
        subtype: "DISCARDS_UPGRADE_CARD",
        cardId: cardId,
        value: message,
    };
}

// this function is relying on another game specific hook, useRoomInfo
// passing roomId as a parameter might be more flexible though, but
// for now I have decided to save some keystrokes.
export default function useUpdateGameLog() {
    const roomId = useRoomInfo((room) => room.roomId);
    const firebase = useContext(FirebaseContext);

    return function sendLogEntry(message) {
        if (typeof message === "string") {
            firebase.addGenericMessage2(roomId, {
                author: "Katophrane",
                type: "INFO",
                value: message,
            });
        } else {
            firebase.addGenericMessage2(roomId, message);
        }
    };
}
