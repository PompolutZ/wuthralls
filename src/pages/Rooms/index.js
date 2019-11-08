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
    //     const objectiveDeck = selectedFaction === 'ironsouls-condemners' 
    //     ? new Array(12).fill(1).map((x, i) => `0${x + i + 5000}`)
    //     : new Array(12).fill(33).map((x, i) => `0${x + i + 5000}`);

    // const powerDeck = selectedFaction === 'ironsouls-condemners' 
    //     ? new Array(20).fill(13).map((x, i) => `0${x + i + 5000}`)
    //     : new Array(20).fill(33 + 12).map((x, i) => `0${x + i + 5000}`)

        const payload = {
            name: roomName,
            createdBy: myself.uid,
            board: {
                topId: 1,
                bottomId: 2,
                orientation: 'pointy',
                tokens: {
                    'Lethal_1': {
                        type: 'LETHAL_HEX',
                        isOnBoard: false,
                        from: {x: -1, y: -1},
                        onBoard: {x: -1, y: -1}
                    },
                    'Lethal_2': {
                        type: 'LETHAL_HEX',
                        isOnBoard: false,
                        from: {x: -1, y: -1},
                        onBoard: {x: -1, y: -1}
                    },
                    'Feature_1': {
                        type: 'FEATURE_HEX',
                        number: 1,
                        isRevealed: false,
                        isLethal: true,
                        isOnBoard: false,
                        from: {x: -1, y: -1},
                        onBoard: {x: -1, y: -1}
                    },
                    'Feature_2': {
                        type: 'FEATURE_HEX',
                        number: 2,
                        isLethal: true,
                        isRevealed: false,
                        isOnBoard: false,
                        from: {x: -1, y: -1},
                        onBoard: {x: -1, y: -1}
                    },
                    'Feature_3': {
                        type: 'FEATURE_HEX',
                        number: 3,
                        isLethal: true,
                        isRevealed: false,
                        isOnBoard: false,
                        from: {x: -1, y: -1},
                        onBoard: {x: -1, y: -1}
                    },
                    'Feature_4': {
                        type: 'FEATURE_HEX',
                        number: 4,
                        isLethal: true,
                        isRevealed: false,
                        isOnBoard: false,
                        from: {x: -1, y: -1},
                        onBoard: {x: -1, y: -1}
                    },
                    'Feature_5': {
                        type: 'FEATURE_HEX',
                        number: 5,
                        isLethal: true,
                        isRevealed: false,
                        isOnBoard: false,
                        from: {x: -1, y: -1},
                        onBoard: {x: -1, y: -1}
                    },
                }
            },
            players: [myself.uid],
            [myself.uid]: {
                name: myself.username,
                faction: 'ironsouls-condemners',
                oDeck: new Array(12).fill(1).map((x, i) => `0${x + i + 5000}`),
                pDeck: new Array(20).fill(13).map((x, i) => `0${x + i + 5000}`)
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
            faction: 'ironsouls-condemners',
            oDeck: new Array(12).fill(1).map((x, i) => `0${x + i + 5000}`),
            pDeck: new Array(20).fill(13).map((x, i) => `0${x + i + 5000}`)
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