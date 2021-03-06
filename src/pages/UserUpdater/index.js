import React, { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../../firebase";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export default function UsersSummary() {
    const firebase = useContext(FirebaseContext);
    const [players, setPlayers] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        firebase.fstore
            .collection("gameResults")
            .get()
            .then((snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                const players = data
                    .flatMap((d) => d.players)
                    .reduce((r, c) => (r.includes(c) ? r : [...r, c]), []);
                firebase
                    .users()
                    .once("value")
                    .then((snapshot) => {
                        const dbUsers = snapshot.val();
                        const playersWithNames = players.map((p) => ({
                            pid: p,
                            name: dbUsers[p] && dbUsers[p].username,
                            games: data.filter((game) =>
                                game.players.includes(p)
                            ),
                        }));
                        setPlayers(playersWithNames);
                    });
            })
            .catch((e) => setError(e.message));
    }, []);

    const handleReload = async () => {
        // const [player] = players.slice(0,1);
        for (let player of players) {
            const summary = {
                totalGamesPlayed: player.games.length,
                gamesWon: player.games.reduce((r, game) => {
                    const myResult = game.result.find(
                        (gr) => gr.pid === player.pid
                    );
                    const opponentResult = game.result.find(
                        (gr) => gr.pid !== player.pid
                    );
                    return myResult.glory > opponentResult.glory ? r + 1 : r;
                }, 0),
                factions: player.games.reduce((r, game) => {
                    const myResult = game.result.find(
                        (gr) => gr.pid === player.pid
                    );
                    return r[myResult.faction]
                        ? { ...r, [myResult.faction]: r[myResult.faction] + 1 }
                        : { ...r, [myResult.faction]: 1 };
                }, {}),
                highestGloryScoredInGame: Math.max(
                    ...player.games.flatMap(
                        (game) =>
                            game.result.find((res) => res.pid === player.pid)
                                .glory
                    )
                ),
            };

            // console.table(summary);
            await firebase.user(player.pid).update(summary);
            await firebase.db
                .ref(`/activePlayers`)
                .update({ [player.pid]: true });
        }
    };

    return (
        <div style={{ margin: "1rem" }}>
            <Button
                onClick={handleReload}
                disabled={!players || players.length === 0}
                color="primary"
                variant="contained"
            >
                Reload
            </Button>
            {error && <Typography>{error}</Typography>}
        </div>
    );
}
