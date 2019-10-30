import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { factions } from '../../data';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    icon: {
        width: '2rem',
        height: '2rem'
    }
}));

function FactionSelector({ selectedFaction, onSelectionChanged }) {
    const classes = useStyles();
    const [selected, setSelected] = useState(selectedFaction)

    const handleSelect = faction => () => {
        console.log(faction);
        setSelected(faction);
        onSelectionChanged(faction);
    }

    useEffect(() => {
        setSelected(selectedFaction);
    }, [selectedFaction]);

    return (
        <Grid container spacing={1} direction="column">
            <Grid item>
                <Grid container>
                    {
                        Object.keys(factions).map(faction => (
                            <Grid key={faction} item onClick={handleSelect(faction)}>
                                <img className={classes.icon} 
                                    src={`/assets/factions/${faction}-icon.png`} 
                                    alt={faction}
                                    style={{
                                        transform: selected === faction ? 'scale(1.2)' : 'scale(1)'
                                    }} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Grid>
            <Grid item>
                <Typography>{factions[selected]}</Typography>
            </Grid>
        </Grid>
    )
}

export default FactionSelector;