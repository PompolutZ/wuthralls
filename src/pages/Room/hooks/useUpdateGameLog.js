import { useContext } from "react";
import { useAuthUser } from "../../../components/Session";
import { FirebaseContext } from "../../../firebase";
import { useRoomInfo } from "./gameStateHooks";

const KatophraneInfo = {
    author: "Katophrane",
    type: "INFO",
};

export function createAppliedUpgradePayload(cardId, message) {
    return {
        ...KatophraneInfo,
        subtype: "APPLIED_UPGRADE_CARD",
        value: message,
        cardId,
    };
}

export function createPlayerDiscardsUpgradePayload(cardId, message) {
    return {
        ...KatophraneInfo,
        subtype: "DISCARDS_UPGRADE_CARD",
        value: message,
        cardId,
    };
}

export function createPlayerScoredObjectiveCardPayload(cardId, message) {
    return {
        ...KatophraneInfo,
        subtype: "SCORED_OBJECTIVE_CARD",
        value: message,
        cardId,
    };
}

export function createPlayerPlayedPowerCardPayload(cardId, message) {
    return {
        ...KatophraneInfo,
        subtype: "PLAYED_POWER_CARD",
        value: message,
        cardId,
    };
}

export function createPlayerDiscardedObjectiveCardPayload(cardId, message) {
    return {
        ...KatophraneInfo,
        subtype: "DISCARDED_OBJECTIVE_CARD",
        value: message,
        cardId,
    };
}

export function createPlayerDiscardedPowerCardPayload(cardId, message) {
    return {
        ...KatophraneInfo,
        subtype: "DISCARDED_POWER_CARD",
        value: message,
        cardId,
    };
}

export function useAddCurrentPlayerMessage() {
    const roomId = useRoomInfo((room) => room.roomId);
    const firebase = useContext(FirebaseContext);
    const { uid } = useAuthUser();

    return function sendLogEntry(message) {
        firebase.addMessage2(roomId, {
            uid,
            value: message,
        });
    };
}

export function useDiceRoll() {
    const roomId = useRoomInfo((room) => room.roomId);
    const firebase = useContext(FirebaseContext);
    const { uid } = useAuthUser();

    return function sendRollResult(rollType, values) {
        firebase.addDiceRoll2(roomId, {
            uid,
            type: rollType,
            value: values.join(),
        });
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
