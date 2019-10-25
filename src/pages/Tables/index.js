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
        const getTablesAsync = async () => {
            const fetchedTables = await firebase.listTables();
            console.log(fetchedTables);
            setTables(fetchedTables);
        }

        getTablesAsync();
    }, []);

    const handleCreateNewTable = async () => {
        const tableData = {
            name: "New Table",
            status: "active",
            created: Date(),
            player1: authUser && authUser.uid,
            player1Name: authUser && authUser.username,
            player2: null,
            player2Name: null,
        };
        
        const tableId = await firebase.addTable(tableData);
        setTables(prev => [...prev, {...tableData, id: tableId }]);
    }

    const handleJoinTable = table => () => {
        console.log(table);
        const otherTables = tables.filter(t => t.id !== table.id);
        setTables([...otherTables, table]);
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
                                <Grid key={table.id} item>
                                    <Table data={table} onJoinTable={handleJoinTable} />
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