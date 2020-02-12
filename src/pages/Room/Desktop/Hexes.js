import React, { useState, useEffect, useContext } from 'react';
import { useAuthUser } from '../../../components/Session';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { FirebaseContext } from '../../../firebase';
import { makeStyles } from '@material-ui/core/styles';
import ObjectiveHexesPile from './ObjectiveHexesPile';
import LethalHexesPile from './LethalHexesPile';
import ScatterToken from './ScatterToken';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flex: 1,
        margin: '.5rem',
        flexFlow: 'row wrap',
        '& > *': {
            flex: '1 1 100%',
        },
    },
}));

export default function Hexes({
    roomId,
    tokens,
    orientation,
    onSelectedElementChange
}) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div>
                <Typography style={{ borderBottom: '1px solid dimgray' }}>
                    Feature hexes:
                </Typography>
                <div
                    style={{
                        display: 'flex',
                        flexFlow: 'row wrap',
                    }}
                >
                    <ObjectiveHexesPile roomId={roomId} tokens={Object.entries(tokens)
                        .map(([id, value]) => ({ ...value, id: id }))
                        .filter(token => token.id.startsWith('Feature'))}
                        onSelectedTokenChange={onSelectedElementChange} />
                </div>
            </div>
            <div>
                <Typography style={{ borderBottom: '1px solid dimgray' }}>
                    Lethal hexes:
                </Typography>
                <div
                    style={{
                        display: 'flex',
                        flexFlow: 'row wrap',
                    }}
                >
                    <LethalHexesPile roomId={roomId}
                        onSelectedTokenChange={onSelectedElementChange}
                        tokens={Object.entries(tokens)
                            .map(([id, value]) => ({ ...value, id: id }))
                            .filter(token => token.id.startsWith('Lethal'))}
                        />
                </div>
            </div>
            <div>
                <Typography style={{ borderBottom: '1px solid dimgray' }}>
                    Other hexes:
                </Typography>
                <div
                    style={{
                        display: 'flex',
                        flexFlow: 'row wrap',
                    }}
                >
                    <ScatterToken onSelectionChange={onSelectedElementChange} orientation={orientation} />
                </div>
            </div>
        </div>
    );
}