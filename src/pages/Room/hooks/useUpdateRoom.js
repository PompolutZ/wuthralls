import { useContext } from "react";
import { FirebaseContext } from "../../../firebase";

export default function useUpdateRoom(roomId) {
    const firebase = useContext(FirebaseContext);

    return function (payload) {
        firebase.updateRoom(roomId, payload);
    };
}
