import React, { useContext, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useAuthUser } from '../../components/Session';
import { FirebaseContext } from '../../firebase';
import Typography from '@material-ui/core/Typography';
import Table from './Table';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
}));

function Tables() {
    const classes = useStyles();
    const authUser = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [tables, setTables] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.setTablesListener(snapshot => {
            console.log('OnTablesUpdatedSnapshot');
            setTables(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })));
        });

        return () => unsubscribe();
    }, []);

    const handleCreateNewTable = async () => {
        if(!authUser) return;
        
        const tableData = {
            name: "New Table",
            step: {
                type: 'IDLE',
            },
            created: Date(),
            players: [authUser.uid],
            [authUser.uid] : {
                name: authUser.username,
                state: 'SETUP'
            },
        };
        
        await firebase.addTable(tableData);
    }

    return (
        <Grid container className={classes.root} spacing={3}>
            {
                authUser && (
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={handleCreateNewTable}>
                            Create Table
                        </Button>
                    </Grid>
                )
            }
            <Grid item xs={12}>
                <Grid container>
                    {
                        tables && (
                            tables.map(table => (
                                <Grid key={table.id} item xs={12}>
                                    <Table data={table} />
                                </Grid>
                            ))
                        )
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Tables;