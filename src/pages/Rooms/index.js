import React, { useState, useEffect, useContext } from "react";
import { useAuthUser } from "../../components/Session";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { FirebaseContext } from "../../firebase";
import { useHistory } from "react-router-dom";
import { warbands } from "../../data";
import { SignInForm } from "../../components/SignInPage";

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function Rooms() {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const [rooms, setRooms] = useState(null);
    const [roomName, setRoomName] = useState("");
    const [myRooms, setMyRooms] = useState([]);
    const [otherRooms, setOtherRooms] = useState([]);
    const [quotaLimitReached, setQuotaLimitReached] = useState(false);

    useEffect(() => {
        if (!myself) return;

        firebase.fstore
            .collection("rooms")
            .where("players", "array-contains", myself.uid)
            .get()
            .then((snapshot) => {
                const rooms = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log(rooms);
                setMyRooms(rooms);
            })
            .catch((error) =>
                setQuotaLimitReached(error.message.includes("Quota"))
            );

        const unsub = firebase.fstore
            .collection("rooms")
            .where("status.waitingReason", "==", "WAITING_FOR_OPPONENT")
            .onSnapshot(
                (snapshot) => {
                    const rooms = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    console.log("other", rooms);
                    setOtherRooms(rooms);
                },
                (error) => setQuotaLimitReached(error.message.includes("Quota"))
            );

        return () => {
            if (unsub) {
                unsub();
            }
        };
    }, []);
    // useEffect(() => {
    //     if(!myself) return;

    //     const unsubscribe = firebase.setRoomsListener(snapshot => {
    //         console.log(snapshot);
    //         setRooms(snapshot.docs.map(doc => ({
    //             id: doc.id,
    //             ...doc.data()
    //         })));
    //     }, error => setQuotaLimitReached(error.message.includes("Quota")));

    //     return () => unsubscribe();
    // }, []);

    // useEffect(() => {
    //     if(!rooms) return;

    //     setMyRooms(rooms.filter(r => r.players.includes(myself.uid)));
    //     setOtherRooms(rooms.filter(r => !r.players.includes(myself.uid)));

    //     console.log(rooms);
    // }, [rooms])

    const handleTextChange = (name) => (event) => {
        setRoomName(event.target.value);
    };

    const handleAddNewRoom = async () => {
        history.push(`/${"v1"}/new/room`);
    };

    const handleGetInRoom = (room) => () => {
        history.push(`/v1/room/${room.id}`, room);
    };

    const handleDeleteRoom = (id) => async () => {
        await firebase.deleteRoom(id);
        setMyRooms(prev => prev.filter(r => r.id !== id));
        //setRooms((rooms) => rooms.filter((r) => r.id !== id));
    };

    const handleJoinRoom = (room) => () => {
        history.push(`/${"v1"}/room/${room.id}/prepare`, room);
    };

    const handleFinishAndRecord = (room) => () => {
        console.log(room);
        if (room.status.round >= 3) {
            firebase.recordGameResult(room.id, room);
        }
    };

    const handleCheckPlayerInfo = (pid) => () => {
        history.push(`/player-info`, { pid: pid });
    };

    if (quotaLimitReached) {
        return (
            <div
                style={{
                    margin: "1rem",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                }}
            >
                <div style={{ margin: "auto", padding: "3vmin" }}>
                    <Typography color="primary" style={{ fontSize: "3vmax" }}>
                        Sorry, but we have reached database reading free quota
                        for today. Games could be resumed tomorrow.
                    </Typography>
                </div>
            </div>
        );
    }

    return myself ? (
        <div style={{ margin: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddNewRoom}
                    style={{ flex: "1" }}
                    disabled={!myself || myRooms.length > 0}
                >
                    Spawn New Room
                </Button>
            </div>
            {
                myRooms && myRooms.length > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", margin: '1rem auto' }}>
                        <Typography variant="body2" color="primary">Note, you won't be able to spawn rooms or join other rooms if you already have a room.</Typography>
                    </div>
                )
            }
            <Grid container spacing={3} justify="center">
                <Grid item xs={12} lg={4}>
                    <Typography variant="h6">My rooms</Typography>
                    <Divider style={{ marginBottom: "1rem" }} />
                    {myRooms.map((r) => {
                        const participants = r.players.map((pid) => ({
                            ...r[pid],
                            pid: pid,
                        }));
                        return (
                            <Paper
                                key={r.id}
                                style={{
                                    marginBottom: "1rem",
                                    padding: ".5rem",
                                }}
                            >
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="h6"
                                            style={{ marginTop: "1rem" }}
                                        >
                                            {r.name}
                                        </Typography>
                                        <Grid
                                            container
                                            alignItems="center"
                                            style={{ margin: "1rem auto" }}
                                        >
                                            <Grid item xs={4}>
                                                <Grid
                                                    container
                                                    direction="column"
                                                    alignItems="center"
                                                >
                                                    <img
                                                        src={`/assets/factions/${participants[0].faction}-icon.png`}
                                                        style={{
                                                            width: "2rem",
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body1"
                                                        style={{
                                                            cursor: "pointer",
                                                            textDecoration:
                                                                "underline",
                                                        }}
                                                        onClick={handleCheckPlayerInfo(
                                                            participants[0].pid
                                                        )}
                                                    >
                                                        {participants[0].name}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={4}
                                                container
                                                justify="center"
                                            >
                                                <Typography variant="h5">{`VS`}</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                {participants.length === 1 && (
                                                    <Grid
                                                        container
                                                        direction="column"
                                                        alignItems="center"
                                                    >
                                                        <Typography variant="body1">{`Awating opponent...`}</Typography>
                                                    </Grid>
                                                )}
                                                {participants.length > 1 && (
                                                    <Grid
                                                        container
                                                        direction="column"
                                                        alignItems="center"
                                                    >
                                                        <img
                                                            src={`/assets/factions/${
                                                                participants[1]
                                                                    ? participants[1]
                                                                          .faction
                                                                    : ""
                                                            }-icon.png`}
                                                            style={{
                                                                width: "2rem",
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="body1"
                                                            style={{
                                                                cursor:
                                                                    "pointer",
                                                                textDecoration:
                                                                    "underline",
                                                            }}
                                                            onClick={handleCheckPlayerInfo(
                                                                participants[1]
                                                                    .pid
                                                            )}
                                                        >
                                                            {participants[1]
                                                                ? participants[1]
                                                                      .name
                                                                : ""}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            onClick={handleGetInRoom(r)}
                                            variant="contained"
                                            color="primary"
                                            disabled={r.players.length < 2}
                                        >
                                            Get In
                                        </Button>
                                        {(r.players.includes(myself.uid) ||
                                            (myself.roles &&
                                                myself.roles["ADMIN"])) && (
                                            <Button
                                                style={{
                                                    color: "red",
                                                    margin: "auto .5rem",
                                                }}
                                                onClick={handleDeleteRoom(r.id)}
                                                variant="outlined"
                                            >
                                                Delete
                                            </Button>
                                        )}
                                        <Button
                                            onClick={handleFinishAndRecord(r)}
                                            variant="outlined"
                                            color="secondary"
                                            disabled={r.status.round < 3}
                                        >
                                            Finish
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        );
                    })}
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Typography variant="h6">Rooms looking for an opponent</Typography>
                    <Divider />
                    {otherRooms.filter(r => !myRooms.map(myroom => myroom.id).includes(r.id)).map((r, i) => {
                        const participants = r.players.map((pid) => ({
                            ...r[pid],
                            pid: pid,
                        }));

                        return (
                            <Paper
                                key={r.id}
                                style={{
                                    marginBottom: "1rem",
                                    padding: ".5rem",
                                }}
                            >
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="h6"
                                            style={{ marginTop: "1rem" }}
                                        >
                                            {r.name}
                                        </Typography>
                                        <Grid
                                            container
                                            alignItems="center"
                                            style={{ margin: "1rem auto" }}
                                        >
                                            <Grid item xs={4}>
                                                <Grid
                                                    container
                                                    direction="column"
                                                    alignItems="center"
                                                >
                                                    <img
                                                        src={`/assets/factions/${participants[0].faction}-icon.png`}
                                                        style={{
                                                            width: "2rem",
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body1"
                                                        style={{
                                                            cursor: "pointer",
                                                            textDecoration:
                                                                "underline",
                                                        }}
                                                        onClick={handleCheckPlayerInfo(
                                                            participants[0].pid
                                                        )}
                                                    >
                                                        {participants[0].name}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={4}
                                                container
                                                justify="center"
                                            >
                                                <Typography variant="h5">{`VS`}</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                {participants.length === 1 && (
                                                    <Grid
                                                        container
                                                        direction="column"
                                                        alignItems="center"
                                                    >
                                                        <Typography variant="body1">{`Awating opponent...`}</Typography>
                                                    </Grid>
                                                )}
                                                {participants.length > 1 && (
                                                    <Grid
                                                        container
                                                        direction="column"
                                                        alignItems="center"
                                                    >
                                                        <img
                                                            src={`/assets/factions/${participants[1].faction}-icon.png`}
                                                            style={{
                                                                width: "2rem",
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="body1"
                                                            style={{
                                                                cursor:
                                                                    "pointer",
                                                                textDecoration:
                                                                    "underline",
                                                            }}
                                                            onClick={handleCheckPlayerInfo(
                                                                participants[1]
                                                                    .pid
                                                            )}
                                                        >
                                                            {
                                                                participants[1]
                                                                    .name
                                                            }
                                                        </Typography>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            onClick={handleJoinRoom(r)}
                                            disabled={!(r.players.length < 2) || myRooms.length > 1}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Join
                                        </Button>
                                        {myself.roles && myself.roles["ADMIN"] && (
                                            <Button
                                                style={{ color: "red" }}
                                                onClick={handleDeleteRoom(r.id)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </Paper>
                        );
                    })}
                </Grid>
            </Grid>
        </div>
    ) : (
        <div style={{ margin: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    src={`/wuc-pwa-192.png`}
                    style={{
                        width: "3rem",
                        boxSizing: "border-box",
                        borderRadius: "1.5rem",
                    }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                        variant="h5"
                        style={{ flex: 1, marginLeft: "1rem" }}
                    >
                        WUnderworlds Club
                    </Typography>
                    <Typography
                        variant="body2"
                        style={{ flex: 1, marginLeft: "1rem" }}
                    >
                        <i>Speak, friend, and enter.</i>
                    </Typography>
                </div>
            </div>
            <SignInForm />
        </div>
    );
}

export default Rooms;
