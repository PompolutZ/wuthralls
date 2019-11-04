import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuthUser } from '../../components/Session';
import DiceTray from '../../components/DiceTray';
import { FirebaseContext } from '../../firebase';
import { Typography, Button } from '@material-ui/core';
import { boards } from '../../data';
import { defineGrid, extendHex } from 'honeycomb-grid';
import * as SVG from 'svg.js';

const baseBoardWidth = 757;
const baseBoardHeight = 495;

function BoardSelectionOrderChooser({ data, tableId }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        console.log('BoardSelectionOrderChooser.OnData', data);
    }, [data]);

    const handlePickBoardFirst = async () => {
        const nextActiveStep = {
            type: 'PICK_FIRST_BOARD',
            waitingFor: myself.uid,
            pickingNext: data.opponents
        };

        await firebase.updateTable({
            step: nextActiveStep
        }, tableId);
    }

    const handlePickBoardSecond = async () => {
        console.log(data.opponents);
        const nextActiveStep = {
            type: 'PICK_FIRST_BOARD',
            waitingFor: data.opponents[0],
            pickingNext: [myself.uid]
        };

        await firebase.updateTable({
            step: nextActiveStep
        }, tableId);
    }

    if(data.waitingFor.includes(myself.uid)) {
        return (
            <div>
                <Typography variant="h5">Choosing borders selection order</Typography>
                <Typography>As you won initiative roll you need to decide who will pick the board first.</Typography>
                <br />
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: '1 0'}}>
                        <Typography>I will pick the board first and will place 3 objectives.</Typography>
                        <Button variant="outlined" color="primary" onClick={handlePickBoardFirst}>Pick first</Button>
                    </div>
                    <div style={{ flex: '1 0'}}>
                        <Typography>I will pick the board second, place 2 objectives but decide on how boards are positioned.</Typography>
                        <Button variant="outlined" color="secondary" onClick={handlePickBoardSecond}>Pick second</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Typography variant="h5">Choosing borders selection order</Typography>
            <Typography>You opponent has won initiative roll and will decide who picks the board first.</Typography>
        </div>
    )
}

export default BoardSelectionOrderChooser;