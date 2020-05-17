import React, { useState, useEffect, useContext } from "react";
import { withAuthorization } from "./Session";
import * as ROLES from "../constants/roles";
import { FirebaseContext } from "../firebase";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

function AdminPage() {
    const firebase = useContext(FirebaseContext);
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        firebase.fstore
            .collection("rooms")
            .get()
            .then((snapshot) => {
                return snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
            })
            .then((rooms) => {
                return Promise.all(
                    rooms.map(async (r) => {
                        const msgsSnap = await firebase.fstore
                            .collection("messages")
                            .doc(r.id)
                            .get();
                        return {
                            ...r,
                            msgs: msgsSnap.data(),
                        };
                    })
                );
            })
            .then((rooms) =>
                rooms.map((r) => {
                    const { msgs } = r;
                    const timestamps = Object.keys(msgs);

                    return {
                        ...r,
                        created: new Date(+timestamps[0]),
                        lastUpdate: new Date(
                            +timestamps[timestamps.length - 1]
                        ),
                    };
                })
            )
            .then((rooms) => {
                setRooms(rooms.sort((r1, r2) => r1.lastUpdate - r2.lastUpdate));
            })
            .catch((error) => setError(error.message));
    }, []);

    const handleDelete = (id) => async () => {
        await firebase.deleteRoom(id);
        setRooms((rooms) => rooms.filter((r) => r.id !== id));
    };

    return (
        <div>
            <h1>Admin</h1>
            {error && <Typography>{error}</Typography>}

            {rooms.map((r) => (
                <div key={r.id} style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex" }}>
                        <div
                            style={{
                                borderRight: "1px solid gray",
                                padding: "0 .5rem",
                                fontWeight: "700",
                            }}
                        >
                            {r.name}
                        </div>
                        <div
                            style={{
                                borderRight: "1px solid gray",
                                padding: "0 .5rem",
                                color: "lightgray",
                            }}
                        >
                            {r.created.toLocaleDateString()}
                        </div>
                        <div
                            style={{
                                borderRight: "1px solid gray",
                                padding: "0 .5rem",
                                color: "lightgray",
                            }}
                        >
                            {r.lastUpdate.toLocaleDateString()}
                        </div>
                        <div
                            style={{
                                borderRight: "1px solid gray",
                                padding: "0 .5rem",
                                color: "red",
                            }}
                        >
                            {(new Date() - r.lastUpdate) /
                                (1000 * 60 * 60 * 24)}
                        </div>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDelete(r.id)}
                    >
                        Delete
                    </Button>
                </div>
            ))}
        </div>
    );
}

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default withAuthorization(condition)(AdminPage);
