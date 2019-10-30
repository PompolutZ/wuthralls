import React, { useContext, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useAuthUser } from '../../components/Session';
import { FirebaseContext } from '../../firebase';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { PICK_FACTION } from '../../constants/gameSteps';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
}));

function Table({ data, onJoinTable, onDeleteTable }) {
    const {
        id,
        name,
        step,
        created,
        players} = data;
    const classes = useStyles();
    const authUser = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const history = useHistory();

    useEffect(() => {

    }, []);

    const handleJoin = async () => {
        if(!authUser) return;

        const playerInfo = {
            name: authUser.username,
            state: 'SETUP',
        };

        await firebase.addPlayerToTable(id, authUser.uid, playerInfo);
    }

    const handleStart = async () => {
        console.log('Start');
        // const activeStep = {
        //     type: 'INITIATIVE_ROLL',
        // };

        // await firebase.updateTable({
        //     step: activeStep
        // }, id);

        // history.push(`/v1/game/${id}`, {
        //     ...data,
        //     step: activeStep,
        // });
    }

    const handleResume = async () => {
        console.log('RESUME', data);
        // read from history
        // history.push(`/v1/game/${id}`, data);
    }

    const handleDelete = async () => {
        await firebase.deleteTable(id);
    }

    const handlePrepare = () => {
        history.push(`v1/table/${id}/prepare`, data);
    }

    const getReadyPlayers = players.map(uid => data[uid] && data[uid].state).filter(state => state === 'READY');
    console.log('Table', id, 'has', getReadyPlayers);

    const canStart = getReadyPlayers.length === players.length && players.length >= 2; // authUser && players.length >= 2 && step && step.type === 'IDLE';
    const canResume = false; // authUser && players.length >= 2 && step && step.type !== 'IDLE';
    const canJoin = authUser && !players.includes(authUser.uid);
    const canPrepare = authUser && players.includes(authUser.uid) && step.type === 'IDLE';
    const canDelete = authUser && players.length > 0 && players[0] === authUser.uid;

    return (
        <Grid container className={classes.root} spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h5">{name}</Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                {
                    players.length === 1 && (
                        <Typography>{`${data[players[0]].name} waiting for opponent...`}</Typography>
                    )
                }
                {
                    players.length >= 2 && (
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={5}>
                                <Grid container alignItems="center">
                                    <Grid item xs={3}>
                                        {
                                            data[players[0]] && data[players[0]].faction && (
                                                <img src={`/assets/factions/${data[players[0]].faction}-icon.png`} width="32" height="32" />
                                            )
                                        }
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{`${data[players[0]] && data[players[0]].name}`}</Typography>                                        
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography>VS</Typography>
                            </Grid>
                            <Grid item xs={5}>
                            <Grid container alignItems="center">
                                    <Grid item xs={3}>
                                        {
                                            data[players[1]] && data[players[1]].faction && (
                                                <img src={`/assets/factions/${data[players[1]].faction}-icon.png`} width="32" height="32" />
                                            )
                                        }
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{`${data[players[1]] && data[players[1]].name}`}</Typography>                                        
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                }
            </Grid>
            <Grid item xs={12}>
                {
                    canPrepare && (
                        <Button variant="outlined" onClick={handlePrepare}>Prepare</Button>
                    )
                }
                {
                    canStart && (
                        <Button variant="outlined" onClick={handleStart}>Start</Button>
                    )
                }
                {
                    canResume && (
                        <Button variant="outlined" onClick={handleResume}>Resume</Button>
                    )
                }
                {
                    canJoin && (
                        <Button variant="outlined" onClick={handleJoin}>Join</Button>
                    )
                }
                {
                    canDelete && (
                        <Button variant="outlined" onClick={handleDelete} style={{ color: 'red' }}>Delete</Button>
                    )
                }
            </Grid>
        </Grid>
    )
}

export default Table;