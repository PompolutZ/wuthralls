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
            app.firestore.FieldValue.arrayUnion(value)
    }

    // *** Auth API ***
    createUserWithEmailAndPassword = (email, password) => 
        this.auth.createUserWithEmailAndPassword(email, password);

    signInWithEmailAndPassword = (email, password) => 
        this.auth.signInWithEmailAndPassword(email, password);

    signOut = () => this.auth.signOut();

    sendPasswordResetEmail = email => this.auth.sendPasswordResetEmail(email);

    updatePassword = password => this.auth.currentUser.updatePassword(password);

    onAuthUserListener = (next, fallback) => 
        this.auth.onAuthStateChanged(user => {
            if(user) {
                this.user(user.uid)
                .once('value')
                .then(snapshot => {
                    const dbUser = snapshot.val();
    
                    if(!dbUser.roles) {
                        dbUser.roles = {};
                    }
                    
                    next({
                        uid: user.uid,
                        email: user.email,
                        ...dbUser,
                    });
                });
            } else {
                fallback();
            }
        });
    

    // *** User API ***
    user = uid => this.db.ref(`/users/${uid}`);
    
    users = () => this.db.ref(`users`);

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

    deleteTable = async (id) => {
        try {
            await this.fstore.collection("tables").doc(id).delete();
        } catch(error) {
            console.error('deleteTable', error);
        }
    }

    setTablesListener = onSnapshot => this.fstore.collection('tables').onSnapshot(onSnapshot);

    setTableListener = (tableId, onSnapshot) => this.fstore.collection('tables').doc(tableId).onSnapshot(onSnapshot);

    addGame = async payload => {
        try {
            const gameRef = await this.fstore.collection("games").add(payload);
            return gameRef.id;
        } catch(error) {
            console.error('Error in addGame: ', error);
        }
    }

    getGame = async gameId => {
        try {
            const snap = await this.fstore.collection("games").doc(gameId).get();
            return snap.data();
        } catch(error) {
            console.error('Error in getGame: ', error);
        }
    }

    updateGame = async (payload, id) => {
        try {
            const ref = this.fstore.collection("games").doc(id);
            await ref.update(payload);
        } catch(error) {
            console.error(error);
        }
    }

    setGameListener = (gameId, onSnaphot) => this.fstore.collection('games').doc(gameId).onSnapshot(onSnaphot);

    addHistoryItem = async (payload, gameId) => {
        try {
            await this.fstore.collection("history").doc(gameId).set(payload);
        } catch(error) {
            console.error('Error in addGame: ', error);
        }
    }

    getActiveStep = async gameId => {
        try {
            const snap = await this.fstore.collection("activeSteps").doc(gameId).get();
            return snap.data();
        } catch(error) {
            console.error('Error in getGame: ', error);
        }
    }

    addActiveStep = async (gameId, payload) => {
        try {
            await this.fstore.collection("activeSteps").doc(gameId).set(payload);
        } catch(error) {
            console.error('Error in addActiveStep: ', error);
        }
    }

    updateActiveStepForPlayer = async (gameId, playerId, payload) => {
        try {
            const ref = this.fstore.collection("activeSteps").doc(gameId);
            await ref.update({
                [playerId] : payload
            })
        } catch(error) {
            console.error('Error in addActiveStep: ', error);
        }
    }

    setActiveStepListener = (gameId, onSnaphot) => this.fstore.collection('activeSteps').doc(gameId).onSnapshot(onSnaphot);
}

export default Firebase;