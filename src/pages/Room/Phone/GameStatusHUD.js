import React, { useContext, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useAuthUser } from '../../../components/Session';
import { FirebaseContext } from '../../../firebase';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import InspireIcon from '@material-ui/icons/TrendingUp';


function RoundCounter({ round, onRoundChange }) {
    const [value, setValue] = useState(round);

    const handleChangeValue = changeBy => () => {
        const nextValue = value + changeBy;
        setValue(nextValue > 1 ? nextValue : 1);
        onRoundChange(nextValue > 1 ? nextValue : 1);
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <ButtonBase onClick={handleChangeValue(-1)} style={{ backgroundColor: 'green', width: '3rem', height: '3rem', borderRadius: '1.5rem', border: '3px solid white', color: 'white', boxSizing: 'border-box' }}>
                <RemoveIcon />
            </ButtonBase>
            <div style={{ 
                    display: 'flex',
                    position: 'relative', 
                    width: '8rem', 
                    height: '8rem', 
                    borderRadius: '4rem', 
                    border: '2px solid white', }}>
                <div style={{ margin: '-1rem auto 1rem auto', color: 'white', fontSize: '7rem', fontWeight: 'bold', }}>
                    { value }
                </div>
                <div style={{ 
                    backgroundImage: `url(/assets/other/roundToken.png)`, 
                    backgroundPosition: 'center, center', 
                    backgroundSize: 'cover',
                    width: '8rem', 
                    height: '8rem', 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    opacity: '.9',
                    zIndex: -1 }} />
            </div>
            <ButtonBase onClick={handleChangeValue(1)} style={{ backgroundColor: 'red', width: '3rem', height: '3rem', borderRadius: '1.5rem', border: '3px solid white', color: 'white', boxSizing: 'border-box' }}>
                <AddIcon />
            </ButtonBase>
        </div>
    )
}

function GloryCounter({ canEdit, imgUri, glory, OnGloryCountChanged }) {
    const [value, setValue] = useState(glory);

    const handleChangeValue = changeBy => () => {
        if(!canEdit) return;
        
        const nextValue = value + changeBy;
        setValue(nextValue >= 0 ? nextValue : 0);
        OnGloryCountChanged(nextValue >= 0 ? nextValue : 0);
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {
                canEdit && (
                    <ButtonBase onClick={handleChangeValue(-1)} style={{ backgroundColor: 'green', width: '3rem', height: '3rem', borderRadius: '1.5rem', border: '3px solid white', color: 'white', boxSizing: 'border-box' }}>
                        <RemoveIcon />
                    </ButtonBase>
                )
            }
            <div style={{ display: 'flex', backgroundImage: `url(${imgUri})`, backgroundPosition: 'center, center', backgroundSize: 'cover', width: '4rem', height: '4rem', borderRadius: '2rem', border: '2px solid white', }}>
                <div style={{ margin: 'auto', color: 'white', fontSize: '2.5rem' }}>
                    { value }
                </div>
            </div>
            {
                canEdit && (
                    <ButtonBase onClick={handleChangeValue(1)} style={{ backgroundColor: 'red', width: '3rem', height: '3rem', borderRadius: '1.5rem', border: '3px solid white', color: 'white', boxSizing: 'border-box' }}>
                        <AddIcon />
                    </ButtonBase>
                )
            }
        </div>
    )
}

function ActivationsCounter({ activationsToMake, canEdit, onActivationsCounterChanged }) {
    const [value, setValue] = useState(activationsToMake);

    const handleMakeActivation = () => {
        if(!canEdit) return;

        const nextValue = value - 1;
        setValue(nextValue);
        onActivationsCounterChanged(nextValue);
    }

    const handleUndoActivation = () => {
        if(!canEdit) return;

        const nextValue = value + 1;
        setValue(nextValue);
        onActivationsCounterChanged(nextValue);
    }

    return (
        <div style={{ display: 'flex' }}>
            {
                new Array(4 - value).fill(1).map((_, idx) => (
                    <img key={idx} src={`/assets/other/activationTokenSpent.png`} style={{ width: '5rem', height: '5rem', margin: 'auto .1rem' }}
                            onClick={handleUndoActivation} />
                ))
            }
            {
                new Array(value).fill(1).map((v, idx) => (
                    <img key={idx} src={`/assets/other/activationToken_universal.png`} style={{ width: '5rem', height: '5rem', margin: 'auto .1rem' }}
                            onClick={handleMakeActivation} />
                ))
            }
        </div>
    )
}


