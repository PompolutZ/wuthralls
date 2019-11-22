import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useAuthUser } from '../../../components/Session';
import { FirebaseContext } from '../../../firebase';
import { useLocation } from 'react-router-dom';

export default function DesktopRoom() {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const { state } = useLocation();

    const [data, setData] = useState(state);

    return (
        <Grid container style={{ }}>
            <Grid item xs={3}>
                <div style={{ width: '100%', backgroundColor: 'orange' }} />
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={3}>
                <div style={{ width: '100%', backgroundColor: 'orange' }} />                
            </Grid>
        </Grid>
    )
}