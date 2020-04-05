import app from 'firebase';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';

// CREATE ./config.js file to export your firebase configuration here.
const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.db = app.database();
        this.fstore = app.firestore();
        this.auth = app.auth();
        this.firestoreArrayUnion = value =>
            app.firestore.FieldValue.arrayUnion(value);
        this.firestoreArrayRemove = value => 
            app.firestore.FieldValue.arrayRemove(value);
    }

    // *** Auth API ***
    createUserWithEmailAndPassword = (email, password) => 
        this.auth.createUserWithEmailAndPassword(email, password);

    signInWithEmailAndPassword = (email, password) => 
        this.auth.signInWithEmailAndPassword(email, password);

    signInAnonymously = () => this.auth.signInAnonymously();        

    signOut = () => this.auth.signOut();

    sendPasswordResetEmail = email => this.auth.sendPasswordResetEmail(email);

    updatePassword = password => this.auth.currentUser.updatePassword(password);

    onAuthUserListener = (next, fallback) => 
        this.auth.onAuthStateChanged(user => {
            if(user) {
                if(user.isAnonymous) {
                    const anonUserPayload = {
                        username: 'Anonymous',
                        email: 'none',
                    };
                    this.user(user.uid).set(anonUserPayload)
                    .then(() => {
                        next({
                            uid: user.uid,
                            username: anonUserPayload.username,
                            roles: {},
                        });
                    })
                } else {
                    this.user(user.uid)
                    .once('value')
                    .then(snapshot => {
                        const dbUser = snapshot.val();
                        
                        if(!dbUser) {
                            fallback();
                            return;
                        }
    
                        if(!dbUser.roles) {
                            dbUser.roles = {};
                        }
                        
                        next({
                            uid: user.uid,
                            email: user.email,
                            ...dbUser,
                        });
                    });
                }
            } else {
                fallback();
            }
        });
    

    // *** User API ***
    user = uid => this.db.ref(`/users/${uid}`);
    
    users = () => this.db.ref(`users`);

    // -------------------
    // PLAYGROUND
    // -------------------
    recordGameResult = async (roomId, payload) => {
        try {
            console.log('recordGameResult', payload);

            const results = payload.players.map(p => ({
                glory: payload[p].gloryScored + payload[p].glorySpent,
                faction: payload[p].faction,
                pid: p,
                name: payload[p].name
            }));
            console.log(results);

            await this.fstore.collection('gameResults').add({
                gameName: payload.name,
                players: payload.players,
                result: results,
                finishied: new Date()
            });

            await this.fstore.collection("rooms").doc(roomId).delete();
            await this.fstore.collection("messages").doc(roomId).delete();

            // const allDocs = await this.fstore.collection(`${roomId}_messages`).get();
            // const allMessagesIds = allDocs.docs.map(doc => doc.id);
            // allMessagesIds.forEach(async messageId => await this.fstore.collection(`${roomId}_messages`).doc(messageId).delete());
        } catch(error) {
            console.error('Error in record game result: ', error);
        }
    }

    addRoom = async payload => {
        try {
            console.log(payload);
            const roomRef = await this.fstore.collection("rooms").add(payload);

            const now = new Date();
            await this.fstore.collection("messages").doc(roomRef.id).set({
                [now.getTime()]: {
                    author: 'Katophrane',
                    type: 'INFO',
                    created: now,
                    value: `${payload.name} room was created by ${payload[payload.createdBy].name}`
                }
            });

            return roomRef.id;
        } catch(error) {
            console.error('Error in addRoom: ', error);
        }
    }

    addRoom2 = async payload => {
        try {
            console.log(payload);
            const roomRef = await this.fstore.collection("rooms").add(payload);

            const now = new Date();
            await this.fstore.collection("messages").doc(roomRef.id).set({
                [now.getTime()]: {
                    author: 'Katophrane',
                    type: 'INFO',
                    created: now,
                    value: `Greetings **${payload[payload.createdBy].name}**! You've entered the **${payload.name}** room and as soon as someone else joins it too, you could start rolling for initiative and select boards.`
                },
            });

            return roomRef.id;
        } catch(error) {
            console.error('Error in addRoom: ', error);
        }
        // try {
        //     console.log(payload);
        //     const roomRef = await this.fstore.collection("rooms").add(payload);

        //     const now = new Date();
        //     await this.fstore.collection(`${roomRef.id}_messages`).doc(`${now.getTime()}`).set({
        //         author: 'Katophrane',
        //         type: 'INFO',
        //         created: now,
        //         value: `${payload.name} room was created by ${payload[payload.createdBy].name}`
        //     })

            
        //     // await this.fstore.collection("messages").doc(roomRef.id).set({
        //     //     [now.getTime()]: {
        //     //     }
        //     // });

        //     return roomRef.id;
        // } catch(error) {
        //     console.error('Error in addRoom2: ', error);
        // }
    }

    listRooms = async () => {
        try {
            const list = await this.fstore.collection("rooms").get();
            return list.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        } catch(error) {
            console.log('listRooms', error);
        }
    }

    updateBoardProperty = async (roomId, path, payload) => {
        try {
            const roomRef = await this.fstore.collection("rooms").doc(roomId);
            await roomRef.update({
                [path]: payload
            });
        } catch(error) {
            console.log('updateBoardProperty', error);
        }
    }

    updateRoom = async (roomId, payload) => {
        try {
            const roomRef = await this.fstore.collection("rooms").doc(roomId);
            await roomRef.update(payload);
        } catch(error) {
            console.log('updateBoardProperty', error);
        }
    }

    updateInteractiveMessage = async (roomId, path, payload) => {
        try {
            const roomRef = await this.fstore.collection("messages").doc(roomId);
            await roomRef.update({
                [path]: payload
            });
        } catch(error) {
            console.error('updateInteractiveMessage', error);
        }
    }

    updateInteractiveMessage3 = async (roomId, payload) => {
        try {
            const roomRef = await this.fstore.collection("messages").doc(roomId);
            await roomRef.update(payload);
        } catch(error) {
            console.error('updateInteractiveMessage', error);
        }
    }

    updateInteractiveMessage32 = async (roomId, timestamp, payload) => {
        try {
            const roomRef = await this.fstore.collection("messages").doc(roomId);
            await roomRef.update(payload);
        } catch(error) {
            console.error('updateInteractiveMessage', error);
        }
        // try {
        //     const roomRef = await this.fstore.collection(`${roomId}_messages`).doc(`${timestamp}`);
        //     await roomRef.update(payload);
        // } catch(error) {
        //     console.error('updateInteractiveMessage32', error);
        // }
    }

    updateInteractiveMessage2 = async (roomId, timestamp, payload, playerId) => {
        try {
            const roomRef = await this.fstore.collection("messages").doc(roomId);
            await roomRef.update({
                ...payload,
                [`${timestamp}.waitingFor`]: this.firestoreArrayRemove(playerId)
            });
        } catch(error) {
            console.error('updateInteractiveMessage', error);
        }
    }

    updateInteractiveMessage22 = async (roomId, timestamp, payload, playerId) => {
        // try {
        //     const roomRef = await this.fstore.collection(`${roomId}_messages`).doc(`${timestamp}`);
        //     await roomRef.update({
        //         ...payload,
        //         [`waitingFor`]: this.firestoreArrayRemove(playerId)
        //     });
        // } catch(error) {
        //     console.error('updateInteractiveMessage22', error);
        // }
        try {
            const roomRef = await this.fstore.collection("messages").doc(roomId);
            await roomRef.update({
                ...payload,
                [`${timestamp}.waitingFor`]: this.firestoreArrayRemove(playerId)
            });
        } catch(error) {
            console.error('updateInteractiveMessage', error);
        }
    }

    setRoomsListener = (onSnapshot, onError) => this.fstore.collection('rooms').onSnapshot(onSnapshot, onError);
    setRoomListener = (roomId, onSnapshot) => this.fstore.collection('rooms').doc(roomId).onSnapshot(onSnapshot);
    setMessagesListener = (roomId, handler) => this.fstore.collection('messages').doc(roomId).onSnapshot(handler);

    addPlayerToRoom = async (roomId, playerId, playerInfo, warband) => {
        try {
            const roomRef = this.fstore.collection("rooms").doc(roomId);

            await roomRef.update({
                // add player to players list
                players: this.firestoreArrayUnion(playerId),
                // add player's warband
                'board.fighters': warband,
                // add player's deck and other meta
                [playerId]: playerInfo,
                // add player to boards initiative rolloff
                [`status.waitingFor`]: this.firestoreArrayUnion(playerId),
                [`status.rollOffs.${playerId}_1`]: "", 
            });
            // await roomRef.update({
                
            // })

            // const now = new Date();
            // await this.fstore.collection(`${roomRef.id}_messages`).doc(`${now.getTime()}`).set({
            //     author: 'Katophrane',
            //     type: 'INFO',
            //     created: now,
            //     value: `${playerInfo.name} joined the room.`
            // });

            const now = new Date();
            await this.fstore.collection("messages").doc(roomRef.id).update({
                [now.getTime()]: {
                    author: 'Katophrane',
                    type: 'INFO',
                    created: now,
                    value: `Welcome ${playerInfo.name}! You've entered this room, but you are not alone here. Roll for initiative, select boards and fight till glorious victory!`
                }
            });
        } catch(error) {
            console.error(error);
        }
    }

    deleteRoom = async (id) => {
        try {
            await this.fstore.collection("rooms").doc(id).delete();
            await this.fstore.collection("messages").doc(id).delete();
            // const allDocs = await this.fstore.collection(`${id}_messages`).get();
            // const allMessagesIds = allDocs.docs.map(doc => doc.id);
            // allMessagesIds.forEach(async messageId => await this.fstore.collection(`${id}_messages`).doc(messageId).delete());
        } catch(error) {
            console.error('deleteTable', error);
        }
    }

    addMessage = async (roomId, payload) => {
        try {
            console.log(payload);
            const messagesRef = await this.fstore.collection("messages").doc(roomId);

            const now = new Date();
            await messagesRef.update({
                [now.getTime()]: {
                    author: payload.uid,
                    type: 'CHAT',
                    created: now,
                    value: payload.value,
                }
            });
        } catch(error) {
            console.error('Error in addRoom: ', error);
        }
    }

    addMessage2 = async (roomId, payload) => {
        try {
            console.log(payload);
            const messagesRef = await this.fstore.collection("messages").doc(roomId);

            const now = new Date();
            await messagesRef.update({
                [now.getTime()]: {
                    author: payload.uid,
                    type: 'CHAT',
                    created: now,
                    value: payload.value,
                }
            });
        } catch(error) {
            console.error('Error in addRoom: ', error);
        }
        // try {
        //     console.log(payload);
        //     const now = new Date();
        //     const data = {
        //         author: payload.uid,
        //         type: 'CHAT',
        //         created: now,
        //         value: payload.value,
        //     };
            
        //     await this.fstore.collection(`${roomId}_messages`).doc(`${now.getTime()}`).set(data);

        //     // const now = new Date();
        //     // await messagesRef.set({
        //     //     [now.getTime()]: 
        //     // });
        // } catch(error) {
        //     console.error('Error in addRoom: ', error);
        // }
    }

    addGenericMessage2 = async (roomId, payload) => {
        try {
            console.log(payload);
            const messagesRef = await this.fstore.collection("messages").doc(roomId);

            const now = new Date();
            await messagesRef.update({
                [now.getTime()]: payload,
            });
        } catch(error) {
            console.error('Error in addRoom: ', error);
        }

        // try {
        //     console.log(payload);
        //     const now = new Date();
        //     const withTimestamp = {
        //         ...payload,
        //         created: now
        //     }

        //     await this.fstore.collection(`${roomId}_messages`).doc(`${now.getTime()}`).set(withTimestamp);
        // } catch(error) {
        //     console.error('Error in addGenericMessage2: ', error);
        // }
    }

    addDiceRoll = async (roomId, payload) => {
        try {
            console.log(payload);
            const messagesRef = await this.fstore.collection("messages").doc(roomId);

            const now = new Date();
            await messagesRef.update({
                [now.getTime()]: {
                    author: payload.uid,
                    type: 'DICE_ROLL',
                    subtype: payload.type,
                    created: now,
                    value: payload.value,
                }
            });
        } catch(error) {
            console.error('Error in addRoom: ', error);
        }
    }

    addDiceRoll2 = async (roomId, payload) => {
        try {
            console.log(payload);
            const messagesRef = await this.fstore.collection("messages").doc(roomId);

            const now = new Date();
            await messagesRef.update({
                [now.getTime()]: {
                    author: payload.uid,
                    type: 'DICE_ROLL',
                    subtype: payload.type,
                    created: now,
                    value: payload.value,
                }
            });
        } catch(error) {
            console.error('Error in addRoom: ', error);
        }
        // try {
        //     console.log(payload);
        //     const now = new Date();
        //     const data = {
        //         author: payload.uid,
        //         type: 'DICE_ROLL',
        //         subtype: payload.type,
        //         created: now,
        //         value: payload.value,
        //     };
        //     await this.fstore.collection(`${roomId}_messages`).doc(`${now.getTime()}`).set(data);

            
        //     // await messagesRef.update({
        //     //     [now.getTime()]: 
        //     // });
        // } catch(error) {
        //     console.error('Error in addRoom: ', error);
        // }
    }
    // FIRESTORE
    listTables = async () => {
        try {
            const list = await this.fstore.collection("tables").get();
            return list.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        } catch(error) {
            console.log('listTables', error);
        }
    }

    addTable = async payload => {
        try {
            console.log(payload);
            const tableRef = await this.fstore.collection("tables").add(payload);
            return tableRef.id;
        } catch(error) {
            console.error('Error in addTable: ', error);
        }
    }

    updateTable = async (payload, id) => {
        try {
            const ref = this.fstore.collection("tables").doc(id);
            await ref.update(payload);
        } catch(error) {
            console.error(error);
        }
    }

    updateStep = async (tableId, uid, payload) => {
        try {
            const ref = this.fstore.collection("tables").doc(tableId);
            await ref.update({
                [`step.${uid}`]: payload
            })
        } catch(error) {
            console.error(error);
        }
    }

    updateInitiativeRoll = async (tableId, playerId, payload) => {
        try {
            const ref = this.fstore.collection("tables").doc(tableId);
            await ref.update({
                'step.waitingFor': this.firestoreArrayRemove(playerId),
                [`step.${playerId}`]: payload
            })
        } catch(error) {
            console.error(error);
        }
    }

    addPlayerToTable = async (tableId, playerId, playerInfo) => {
        try {
            const ref = this.fstore.collection("tables").doc(tableId);

            await ref.update({
                players: this.firestoreArrayUnion(playerId),
            });
            await ref.update({
                [playerId]: playerInfo
            })
        } catch(error) {
            console.error(error);
        }
    }

    updatePlayerInfo = async (tableId, playerId, playerInfo) => {
        try {
            const ref = this.fstore.collection("tables").doc(tableId);
            await ref.update({
                [playerId]: playerInfo
            })
        } catch(error) {
            console.error(error);
        }
    }

    addFirstBoard = async (tableId, boardId) => {
        try {
            const ref = this.fstore.collection("tables").doc(tableId);
            await ref.update({
                firstBoard: boardId
            })
        } catch(error) {
            console.error(error);
        }
    }

    addSecondBoard = async (tableId, boardId) => {
        try {
            const ref = this.fstore.collection("tables").doc(tableId);
            await ref.update({
                secondBoard: boardId
            })
        } catch(error) {
            console.error(error);
        }
    }

    addFullBoard = async (tableId, payload) => {
        try {
            const ref = this.fstore.collection("tables").doc(tableId);
            await ref.update({
                fullBoard: payload
            })
        } catch(error) {
            console.error(error);
        }
    }

    addFeatureHex = async (tableId, index, payload) => {
        try {
            const ref = this.fstore.collection("tables").doc(tableId);
            await ref.update({
                [`featureHexes.${index}`]: payload
            })
        } catch(error) {
            console.error(error);
        }
    }

    addLethalHex = async (tableId, index, payload) => {
        try {
            const ref = this.fstore.collection("tables").doc(tableId);
            await ref.update({
                [`lethalHexes.${index}`]: payload
            })
        } catch(error) {
            console.error(error);
        }
    }

    deleteTable = async (id) => {
        try {
            await this.fstore.collection("tables").doc(id).delete();
        } catch(error) {
            console.error('deleteTable', error);
        }
    }

    setTablesListener = onSnapshot => this.fstore.collection('tables').onSnapshot(onSnapshot);

    setTableListener = (tableId, onSnapshot) => this.fstore.collection('tables').doc(tableId).onSnapshot(onSnapshot);

    addHistoryItem = async (payload, gameId) => {
        try {
            await this.fstore.collection("history").doc(gameId).set(payload);
        } catch(error) {
            console.error('Error in addGame: ', error);
        }
    }
}

export default Firebase;