export default function GameStatusHUD({ data }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);

    const handleUpdatedScoredGloryCount = value => {
        firebase.updateBoardProperty(
            data.id,
            `${myself.uid}.gloryScored`,
            value,
        );

        // firebase.addGenericMessage(data.id, {
        //     author: 'Katophrane',
        //     type: 'INFO',
        //     value: `${myself.username} changes scored glory value to ${value}.`,
        // });
    }

    const handleUpdateSpentCloryCount = value => {
        firebase.updateBoardProperty(
            data.id,
            `${myself.uid}.glorySpent`,
            value,
        );

        // firebase.addGenericMessage(data.id, {
        //     author: 'Katophrane',
        //     type: 'INFO',
        //     value: `${myself.username} changes spent glory value to ${value}.`,
        // });
    }

    const handleActivationsLeftChanged = value => {
        firebase.updateBoardProperty(
            data.id,
            `${myself.uid}.activationsLeft`,
            value,
        );

        firebase.addGenericMessage(data.id, {
            author: 'Katophrane',
            type: 'INFO',
            value: `${myself.username} flipped activation token and has ${value} activations left.`,
        });
    }

    const handleRoundCounterChange = value => {
        firebase.updateBoardProperty(
            data.id,
            `status.round`,
            value,
        );

        data.players.forEach(p => {
            firebase.updateBoardProperty(
                data.id,
                `${p}.activationsLeft`,
                4,
            );
        });

        firebase.addGenericMessage(data.id, {
            author: 'Katophrane',
            type: 'INFO',
            value: `${myself.username} has started round ${value}.`,
        });
    }
    
    return (
        <Grid container>
            <Grid container justify="center">
                <Grid item>
                    <Typography variant="h6">{myself.username}</Typography>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <GloryCounter canEdit imgUri={'/assets/other/gloryToken.png'} glory={data[myself.uid].gloryScored} OnGloryCountChanged={handleUpdatedScoredGloryCount} />
            </Grid>
            <Grid item xs={6}>
                <GloryCounter canEdit imgUri={'/assets/other/gloryTokenSpent.png'} glory={data[myself.uid].glorySpent} OnGloryCountChanged={handleUpdateSpentCloryCount} />
            </Grid>
            <Grid item xs={12}>
                <Grid container justify="center">
                    <ActivationsCounter activationsToMake={data[myself.uid].activationsLeft} onActivationsCounterChanged={handleActivationsLeftChanged} canEdit />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <br />
                <Divider />
                <Grid container justify="center">
                    <RoundCounter round={data.status.round} onRoundChange={handleRoundCounterChange} />
                </Grid>
                <Divider />
                <br />
            </Grid>
            {
                data.players.length > 1 && (
                    data.players.filter(id => id !== myself.uid).map((opponent) => (
                        <Grid item xs={12} key={opponent}>
                            <Grid container justify="center">
                                <ActivationsCounter activationsToMake={data[opponent].activationsLeft} canEdit={false} />
                            </Grid>

                            <Grid container justify="center">
                                <Grid item xs={6} container justify="center">
                                    <GloryCounter imgUri={'/assets/other/gloryToken.png'} glory={data[opponent].gloryScored} canEdit={false} />
                                </Grid>
                                <Grid item xs={6} container justify="center">
                                    <GloryCounter imgUri={'/assets/other/gloryTokenSpent.png'} glory={data[opponent].glorySpent} canEdit={false} />
                                </Grid>
                            </Grid>
                            <Grid container justify="center">
                                <Grid item>
                                    <Typography variant="h6">{data[opponent].name}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))
                )
            }
        </Grid>
    )
}