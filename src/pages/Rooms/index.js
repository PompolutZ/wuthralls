import React, { useState, useEffect, useContext } from 'react';
import { useAuthUser } from '../../components/Session';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { FirebaseContext } from '../../firebase';
import { useHistory } from 'react-router-dom';

function Rooms() {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const [rooms, setRooms] = useState(null);
    const [roomName, setRoomName] = useState('');
    const [myRooms, setMyRooms] = useState([]);
    const [otherRooms, setOtherRooms] = useState([]);

    useEffect(() => {
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
        if(!myself) {
            history.push('/signin');
            return;
        }
        console.log(rooms)
        setMyRooms(rooms.filter(r => r.players.includes(myself.uid)));
        setOtherRooms(rooms.filter(r => !r.players.includes(myself.uid)));
    }, [rooms])

    const handleTextChange = name => event => {
        setRoomName(event.target.value)
    }  

    const handleAddNewRoom = async () => {
        const payload = {
            name: roomName,
            createdBy: myself.uid,
            players: [myself.uid],
            [myself.uid]: {
                name: myself.username
            }
        };

        await firebase.addRoom(payload);
    }

    const handleGetInRoom = room => () => {
        history.push(`/v1/room/${room.id}`, room);
    }

    const handleDeleteRoom = id => async () => {
        await firebase.deleteRoom(id);
        setRooms(rooms => rooms.filter(r => r.id !== id));
    }

    const handleJoinRoom = room => async () => {
        const playerInfo = {
            name: myself.username,
        };

        await firebase.addPlayerToRoom(room.id, myself.uid, playerInfo);
    }

    return (
        <div>
            <div style={{ display: 'flex', margin: 'auto 1rem' }}>
                <TextField style={{ flex: '1' }} autoFocus
                margin="dense"
                id="roomName"
                label="Room name"
                value={roomName}
                onChange={handleTextChange('roomName')}
                type="text"
                fullWidth
                inputProps={{ maxLength: 100 }}/>
                <Button variant="contained" color="primary" onClick={handleAddNewRoom} disabled={!roomName}>
                    <AddIcon />
                </Button>
            </div>
            {
                !rooms && (
                    <Typography>No rooms available at the moment. Why don't you make one?</Typography>
                )
            }
            {
                rooms && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6">My rooms</Typography>
                            <Divider />
                            {
                                myRooms.map(r => (
                                    <Grid container key={r.id}>
                                        <Grid item xs={12}>
                                            <Typography>{r.name}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button onClick={handleGetInRoom(r)}>Get In</Button>
                                            {
                                                r.createdBy === myself.uid && (
                                                    <Button style={{ color: 'red' }} onClick={handleDeleteRoom(r.id)}>Delete</Button>
                                                )
                                            }
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Other rooms</Typography>
                            <Divider />
                            {
                                otherRooms.map((r, i) => (
                                    <Grid container key={r.id}>
                                        <Grid item xs={12}>
                                            <Typography>{r.name}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button onClick={handleJoinRoom(r)}>Join</Button>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>
                )
            }
        </div>
    )
}

export default Rooms;