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

const featureTokens = [{
    type: 'FEATURE_HEX',
    number: 1,
    isRevealed: false,
    isLethal: true,
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
},
{
    type: 'FEATURE_HEX',
    number: 2,
    isLethal: true,
    isRevealed: false,
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
},
{
    type: 'FEATURE_HEX',
    number: 3,
    isLethal: true,
    isRevealed: false,
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
},
{
    type: 'FEATURE_HEX',
    number: 4,
    isLethal: true,
    isRevealed: false,
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
},
{
    type: 'FEATURE_HEX',
    number: 5,
    isLethal: true,
    isRevealed: false,
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
},
]

const lethalHexTokens = new Array(2).fill({
    type: 'LETHAL_HEX',
    isOnBoard: false,
    from: {x: -1, y: -1},
    onBoard: {x: -1, y: -1}
})

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
    }, [rooms])

    const handleTextChange = name => event => {
        setRoomName(event.target.value)
    }  

    const handleAddNewRoom = async () => {
        const featureHexTokens = shuffle(featureTokens).reduce((r, token, idx) => ({ ...r, [`Feature_${idx}`]: token }), {});
        const lethalHexes = lethalHexTokens.reduce((r, token, idx) => ({ ...r, [`Lethal_${idx}`]: token }), {});
        const myWarband = warbands['ironsouls-condemners'].reduce((r, fighter, idx) => ({ ...r, [`${myself.uid}_F${idx}`]: fighter }), {});

        const payload = {
            name: roomName,
            createdBy: myself.uid,
            status: {
                round: 1,
            },
            board: {
                topId: 1,
                bottomId: 2,
                orientation: 'pointy',
                fighters: {
                    ...myWarband,
                },
                tokens: {
                    ...lethalHexes,
                    ...featureHexTokens
                }
            },
            players: [myself.uid],
            [myself.uid]: {
                name: myself.username,
                faction: 'ironsouls-condemners',
                oDeck: shuffle(new Array(12).fill(1).map((x, i) => `0${x + i + 5000}`)).join(),
                pDeck: shuffle(new Array(20).fill(13).map((x, i) => `0${x + i + 5000}`)).join(),
                gloryScored: 0,
                glorySpent: 0,
                activationsLeft: 4
            }
        };

        await firebase.addRoom(payload);
        setRoomName('');
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

    return myself ? (
        <div style={{ margin: '1rem' }}>
            <div style={{ display: 'flex', }}>
                <TextField style={{ flex: '1' }}
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
            <br />
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
                                            <Button onClick={handleJoinRoom(r)} disabled={!(r.players.length < 2)}>Join</Button>
                                        </Grid>
                                    </Grid>
                                ))
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