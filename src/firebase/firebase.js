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

    deleteTable = async (id, gameId) => {
        try {
            await this.fstore.collection("tables").doc(id).delete();
            await this.fstore.collection("games").doc(gameId).delete();
        } catch(error) {
            console.error('deleteTable', error);
        }
    }

    setTablesListener = onSnaphot => this.fstore.collection('tables').onSnapshot(onSnaphot);

    addGame = async payload => {
        try {
            const gameRef = await this.fstore.collection("games").add(payload);
            return gameRef.id;
        } catch(error) {
            console.error('Error in addGame: ', error);
        }
    }
}

export default Firebase;