/* eslint no-undef: 0 */
import app from "firebase";
import "firebase/database";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

export const firestoreArrayUnion = (value) =>
    app.firestore.FieldValue.arrayUnion(value);

export const firestoreArrayRemove = (value) =>
    app.firestore.FieldValue.arrayRemove(value);

class Firebase {
    constructor() {
        if (!app.apps.length) {
            app.initializeApp(config);
            app.analytics();
        }

        this.db = app.database();
        this.fstore = app.firestore();
        this.auth = app.auth();
        this.firestoreArrayUnion = (value) =>
            app.firestore.FieldValue.arrayUnion(value);
        this.firestoreArrayRemove = (value) =>
            app.firestore.FieldValue.arrayRemove(value);
    }

    // *** Auth API ***
    createUserWithEmailAndPassword(email, password) {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }

    signInWithEmailAndPassword(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    signInAnonymously() {
        return this.auth.signInAnonymously();
    }

    signOut() {
        return this.auth.signOut();
    }

    sendPasswordResetEmail(email) {
        return this.auth.sendPasswordResetEmail(email);
    }

    updatePassword(password) {
        return this.auth.currentUser.updatePassword(password);
    }

    onAuthUserListener(next, fallback) {
        return this.auth.onAuthStateChanged((user) => {
            if (user) {
                if (user.isAnonymous) {
                    const anonUserPayload = {
                        username: "Anonymous",
                        email: "none",
                    };
                    this.user(user.uid)
                        .set(anonUserPayload)
                        .then(() => {
                            next({
                                uid: user.uid,
                                username: anonUserPayload.username,
                                roles: {},
                            });
                        });
                } else {
                    this.user(user.uid)
                        .once("value")
                        .then((snapshot) => {
                            const dbUser = snapshot.val();

                            if (!dbUser) {
                                fallback();
                                return;
                            }

                            if (!dbUser.roles) {
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
    }

    // *** User API ***
    user(uid) {
        return this.db.ref(`/users/${uid}`);
    }

    users() {
        return this.db.ref(`users`);
    }

    // -------------------
    // PLAYGROUND
    // -------------------
    async recordGameResult(roomId, payload) {
        const results = payload.players.map((p) => ({
            glory: payload[p].gloryScored + payload[p].glorySpent,
            faction: payload[p].faction,
            pid: p,
            name: payload[p].name,
        }));

        await this.fstore.collection("gameResults").add({
            gameName: payload.name,
            players: payload.players,
            result: results,
            finishied: new Date(),
        });

        await this.fstore.collection("rooms").doc(roomId).delete();
        await this.fstore.collection("messages").doc(roomId).delete();
    }

    async addRoom(payload) {
        const roomRef = await this.fstore.collection("rooms").add(payload);

        const now = new Date();
        await this.fstore
            .collection("messages")
            .doc(roomRef.id)
            .set({
                [now.getTime()]: {
                    author: "Katophrane",
                    type: "INFO",
                    created: now,
                    value: `${payload.name} room was created by ${
                        payload[payload.createdBy].name
                    }`,
                },
            });

        return roomRef.id;
    }

    async addRoom2(payload) {
        const roomRef = await this.fstore.collection("rooms").add(payload);

        const now = new Date();
        await this.fstore
            .collection("messages")
            .doc(roomRef.id)
            .set({
                [now.getTime()]: {
                    author: "Katophrane",
                    type: "INFO",
                    created: now,
                    value: `Greetings **${
                        payload[payload.createdBy].name
                    }**! You've entered the **${
                        payload.name
                    }** room and as soon as someone else joins it too, you could start rolling for initiative and select boards.`,
                },
            });

        return roomRef.id;
    }

    async listRooms() {
        const list = await this.fstore.collection("rooms").get();
        return list.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    }

    async updateBoardProperty(roomId, path, payload) {
        const roomRef = await this.fstore.collection("rooms").doc(roomId);
        await roomRef.update({
            [path]: payload,
        });
    }

    async updateRoom(roomId, payload) {
        const roomRef = await this.fstore.collection("rooms").doc(roomId);
        await roomRef.update(payload);
    }

    async updateInteractiveMessage(roomId, path, payload) {
        const roomRef = await this.fstore.collection("messages").doc(roomId);
        await roomRef.update({
            [path]: payload,
        });
    }

    async updateInteractiveMessage3(roomId, payload) {
        const roomRef = await this.fstore.collection("messages").doc(roomId);
        await roomRef.update(payload);
    }

    async updateInteractiveMessage32(roomId, timestamp, payload) {
        const roomRef = await this.fstore.collection("messages").doc(roomId);
        await roomRef.update(payload);
    }

    async updateInteractiveMessage2(roomId, timestamp, payload, playerId) {
        const roomRef = await this.fstore.collection("messages").doc(roomId);
        await roomRef.update({
            ...payload,
            [`${timestamp}.waitingFor`]: this.firestoreArrayRemove(playerId),
        });
    }

    async updateInteractiveMessage22(roomId, timestamp, payload, playerId) {
        const roomRef = await this.fstore.collection("messages").doc(roomId);
        await roomRef.update({
            ...payload,
            [`${timestamp}.waitingFor`]: this.firestoreArrayRemove(playerId),
        });
    }

    setRoomsListener(onSnapshot, onError) {
        return this.fstore.collection("rooms").onSnapshot(onSnapshot, onError);
    }

    setRoomListener(roomId, onSnapshot) {
        return this.fstore
            .collection("rooms")
            .doc(roomId)
            .onSnapshot(onSnapshot);
    }

    setMessagesListener(roomId, handler) {
        return this.fstore
            .collection("messages")
            .doc(roomId)
            .onSnapshot(handler);
    }

    async addPlayerToRoom(roomId, playerId, playerInfo, warband, primacy) {
        const roomRef = this.fstore.collection("rooms").doc(roomId);

        const payload = {
            // add player to players list
            players: this.firestoreArrayUnion(playerId),
            // add player's warband
            "board.fighters": warband,
            // add player's deck and other meta
            [playerId]: playerInfo,
            // add player to boards initiative rolloff
            [`status.waitingFor`]: this.firestoreArrayUnion(playerId),
            [`status.waitingReason`]: "INITIATIVE_ROLL",
            [`status.rollOffs.${playerId}_1`]: "",
        };

        if (primacy) {
            payload["status.primacy"] = primacy;
        }

        await roomRef.update(payload);

        const now = new Date();
        await this.fstore
            .collection("messages")
            .doc(roomRef.id)
            .update({
                [now.getTime()]: {
                    author: "Katophrane",
                    type: "INFO",
                    created: now,
                    value: `Welcome ${playerInfo.name}! You've entered this room, but you are not alone here. Roll for initiative, select boards and fight till glorious victory!`,
                },
            });
    }

    async deleteRoom(id) {
        await this.fstore.collection("rooms").doc(id).delete();
        await this.fstore.collection("messages").doc(id).delete();
    }

    async addMessage(roomId, payload) {
        const messagesRef = await this.fstore
            .collection("messages")
            .doc(roomId);

        const now = new Date();
        await messagesRef.update({
            [now.getTime()]: {
                author: payload.uid,
                type: "CHAT",
                created: now,
                value: payload.value,
            },
        });
    }

    async addMessage2(roomId, payload) {
        const messagesRef = await this.fstore
            .collection("messages")
            .doc(roomId);

        const now = new Date();
        await messagesRef.update({
            [now.getTime()]: {
                author: payload.uid,
                type: "CHAT",
                created: now,
                value: payload.value,
            },
        });
    }

    async addGenericMessage2(roomId, payload) {
        const messagesRef = await this.fstore
            .collection("messages")
            .doc(roomId);

        const now = new Date();
        await messagesRef.update({
            [now.getTime()]: payload,
        });
    }

    async addDiceRoll(roomId, payload) {
        const messagesRef = await this.fstore
            .collection("messages")
            .doc(roomId);

        const now = new Date();
        await messagesRef.update({
            [now.getTime()]: {
                author: payload.uid,
                type: "DICE_ROLL",
                subtype: payload.type,
                created: now,
                value: payload.value,
            },
        });
    }

    async addDiceRoll2(roomId, payload) {
        const messagesRef = await this.fstore
            .collection("messages")
            .doc(roomId);

        const now = new Date();
        await messagesRef.update({
            [now.getTime()]: {
                author: payload.uid,
                type: "DICE_ROLL",
                subtype: payload.type,
                created: now,
                value: payload.value,
            },
        });
    }

    async addHistoryItem(payload, gameId) {
        await this.fstore.collection("history").doc(gameId).set(payload);
    }
}

export default Firebase;
