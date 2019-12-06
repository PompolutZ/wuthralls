import React, { useState, useEffect, useContext } from 'react';
import { useAuthUser } from '../../components/Session';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { FirebaseContext } from '../../firebase';
import { useHistory } from 'react-router-dom';
import { warbands } from '../../data';


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
    const [roomName, setRoomName] = useState('');
    const [myRooms, setMyRooms] = useState([]);
    const [otherRooms, setOtherRooms] = useState([]);

    useEffect(() => {
        if(!myself) return;

        const unsubscribe = firebase.setRoomsListener(snapshot => {
            setRooms(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })));
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if(!rooms) return;

        setMyRooms(rooms.filter(r => r.players.includes(myself.uid)));
        setOtherRooms(rooms.filter(r => !r.players.includes(myself.uid)));

        console.log(rooms);
    }, [rooms])

    const handleTextChange = name => event => {
        setRoomName(event.target.value)
    }  

    const handleAddNewRoom = async () => {
        history.push(`/${'v1'}/new/room`);
    }

    const handleGetInRoom = room => () => {
        history.push(`/v1/room/${room.id}`, room);
    }

    const handleDeleteRoom = id => async () => {
        await firebase.deleteRoom(id);
        setRooms(rooms => rooms.filter(r => r.id !== id));
    }

    const handleJoinRoom = room => () => {
        history.push(`/${'v1'}/room/${room.id}/prepare`, room);
    }

    const handleFinishAndRecord = room => () => {
        console.log(room);
        if(room.status.round >= 3) {
            firebase.recordGameResult(room.id, room);
        }
    }

    return myself ? (
        <div style={{ margin: '1rem' }}>
            <div style={{ display: 'flex', }}>
                {/* <TextField style={{ flex: '1' }}
                margin="dense"
                id="roomName"
                label="Room name"
                value={roomName}
                onChange={handleTextChange('roomName')}
                type="text"
                fullWidth
                inputProps={{ maxLength: 100 }}/> */}
                <Button variant="contained" color="primary" onClick={handleAddNewRoom} style={{ flex: '1' }} disabled={!myself}>
                    Spawn New Room
                </Button>
            </div>
            {
                !rooms && (
                    <Typography>No rooms available at the moment. Why don't you make one?</Typography>
                )
            }
            <br />
            {
                rooms && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6">My rooms</Typography>
                            <Divider style={{ marginBottom: '1rem' }} />
                            {
                                myRooms.map(r => {
                                    const participants = r.players.map(pid => r[pid]);

                                    return (
                                        <Paper key={r.id} style={{ marginBottom: '1rem', padding: '.5rem' }}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" style={{ marginTop: '1rem'}}>{r.name}</Typography>
                                                    <Grid container alignItems="center" style={{ margin: '1rem auto'}}>
                                                        <Grid item xs={4}>
                                                            <Grid container direction="column" alignItems="center">
                                                                <img src={`/assets/factions/${participants[0].faction}-icon.png`} style={{ width: '2rem' }} />
                                                                <Typography variant="body1">{participants[0].name}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={4} container justify="center">
                                                            <Typography variant="h5">{`VS`}</Typography>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            {
                                                                participants.length === 1 && (
                                                                    <Grid container direction="column" alignItems="center">
                                                                        <Typography variant="body1">{`Awating opponent...`}</Typography>
                                                                    </Grid>
                                                                )
                                                            }
                                                            {
                                                                participants.length > 1 && (
                                                                    <Grid container direction="column" alignItems="center">
                                                                        <img src={`/assets/factions/${participants[1].faction}-icon.png`} style={{ width: '2rem' }} />
                                                                        <Typography variant="body1">{participants[1].name}</Typography>
                                                                    </Grid>
                                                                )
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button onClick={handleGetInRoom(r)} variant="contained" color="primary">Get In</Button>
                                                    {
                                                        (r.createdBy === myself.uid || (myself.roles && myself.roles['ADMIN'])) && (
                                                            <Button style={{ color: 'red', margin: 'auto .5rem' }} onClick={handleDeleteRoom(r.id)} variant="outlined">Delete</Button>
                                                        )
                                                    }
                                                    <Button onClick={handleFinishAndRecord(r)} variant="outlined" color="secondary" disabled={r.status.round < 3}>Finish</Button>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    )
                                })
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Other rooms</Typography>
                            <Divider />
                            {
                                otherRooms.map((r, i) => {
                                    const participants = r.players.map(pid => r[pid]);

                                    return (
                                        <Paper key={r.id} style={{ marginBottom: '1rem', padding: '.5rem' }}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" style={{ marginTop: '1rem'}}>{r.name}</Typography>
                                                    <Grid container alignItems="center" style={{ margin: '1rem auto'}}>
                                                        <Grid item xs={4}>
                                                            <Grid container direction="column" alignItems="center">
                                                                <img src={`/assets/factions/${participants[0].faction}-icon.png`} style={{ width: '2rem' }} />
                                                                <Typography variant="body1">{participants[0].name}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={4} container justify="center">
                                                            <Typography variant="h5">{`VS`}</Typography>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            {
                                                                participants.length === 1 && (
                                                                    <Grid container direction="column" alignItems="center">
                                                                        <Typography variant="body1">{`Awating opponent...`}</Typography>
                                                                    </Grid>
                                                                )
                                                            }
                                                            {
                                                                participants.length > 1 && (
                                                                    <Grid container direction="column" alignItems="center">
                                                                        <img src={`/assets/factions/${participants[1].faction}-icon.png`} style={{ width: '2rem' }} />
                                                                        <Typography variant="body1">{participants[1].name}</Typography>
                                                                    </Grid>
                                                                )
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button onClick={handleJoinRoom(r)} disabled={!(r.players.length < 2)} variant="contained" color="primary">Join</Button>
                                                    {
                                                        myself.roles && myself.roles['ADMIN'] && (
                                                            <Button style={{ color: 'red' }} onClick={handleDeleteRoom(r.id)}>Delete</Button>
                                                        )
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                )
            }
        </div>
    ) : (
        <div style={{ margin: '1rem' }}>
            <Typography>Sign in to create rooms</Typography>
        </div>
    )
}

export default Rooms;