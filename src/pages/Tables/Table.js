import React, { useContext, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useAuthUser } from '../../components/Session';
import { FirebaseContext } from '../../firebase';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
}));

function Table({ data, onJoinTable, onDeleteTable }) {
    const {
        id,
        name,
        status,
        created,
        player1,
        player1Name,
        player2,
        player2Name,
        gameId,} = data;
    const classes = useStyles();
    const authUser = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    // const [tables, setTables] = useState(null);

    useEffect(() => {
        // console.log(authUser)
        // const getTablesAsync = async () => {
        //     const fetchedTables = await firebase.listTables();
        //     console.log(fetchedTables);
        //     setTables(fetchedTables);
        // }

        // getTablesAsync();
    }, []);

    const handleJoin = async () => {
        const player2Info = {
            player2: authUser.uid,
            player2Name: authUser.username
        };

        await firebase.updateTable(player2Info, id);
    }

    const handleStart = async () => {
        const newGameId = await firebase.addGame({
            stage: 'INITIATIVE_ROLL',
        });

        await firebase.updateTable({
            gameId: newGameId
        }, id);

        history.push(`/v1/game/${newGameId}`);
    }

    const handleResume = () => {
        history.push(`/v1/game/${gameId}`);
    }

    const handleDelete = async () => {
        await firebase.deleteTable(id, gameId);
    }

    return (
        <Grid container className={classes.root} spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h5">{name}</Typography>
            </Grid>
            <Grid item xs={12}>
                {
                    player1 && !player2 && (
                        <Typography>{`${player1Name} waiting for opponent...`}</Typography>
                    )
                }
                {
                    player1 && player2 && (
                        <Typography>{`${player1Name} VS ${player2Name}`}</Typography>
                    )
                }
            </Grid>
            <Grid item xs={12}>
                {
                    player1 && player2 && !gameId && (
                        <Button variant="outlined" onClick={handleStart}>Start</Button>
                    )
                }
                {
                    player1 && player2 && gameId && (
                        <Button variant="outlined" onClick={handleResume}>Resume</Button>
                    )
                }
                {
                    authUser && authUser.uid !== player1 && !player2 && (
                        <Button variant="outlined" onClick={handleJoin}>Join</Button>
                    )
                }
                {
                    authUser && authUser.uid === player1 && (
                        <Button variant="outlined" onClick={handleDelete} style={{ color: 'red' }}>Delete</Button>
                    )
                }
            </Grid>
            {/* <Grid item xs={12}>
                <Button variant="contained" onClick={handleCreateNewTable}>
                    Create Table
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    {
                        tables && (
                            tables.map(table => (
                                <Grid key={table.id} item>
                                    <Typography>{table.name}</Typography>
                                </Grid>
                            ))
                        )
                    }
                </Grid>
            </Grid> */}
        </Grid>
    )
}

export default Table;