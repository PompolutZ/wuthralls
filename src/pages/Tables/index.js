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
        console.log(authUser)
        const unsubscribe = firebase.setTablesListener(qSnap => {
            const tables = [];
            qSnap.forEach(doc => {
                tables.push({...doc.data(), id: doc.id});
            })

            setTables(tables);
        });

        // const getTablesAsync = async () => {
        //     const fetchedTables = await firebase.listTables();
        //     console.log(fetchedTables);
        //     setTables(fetchedTables);
        // }

        // getTablesAsync();
        return () => unsubscribe();
    }, []);

    const handleCreateNewTable = async () => {
        const tableData = {
            name: "New Table",
            status: "empty",
            created: Date(),
            player1: authUser && authUser.uid,
            player1Name: authUser && authUser.username,
            player2: null,
            player2Name: null,
            gameId: null,
        };
        
        const tableId = await firebase.addTable(tableData);
    }

    return (
        <Grid container className={classes.root} spacing={3}>
            <Grid item xs={12}>
                <Button variant="contained" onClick={handleCreateNewTable}>
                    Create Table
                </Button>
            </Grid>
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