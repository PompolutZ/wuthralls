import React, { useContext, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useAuthUser } from '../../components/Session';
import { FirebaseContext } from '../../firebase';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import InspireIcon from '@material-ui/icons/TrendingUp';

function GloryCounter({ glory, OnGloryCountChanged }) {
    const [value, setValue] = useState(glory);

    useEffect(() => {
        OnGloryCountChanged(value);
    }, [value]);

    const handleChangeValue = changeBy => () => {
        setValue(prev => {
            const nextValue = prev + changeBy;
            return nextValue >= 0 ? nextValue : 0;
        })
    }

    return (
        <div style={{ display: 'flex', position: 'absolute', top: '1rem', left: '50%', marginLeft: '-5rem', alignItems: 'flex-end' }}>
            <ButtonBase onClick={handleChangeValue(-1)} style={{ backgroundColor: 'green', width: '3rem', height: '3rem', borderRadius: '1.5rem', border: '3px solid white', color: 'white', boxSizing: 'border-box' }}>
                <RemoveIcon />
            </ButtonBase>
            <div style={{ display: 'flex', backgroundImage: 'url(/assets/other/gloryToken.png)', backgroundPosition: 'center, center', backgroundSize: 'cover', width: '4rem', height: '4rem', borderRadius: '2rem', border: '2px solid white', }}>
                <div style={{ margin: 'auto', color: 'white', fontSize: '2.5rem' }}>
                    { value }
                </div>
            </div>
            <ButtonBase onClick={handleChangeValue(1)} style={{ backgroundColor: 'red', width: '3rem', height: '3rem', borderRadius: '1.5rem', border: '3px solid white', color: 'white', boxSizing: 'border-box' }}>
                <AddIcon />
            </ButtonBase>
        </div>
    )
}


export default function GameStatusHUD({ data }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);

    const handleUpdatedScoredGloryCount = value => {
        console.log('Scored', value, 'glory');
    }
    
    return (
        <Grid container>
            <Grid item>
                <GloryCounter glory={data[myself.uid].gloryScored} OnGloryCountChanged={handleUpdatedScoredGloryCount} />
            </Grid>
        </Grid>
    )
}