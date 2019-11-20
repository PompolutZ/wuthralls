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

const IronsoulCondemners = [
    {
        type: 'FIGHTER',
        icon: 'ironsouls-condemners-1',
        name: 'Ironsoul',
        from: {x: -1, y: -1},
        onBoard: {x: -1, y: -1},
        isOnBoard: false,
        isInspired: false,
        wounds: 0,
        tokens: '',
        upgrades: '',
    },
    {
        type: 'FIGHTER',
        icon: 'ironsouls-condemners-2',
        name: 'Blightbane',
        from: {x: -1, y: -1},
        onBoard: {x: -1, y: -1},
        isOnBoard: false,
        isInspired: false,
        wounds: 0,
        tokens: '',
        upgrades: '',
    },
    {
        type: 'FIGHTER',
        icon: 'ironsouls-condemners-3',
        name: 'Tavian',
        from: {x: -1, y: -1},
        onBoard: {x: -1, y: -1},
        isOnBoard: false,
        isInspired: false,
        wounds: 0,
        tokens: '',
        upgrades: '',
    },    
]

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
        const featureHexTokens = shuffle(featureTokens).reduce((r, token, idx) => ({ ...r, [`Feature_${idx}`]: token }), {});
        const lethalHexes = lethalHexTokens.reduce((r, token, idx) => ({ ...r, [`Lethal_${idx}`]: token }), {});
        const myWarband = IronsoulCondemners.reduce((r, fighter, idx) => ({ ...r, [`${myself.uid}_F${idx}`]: fighter }), {});

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
                    // [`${myself.uid}_F1`]: {
                    //     type: 'FIGHTER',
                    //     icon: 'ironsouls-condemners-1',
                    //     name: 'Ironsoul',
                    //     from: {x: -1, y: -1},
                    //     onBoard: {x: -1, y: -1},
                    //     isOnBoard: false,
                    //     isInspired: false,
                    //     wounds: 0,
                    // },
                    // [`${myself.uid}_F2`]: {
                    //     type: 'FIGHTER',
                    //     icon: 'ironsouls-condemners-2',
                    //     name: 'Blightbane',
                    //     from: {x: -1, y: -1},
                    //     onBoard: {x: -1, y: -1},
                    //     isOnBoard: false,
                    //     isInspired: false,
                    //     wounds: 0,
                    // },
                    // [`${myself.uid}_F3`]: {
                    //     type: 'FIGHTER',
                    //     icon: 'ironsouls-condemners-3',
                    //     name: 'Tavian',
                    //     from: {x: -1, y: -1},
                    //     onBoard: {x: -1, y: -1},
                    //     isOnBoard: false,
                    //     isInspired: false,
                    //     wounds: 0,
                    // },
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
            oDeck: shuffle(new Array(12).fill(1).map((x, i) => `0${x + i + 5000}`)).join(),
            pDeck: shuffle(new Array(20).fill(13).map((x, i) => `0${x + i + 5000}`)).join(),
            gloryScored: 0,
            glorySpent: 0,
            activationsLeft: 4,
        };

        const myWarband = IronsoulCondemners.reduce((r, fighter, idx) => ({ ...r, [`${myself.uid}_F${idx}`]: fighter }), {});
        // const warband = [
        //     {
        //         type: 'FIGHTER',
        //         icon: 'ironsouls-condemners-1',
        //         name: 'Ironsoul',
        //         from: {x: -1, y: -1},
        //         onBoard: {x: -1, y: -1},
        //         isOnBoard: false,
        //         isInspired: false,
        //         wounds: 0,
        //     }, {
        //         type: 'FIGHTER',
        //         icon: 'ironsouls-condemners-2',
        //         name: 'Blightbane',
        //         from: {x: -1, y: -1},
        //         onBoard: {x: -1, y: -1},
        //         isOnBoard: false,
        //         isInspired: false,
        //         wounds: 0,
        //     },
        //     {
        //         type: 'FIGHTER',
        //         icon: 'ironsouls-condemners-3',
        //         name: 'Tavian',
        //         from: {x: -1, y: -1},
        //         onBoard: {x: -1, y: -1},
        //         isOnBoard: false,
        //         isInspired: false,
        //         wounds: 0,
        //     },            
        // ]

        await firebase.addPlayerToRoom(room.id, myself.uid, playerInfo, {...room.board.fighters, ...myWarband });
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
    )
}

export default Rooms;