import { useContext } from "react";
import { FirebaseContext } from "../../../firebase";

export default function useUpdateGameLog(roomId) {
    const firebase = useContext(FirebaseContext);

    return function sendLogEntry(message) {
        firebase.addGenericMessage2(roomId, {
            author: "Katophrane",
            type: "INFO",
            value: message,
        });
    };
}
