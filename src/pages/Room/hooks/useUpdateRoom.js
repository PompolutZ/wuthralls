import { useContext } from "react";
import { FirebaseContext } from "../../../firebase";
import { useRoomInfo } from "./gameStateHooks";

// this function is relying on another game specific hook, useRoomInfo
// passing roomId as a parameter might be more flexible though, but
// for now I have decided to save some keystrokes.
export default function useUpdateRoom() {
    const roomId = useRoomInfo((room) => room.roomId);
    const firebase = useContext(FirebaseContext);

    return function (payload) {
        firebase.updateRoom(roomId, payload);
    };
}
