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

function FirstBoardPicker({ data, tableId }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);

    const handleSelectBoard = boardId => async () => {
        await firebase.addFirstBoard(tableId, boardId);

        const nextActiveStep = {
            type: 'PICK_SECOND_BOARD',
            waitingFor: data.pickingNext[0],
            firstBoardId: boardId,
            playerPickedFirst: myself.uid,
        };

        await firebase.updateTable({
            step: nextActiveStep
        }, tableId);
    }

    if(data.waitingFor !== myself.uid) {
        return (
            <div>
                <Typography variant="h5">First Board Selection</Typography>
                <Typography>You opponent is choosing the board.</Typography>
            </div>
        )
    }

    return (
        <div>
            <Typography variant="h5">First Board Selection</Typography>
            <Typography>Choose the board:</Typography>
            <br />
            <div>
                {
                    Object.keys(boards).map(boardId => (
                        <div key={boardId} onClick={handleSelectBoard(boardId)}>
                            <Typography>
                                {boards[boardId].name}
                            </Typography>
                            <img src={`/assets/boards/${boardId}.jpg`} width={baseBoardWidth / 4} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default FirstBoardPicker;
