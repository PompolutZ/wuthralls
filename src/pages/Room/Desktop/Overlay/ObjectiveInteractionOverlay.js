import React, { useEffect, useContext, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../../../firebase';
import { useAuthUser } from '../../../../components/Session';
import { cardsDb } from '../../../../data/index';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import ReturnToPileIcon from '@material-ui/icons/Eject';
import Glory from '../../../../components/CommonSVGs/Glory';
import { shuffle } from '../../../../common/function';
import __isEqual from 'lodash/isEqual';

const propertyToCards = (source, property) => {
    return (
        source &&
        source[property] &&
        source[property]
            .split(',')
            .map(cardId => ({ ...cardsDb[cardId], id: cardId }))
    );
};

const useStyles = makeStyles(theme => ({
    tabs: {
        width: '100%',
    },

    root: {
        width: '100%',
        flex: 1,
        display: 'flex',
        height: '100%',
        backgroundColor: 'magenta',
        flexFlow: 'column nowrap',
        '& > *': {
            flex: '1 100%',
        },
    },
}));

export default function ObjectiveInteractionOverlay({ data, card, onAction }) {
    const hideHightlightedObjective = () => {
        //setObjectiveToHightlight(null);
    };

    const playCard = card => e => {
        onAction({
            type: 'SCORE_OBJECTIVE',
            payload: card
        });

        e.preventDefault();
    };

    const discardCard = card => e => {
        onAction({
            type: 'DISCARD_OBJECTIVE',
            payload: card,
        });

        e.preventDefault();
    };

    const returnToPile = (card, source) => e => {
        onAction({
            type: 'RETURN_OBJECTIVE_TO_PILE',
            payload: card
        });

        e.preventDefault();
    };

    return (
        <div
            style={{
                filter: 'drop-shadow(5px 5px 10px black)',
                display: 'flex',
                margin: 'auto',
                width: '60%',
                height: '100%',
                position: 'relative',
            }}
            onClick={hideHightlightedObjective}
        >
            <img
                src={`/assets/cards/${card.id}.png`}
                style={{ width: '100%' }}
            />
            <div style={{ width: '100%', backgroundColor: 'teal' }}>
                <ButtonBase
                    style={{
                        position: 'absolute',
                        bottom: '0%',
                        left: '0%',
                        marginLeft: '-1.5rem',
                        backgroundColor: 'dimgray',
                        color: 'gray',
                        width: '4rem',
                        height: '4rem',
                        borderRadius: '2rem',
                        boxSizing: 'border-box',
                        boxShadow: '0 0 10px 2px darkgoldenrod',
                        zIndex: 1,
                    }}
                    onClick={playCard(card)}
                >
                    <div
                        style={{
                            position: 'absolute',
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '2rem',
                            backgroundColor: 'goldenrod',
                            display: 'flex',
                        }}
                    ></div>
                    <Glory
                        style={{
                            // backgroundColor: 'orange',
                            color: 'darkgoldenrod',
                            width: '4.2rem',
                            height: '4.2rem',
                            borderRadius: '3rem',
                            position: 'absolute',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '2rem',
                            display: 'flex',
                            left: '1rem',
                            top: '-.5rem',
                        }}
                    >
                        <Typography
                            style={{
                                color: 'white',
                                fontSize: '3rem',
                                fontWeight: 800,
                            }}
                        >
                            {card.glory}
                        </Typography>
                    </div>
                </ButtonBase>
                <ButtonBase
                    style={{
                        position: 'absolute',
                        bottom: '0%',
                        right: '0%',
                        marginRight: '-2rem',
                        backgroundColor: 'red',
                        color: 'white',
                        width: '4rem',
                        height: '4rem',
                        borderRadius: '2rem',
                    }}
                    onClick={discardCard(card)}
                >
                    <DeleteIcon
                        style={{
                            width: '2rem',
                            height: '2rem',
                        }}
                    />
                </ButtonBase>
                <ButtonBase
                    style={{
                        position: 'absolute',
                        bottom: '5rem',
                        right: '0%',
                        marginRight: '-2rem',
                        backgroundColor: 'red',
                        color: 'white',
                        width: '4rem',
                        height: '4rem',
                        borderRadius: '2rem',
                    }}
                    onClick={returnToPile(card, 'OBJECTIVES_HAND')}
                >
                    <ReturnToPileIcon
                        style={{
                            width: '2rem',
                            height: '2rem',
                        }}
                    />
                </ButtonBase>
            </div>
        </div>
    );
}
