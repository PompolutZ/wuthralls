import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useAuthUser } from '../../../components/Session';
import { FirebaseContext } from '../../../firebase';
import { useLocation } from 'react-router-dom';
import Board from './Board';
import InteractiveBoard from './InteractiveBoard';

export default function DesktopRoom() {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const { state } = useLocation();

    const [data, setData] = useState(state);
    const [selectedElement, setSelectedElement] = useState(null);
    const [orientation, setOrientation] = useState('pointy');
    const [scaleFactor, setScaleFactor] = useState(1);

    const changeOrientation = () => {
        setOrientation(prev => prev === 'pointy' ? 'flat' : 'pointy');
    }

    const scale = mod => () => {
        setScaleFactor(scaleFactor + mod);
    }

    return (
        <Grid container style={{ }}>
            <Grid item xs={3}>
                <div style={{ width: '100%', backgroundColor: 'orange' }} />
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', flexFlow: 'column nowrap' }}>
                <Grid container>
                    <Grid item xs={2}>
                        <Button onClick={changeOrientation}>
                            {orientation}
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={scale(-.2)}>
                            Scale Down
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={scale(.2)}>
                            Scale Up
                        </Button>
                    </Grid>
                </Grid>
                <InteractiveBoard orientation={orientation} scaleFactor={scaleFactor} />
                {/* <Board roomId={state.id} state={data} selectedElement={selectedElement} orientation={orientation} /> */}
            </Grid>
            <Grid item xs={3}>
                <div style={{ width: '100%', backgroundColor: 'orange' }} />                
            </Grid>
        </Grid>
    )
}