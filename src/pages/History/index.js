import React, { useEffect, useState, useContext } from 'react';
import { FirebaseContext } from '../../firebase';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';

export default function History() {
    const [gamesPlayed, setGamesPlayed] = useState(null);
    const firebase = useContext(FirebaseContext);
    const history = useHistory();

    useEffect(() => {
        const playedGames = firebase.fstore.collection('gameResults').get()
            .then(snapshot => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                console.log(data);
                setGamesPlayed(data.sort((a, b) => b.finishied.seconds - a.finishied.seconds));
            })
            .catch(e => console.log(e))
    }, []);

    const handleCheckPlayerInfo = pid => () => {
        history.push(`/player-info`, { pid: pid });
    }

    return (
        <div style={{ margin: '1rem' }}>
            <Typography variant="h5">Previous games:</Typography>
            <Grid container spacing={3} style={{ margin: '1rem auto'}}>
            { 
                gamesPlayed && gamesPlayed.map(r => {
                    const finished = new Date(0);
                    console.log(r);
                    finished.setSeconds(r.finishied.seconds);

                    return (
                        <Grid key={r.id} item xs={12}>
                            <Typography variant="body1">{r.gameName}</Typography>
                            <Typography variant="body2" style={{ color: 'gray' }}>{`${finished.toLocaleDateString()}`}</Typography>
                            <Grid container alignItems="center" style={{ margin: '1rem auto'}}>
                                <Grid item xs={4}>
                                    <Grid container direction="column" alignItems="center">
                                        <img src={`/assets/factions/${r.result[0].faction}-icon.png`} style={{ width: '2rem' }} />
                                        <Typography variant="body1" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={handleCheckPlayerInfo(r.result[0].pid)}>{r.result[0].name}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4} container justify="center">
                                    <Typography variant="h5">{`${r.result[0].glory} : ${r.result[1].glory}`}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Grid container direction="column" alignItems="center">
                                        <img src={`/assets/factions/${r.result[1].faction}-icon.png`} style={{ width: '2rem' }} />
                                        <Typography variant="body1" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={handleCheckPlayerInfo(r.result[1].pid)}>{r.result[1].name}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider />
                        </Grid>
                    )
                })
            }
            </Grid>
        </div>
    )
}